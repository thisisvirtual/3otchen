/* Ateshane audio v2.
   SFX: ZzFX micro (vendor-zzfx.js) using presets from the ZzFX README plus
   conservative variants — proven "game" sounds instead of raw filter DSP.
   Music: a small lookahead sequencer, original loop in maqam hijaz with a
   maqsum-style darbuka pattern. Everything synthesised; deploy stays tiny. */
window.Audio2 = (() => {
'use strict';

let ac=null, master=null, comp=null, musicBus=null, musicFilter=null,
    windGain=null, windFlt=null;
let ready=false, muted=false, volume=0.45, stepsOn=true, musicOn=true;
const buffers={}, samples={}, loadingS={};
let playing={};                              // named handles for stoppable samples
const htmlEls={};                            // <audio> fallbacks, keyed like samples
const SAMPLE_URLS={
  gold:'assets/audio/3otchana.mp3',
  death:'assets/audio/ta3fita.mp3',
  step:'assets/audio/step.mp3',              // drop the file in: auto-picked-up
  radio:'assets/audio/radio.mp3',            // talkie-walkie (random slices)
  pant:'assets/audio/pant.mp3',              // heavy breathing (looped)
};
const MUSIC_BPM=126.25;                      // measured from rolling_bass
// music track state
let musicEl=null, musicSrc=null, useSeq=false, musicMode='menu', musicDuck=false;

function noiseBuffer(sec, brown){
  const n=Math.floor(ac.sampleRate*sec), buf=ac.createBuffer(1,n,ac.sampleRate);
  const d=buf.getChannelData(0); let last=0;
  for(let i=0;i<n;i++){
    const w=Math.random()*2-1;
    if(brown){ last=(last+0.02*w)/1.02; d[i]=last*3.4; } else d[i]=w;
  }
  return buf;
}

function init(){
  if(ready) return;
  try{
    ac = new (window.AudioContext||window.webkitAudioContext)();
    // soft limiter: many sfx stacking (pickup xN + music + wind) used to clip
    // straight into destination — audible crackle on phone speakers.
    comp=ac.createDynamicsCompressor();
    try{
      comp.threshold.value=-14; comp.knee.value=10; comp.ratio.value=5;
      comp.attack.value=.003;   comp.release.value=.18;
    }catch{}
    comp.connect(ac.destination);
    master=ac.createGain(); master.connect(comp);
    musicBus=ac.createGain(); musicBus.gain.value=0.4;
    musicFilter=ac.createBiquadFilter();      // « filtre passe-bas » : bouché au
    musicFilter.type='lowpass';               // menu, il s'ouvre quand on court
    musicFilter.frequency.value=750; musicFilter.Q.value=.7;
    musicBus.connect(musicFilter); musicFilter.connect(master);
    buffers.white=noiseBuffer(1.2,false);
    buffers.brown=noiseBuffer(3.0,true);
    // fold ZzFX into THIS context so its blips go through the same limiter
    // (stock ZzFX spins up its own AudioContext and hits destination raw).
    try{
      if(typeof zzfxX!=='undefined'&&zzfxX&&zzfxX!==ac){
        try{ zzfxX.close&&zzfxX.close(); }catch{}
        zzfxX=ac;
      }
      window.zzfxBus=master;
    }catch{}
    applyVolume();
    ready=true;
  }catch{ ready=false; }
}

function applyVolume(){
  if(master) master.gain.value = muted?0:volume;
  try{ zzfxV = muted?0:0.3; }catch{}
  for(const k in htmlEls)try{htmlEls[k].el.volume=muted?0:volume;}catch{}
}

function resume(){
  init();
  try{ if(ac&&ac.state==='suspended')ac.resume(); }catch{}
  try{ if(typeof zzfxX!=='undefined'&&zzfxX.state==='suspended')zzfxX.resume(); }catch{}
  for(const k in SAMPLE_URLS)                 // belt & braces: decode-at-gesture
    if(!samples[k]&&!loadingS[k])loadSample(k,SAMPLE_URLS[k]);
}

const fx = a=>{ if(muted) return; try{ zzfx(...a); }catch{} };

// ---- real recordings ------------------------------------------------------
async function loadSample(name,url){
  init(); if(!ready) return false;
  if(samples[name]) return true;
  if(loadingS[name]) return loadingS[name];
  loadingS[name]=(async()=>{
    try{
      const res=await fetch(url);
      samples[name]=await ac.decodeAudioData(await res.arrayBuffer());
      return true;
    }catch{ return false; }
    finally{ delete loadingS[name]; }
  })();
  return loadingS[name];
}
function playSample(name,gain=0.9,loop=false,maxDur=0,rate=1,offset=0){
  const b=samples[name]; if(!b||muted) return false;
  try{
    stopSample(name);
    const s=ac.createBufferSource(),g=ac.createGain();
    s.buffer=b; s.loop=loop;
    try{ s.playbackRate.value=rate; }catch{}
    const t0=ac.currentTime;
    g.gain.setValueAtTime(gain,t0);
    if(maxDur>0){
      // the cutoff is compiled into the audio graph at start time —
      // it executes on the audio clock even if the main thread stalls or throws
      g.gain.setValueAtTime(gain,t0+Math.max(0,maxDur-0.35));
      g.gain.linearRampToValueAtTime(0.0001,t0+maxDur);
      s.stop(t0+maxDur+0.05);
    }
    s.connect(g); g.connect(master); s.start(0,offset);
    playing[name]={s,g};
    s.onended=()=>{ if(playing[name]&&playing[name].s===s) delete playing[name]; };
    return true;
  }catch{ return false; }
}
// short overlapping one-shots (footsteps, radio slices): no handle, own tail
function oneShot(name,gain=0.6,rate=1,offset=0,dur=0){
  const b=samples[name]; if(!b||muted) return false;
  try{
    const s=ac.createBufferSource(),g=ac.createGain();
    s.buffer=b;
    try{ s.playbackRate.value=rate; }catch{}
    const t0=ac.currentTime;
    const d=dur>0?Math.min(dur,b.duration-offset):(b.duration-offset);
    g.gain.setValueAtTime(gain,t0);
    g.gain.setValueAtTime(gain,t0+Math.max(0,d-0.06));
    g.gain.linearRampToValueAtTime(0.0001,t0+d);
    s.connect(g); g.connect(master);
    s.start(t0,offset); s.stop(t0+d+0.03);
    s.onended=()=>{ try{s.disconnect();g.disconnect();}catch{} };
    return true;
  }catch{ return false; }
}
// <audio> element fallback — if WebAudio decode failed, the song still plays
function htmlPlay(name,maxDur=0,loop=false){
  try{
    let h=htmlEls[name];
    if(!h){
      h=htmlEls[name]={el:new Audio(SAMPLE_URLS[name]),tm:[]};
      h.el.preload='auto';
    }
    h.tm.forEach(clearTimeout);h.tm=[];
    h.el.loop=loop; h.el.currentTime=0;
    h.el.volume=muted?0:volume;
    const p=h.el.play(); if(p&&p.catch)p.catch(()=>{});
    if(maxDur>0){
      h.tm.push(setTimeout(()=>{ htmlStop(name,0.3); },Math.max(0,maxDur*1000-300)));
    }
    return true;
  }catch{ return false; }
}
function htmlStop(name,fade=0.2){
  const h=htmlEls[name]; if(!h) return;
  h.tm.forEach(clearTimeout);h.tm=[];
  const el=h.el, v0=el.volume, steps=5;
  for(let i=1;i<=steps;i++)
    h.tm.push(setTimeout(()=>{ el.volume=Math.max(0,v0*(1-i/steps));
      if(i===steps){ try{el.pause();el.currentTime=0;}catch{} el.volume=muted?0:volume; }
    },fade*1000*i/steps));
}
function stopSample(name,fade=0.18){
  htmlStop(name,fade);
  const h=playing[name]; if(!h) return;
  delete playing[name];
  try{
    const t=ac.currentTime;
    h.g.gain.cancelScheduledValues(t);        // kill the future revive/fade events
    h.g.gain.setValueAtTime(h.g.gain.value,t);
    h.g.gain.linearRampToValueAtTime(0.0001,t+fade);
  }catch{}
  try{ h.s.stop(ac.currentTime+fade+0.02); }catch{}   // may throw if already scheduled
  setTimeout(()=>{                            // belt & braces: sever from the graph
    try{h.s.disconnect();}catch{}
    try{h.g.disconnect();}catch{}
  },fade*1000+140);
}

// ---- SFX ------------------------------------------------------------------
// README presets: GameOver [,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17]
//                 Heart    [,,537,.02,.02,.22,1,1.59,-6.98,4.97]
//                 Piano    [1.5,.8,270,,.1,,1,1.5,,,,,,,,.1,.01]
//                 Drum     [,,129,.01,,.15,,,,,,,,5]
const V = {
  jump(){       fx([.6,,247,.02,.04,.14,,1.9,9,,,,,,,,,.7]); },
  doubleJump(){ fx([.4,,493,.01,.03,.1,4,.5,-9,,,,,,,,.05,.6]); },
  land(){       fx([.5,,129,.01,,.13,,,,,,,,5]); },                 // Drum, quiet
  step(){       if(!stepsOn) return;
                if(oneShot('step',.5,.94+Math.random()*.12,0,.4))return;
                // fallback: soft organic scuff, not the 8-bit blip
                try{
                  const s=ac.createBufferSource();s.buffer=buffers.white;
                  const f=ac.createBiquadFilter();f.type='bandpass';
                  f.frequency.value=300+Math.random()*140;f.Q.value=.9;
                  const g=ac.createGain(),t=ac.currentTime;
                  g.gain.setValueAtTime(.0001,t);
                  g.gain.exponentialRampToValueAtTime(.16,t+.012);
                  g.gain.exponentialRampToValueAtTime(.0001,t+.09);
                  s.connect(f);f.connect(g);g.connect(master);
                  s.start(t);s.stop(t+.1);
                }catch{} },
  pickup(combo=1){                                                   // Heart, pitch rises with combo
                const f=537*(1+Math.min(combo-1,8)*.09);
                fx([.7,,f,.02,.02,.22,1,1.59,-6.98,4.97]);
                fx([.2,,900,,.03,.12,4,.4,,,,,,,,,.08,.5]); },       // splash layer
  goldGet(dur=7.5,off=0){
                if(playSample('gold',1.0,true,dur,1,off))return;     // 3otchana from a moving start point
                loadSample('gold',SAMPLE_URLS.gold);                 // retry decode for next time
                if(htmlPlay('gold',dur,true))return;                 // <audio> fallback
                [293.66,369.99,440,587.33,880].forEach((f,i)=>       // last resort
                  setTimeout(()=>fx([1,.3,f,,.1,.3,1,1.5,,,,,,,,.1,.01]),i*70));
                fx([.5,,1400,,.06,.4,4,.3,,,,,,,,,.2,.4]); },
  goldEnd(){    fx([.4,,660,.01,.03,.1,1,1.2,-4]); },
  smash(){      fx([.8,,160,.01,.06,.22,4,1.6,-3,,,,,1.6,,.15,,.6]); },
  hit(){        fx([.9,,192,.01,.1,.3,4,1.9,-4,,,,,1.2,,.2,,.6]); },
  milestone(){  const notes=[293.66,369.99,440,587.33];
                notes.forEach((f,i)=>setTimeout(()=>fx([.8,.4,f,,.09,.22,1,1.5,,,,,,,,.08,.01]),i*95)); }, // Piano run
  over(){       fx([1,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17]); },  // Game Over (fallback)
  death(){      if(playSample('death',1.0))return;                   // ta3fita
                loadSample('death',SAMPLE_URLS.death);
                if(htmlPlay('death'))return;
                V.over(); },
  button(){     fx([.3,.05,220,.005,.02,.05,1,1.4]); },
  warn(){       fx([.25,,660,.01,.04,.12,1,1.2,-3]); },
};

// ---- event voices ---------------------------------------------------------
let dripTimer=null;
function dripOnce(){
  if(muted||!ready)return;
  // a drop from a dying tap: tiny descending blip + faint body
  fx([.5,.1,1350,.002,.015,.09,1,2.4,-22]);
  setTimeout(()=>fx([.2,,420,,.01,.06,1,1.2,-8]),46);
}
function dripStart(){ if(dripTimer)return; dripOnce(); dripTimer=setInterval(dripOnce,1350); }
function dripStop(){ if(dripTimer){clearInterval(dripTimer);dripTimer=null;} }

let rainSrc=null,rainGain=null;
function rainStart(){
  if(!ready||rainSrc)return;
  try{
    rainSrc=ac.createBufferSource();rainSrc.buffer=buffers.white;rainSrc.loop=true;
    const f=ac.createBiquadFilter();f.type='highpass';f.frequency.value=1900;
    rainGain=ac.createGain();rainGain.gain.value=0.0001;
    rainSrc.connect(f);f.connect(rainGain);rainGain.connect(master);
    rainSrc.start();
    rainGain.gain.linearRampToValueAtTime(.065,ac.currentTime+.8);
  }catch{}
}
function rainStop(){
  if(!rainGain)return;
  try{
    rainGain.gain.linearRampToValueAtTime(.0001,ac.currentTime+.9);
    rainSrc.stop(ac.currentTime+1);
  }catch{}
  rainSrc=null;rainGain=null;
}

const EV={
  powerDown(){ fx([.8,,320,.02,.12,.5,2,.6,,,-220,.2]); fx([.4,,90,.05,.2,.6,1,.5,-2]); },
  powerUp(){   fx([.6,,140,.02,.1,.3,2,.8,,,240,.15]); },
  horn(){      fx([.7,,390,.02,.16,.14,2,1.1]); setTimeout(()=>fx([.7,,310,.02,.2,.16,2,1.1]),210); },
  sizzle(){    fx([.4,,3200,.02,.3,.5,4,.2,,,,,,,,,.3,.3]); },
  chime(){     [660,880,1320].forEach((f,i)=>setTimeout(()=>fx([.5,.2,f,,.08,.3,1,1.4,,,,,,,,.08]),i*90)); },
  whistle(){   fx([.45,,2650,.004,.06,.05,1,2.6,,,60,.03]);
               setTimeout(()=>fx([.45,,2380,.004,.09,.06,1,2.6,,,-90,.04]),110); },
  radio(){     // random slice of the walkie-talkie sample, never the whole thing
               const b=samples.radio;
               if(b){
                 const len=.55+Math.random()*.55;
                 const off=Math.random()*Math.max(.01,b.duration-len-.05);
                 if(oneShot('radio',.55,1,off,len))return;
               }
               loadSample('radio',SAMPLE_URLS.radio);
               fx([.3,,1400,.005,.02,.04,4,.4]);                       // squelch fallback
               setTimeout(()=>fx([.22,.08,320,,.14,.18,2,.5,,,,,,.6]),60);
               setTimeout(()=>fx([.3,,1750,.004,.015,.04,4,.4]),340); },
  whipCrack(){ fx([1.3,,1150,.002,.012,.09,4,3.1,-38,,,,,.7,,.22,,.55]);
               setTimeout(()=>fx([.6,,110,.006,.04,.16,,1.4,-6]),24); },
  sunRoar(){   fx([.9,.15,58,.09,.42,.7,4,.35,,,,,,3.2]);
               fx([.45,,2500,.04,.24,.5,4,.2,,,,,,,,,.25,.35]); },
  gust(){      fx([1.1,.05,340,.22,.5,.9,4,.7,,,,,,2.4,,.3,.2]);
               setTimeout(()=>fx([.7,,180,.16,.6,.8,4,1.1,,,,,,3]),140); },
  sparkle(){   [1046,1318,1568,2093].forEach((f,i)=>
                 setTimeout(()=>fx([.5,,f,,.05,.22,1,1.4,,,,,,,,.1,.02]),i*55)); },
};

// ---- thirsty panting ------------------------------------------------------
let pantTimer=null,pantPhase=0,pantH=null;
function pantOnce(){
  if(muted||!ready)return;
  pantPhase^=1;
  const f0=pantPhase?820:560, gain=pantPhase?.055:.042;   // exhale / inhale
  try{
    const s=ac.createBufferSource();s.buffer=buffers.white;s.loop=true;
    const flt=ac.createBiquadFilter();flt.type='bandpass';flt.Q.value=.8;
    const t=ac.currentTime;
    flt.frequency.setValueAtTime(f0,t);
    flt.frequency.exponentialRampToValueAtTime(f0*(pantPhase?.62:1.25),t+.22);
    const g=ac.createGain();
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(gain,t+.05);
    g.gain.exponentialRampToValueAtTime(.0001,t+.26);
    s.connect(flt);flt.connect(g);g.connect(master);
    s.start(t);s.stop(t+.3);
  }catch{}
}
function pantStart(){
  if(pantTimer||pantH)return;
  if(samples.pant&&!muted){                  // his real breathing, looped
    try{
      const s2=ac.createBufferSource(),g2=ac.createGain();
      s2.buffer=samples.pant; s2.loop=true;
      try{s2.playbackRate.value=.99;}catch{}
      const t0=ac.currentTime;
      g2.gain.setValueAtTime(.0001,t0);
      g2.gain.linearRampToValueAtTime(.5,t0+.4);
      s2.connect(g2);g2.connect(master);s2.start();
      pantH={s:s2,g:g2};
      return;
    }catch{}
  }
  pantPhase=0; pantOnce(); pantTimer=setInterval(pantOnce,470);
}
function pantStop(){
  if(pantTimer){clearInterval(pantTimer);pantTimer=null;}
  if(pantH){
    const h=pantH; pantH=null;
    try{
      const t0=ac.currentTime;
      h.g.gain.cancelScheduledValues(t0);
      h.g.gain.setValueAtTime(h.g.gain.value,t0);
      h.g.gain.linearRampToValueAtTime(.0001,t0+.3);
      h.s.stop(t0+.35);
    }catch{}
    setTimeout(()=>{try{h.s.disconnect();h.g.disconnect();}catch{}},420);
  }
}

// ---- wind (very subtle) ---------------------------------------------------
let windSrc=null;
function startWind(){
  if(!ready||windSrc) return;
  try{
    windSrc=ac.createBufferSource(); windSrc.buffer=buffers.brown; windSrc.loop=true;
    windFlt=ac.createBiquadFilter(); windFlt.type='lowpass'; windFlt.frequency.value=460; windFlt.Q.value=.5;
    windGain=ac.createGain(); windGain.gain.value=0;
    windSrc.connect(windFlt); windFlt.connect(windGain); windGain.connect(master);
    windSrc.start();
  }catch{}
}
function setWind(i){
  if(!windGain) return;
  try{
    const t=ac.currentTime;
    windGain.gain.linearRampToValueAtTime(.012+i*.05, t+.3);
    windFlt.frequency.linearRampToValueAtTime(380+i*680, t+.3);
  }catch{}
}
function stopWind(){ if(windGain) try{ windGain.gain.linearRampToValueAtTime(.0001,ac.currentTime+.4);}catch{} }

// ---- music: hijaz loop + maqsum darbuka, lookahead-scheduled --------------
// Hijaz on D: D Eb F# G A Bb C — the interval set that instantly reads Maghreb/Mashriq.
const N={D4:293.66,Eb4:311.13,Fs4:369.99,G4:392.00,A4:440.00,Bb4:466.16,C5:523.25,D5:587.33,A3:220.00,D3:146.83,G3:196.00};
const STEPS=32, STEP_DUR=0.155;                       // 16ths at ~97 BPM
// maqsum: D-T--T-D--T- feel over 8, doubled to 16ths
const DOUM=[0,6,8,20,22];
const TEK =[4,10,12,14,26,28,30];
const BASS=[[0,'D3'],[8,'D3'],[16,'G3'],[20,'A3'],[24,'D3']];
const MEL =[[0,'D4',2],[2,'Eb4',2],[4,'Fs4',4],[8,'A4',3],[12,'G4',2],[14,'Fs4',2],
            [16,'Bb4',3],[20,'A4',2],[22,'G4',2],[24,'Fs4',4],[28,'Eb4',2],[30,'D4',2]];

let musicTimer=null, nextStepTime=0, stepIdx=0, phrase=0;

// ---- the background track (Rolling Bass) --------------------------------
const MUSIC_MODES={                    // gain is pre-duck; freq drives the passe-bas
  menu:{f:750,  g:.40},
  play:{f:15500,g:.50},
  boon:{f:19000,g:.58},                // a boon owns the room
  pause:{f:520, g:.20},
  over:{f:430,  g:.13},
};
function applyMusicTarget(){
  if(!ready)return;
  const m=MUSIC_MODES[musicMode]||MUSIC_MODES.menu;
  const g=m.g*(musicDuck?.25:1);
  try{
    const t=ac.currentTime;
    musicFilter.frequency.cancelScheduledValues(t);
    musicFilter.frequency.setValueAtTime(Math.max(40,musicFilter.frequency.value),t);
    musicFilter.frequency.exponentialRampToValueAtTime(m.f,t+.8);
    musicBus.gain.cancelScheduledValues(t);
    musicBus.gain.setValueAtTime(musicBus.gain.value,t);
    musicBus.gain.linearRampToValueAtTime(g,t+.8);
  }catch{}
}
function setMusicMode(m){ musicMode=m; applyMusicTarget(); }
function musicRate(r){                 // pitch rides along: that's the point
  if(!musicEl)return;
  try{ musicEl.preservesPitch=false; musicEl.mozPreservesPitch=false;
       musicEl.webkitPreservesPitch=false; }catch{}
  try{ musicEl.playbackRate=r; }catch{}
}
function initMusicEl(){
  if(musicEl||useSeq)return;
  try{
    musicEl=new Audio('assets/audio/rolling_bass.mp3');
    musicEl.loop=true; musicEl.preload='auto';
    musicEl.addEventListener('error',()=>{ useSeq=true; musicEl=null;
      if(musicOn)startSeq(); });
    musicSrc=ac.createMediaElementSource(musicEl);
    musicSrc.connect(musicBus);
  }catch{ useSeq=true; musicEl=null; }
}

function schedNote(freq,t,dur,type,gain,slide=0){
  const o=ac.createOscillator(),g=ac.createGain();
  o.type=type; o.frequency.setValueAtTime(freq,t);
  if(slide) o.frequency.exponentialRampToValueAtTime(freq*slide,t+dur);
  g.gain.setValueAtTime(.0001,t);
  g.gain.exponentialRampToValueAtTime(gain,t+.012);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g); g.connect(musicBus); o.start(t); o.stop(t+dur+.02);
}
function schedNoise(t,dur,f0,gain,type='highpass'){
  const s=ac.createBufferSource(); s.buffer=buffers.white; s.loop=true;
  const f=ac.createBiquadFilter(); f.type=type; f.frequency.value=f0;
  const g=ac.createGain();
  g.gain.setValueAtTime(gain,t);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(f); f.connect(g); g.connect(musicBus);
  s.start(t); s.stop(t+dur+.02);
}
function scheduleStep(i,t){
  if(DOUM.includes(i)){ schedNote(82,t,.16,'sine',.5,0.72); }                 // doum
  if(TEK.includes(i)){  schedNoise(t,.05,3600,.16); }                          // tek
  if(i%2===0 && ((i+phrase*2)%8===6)) schedNoise(t,.03,5200,.07);             // ghost tek
  for(const [s,n] of BASS) if(s===i) schedNote(N[n],t,.3,'triangle',.20);
  if(phrase%4!==3)                                                             // breathe every 4th phrase
    for(const [s,n,d] of MEL) if(s===i) schedNote(N[n],t,d*STEP_DUR*.9,'square',.055);
}
function musicTick(){
  if(!ready||!musicOn||!useSeq) return;
  if(nextStepTime < ac.currentTime - 0.05)     // tab was hidden: drop missed steps,
    nextStepTime = ac.currentTime + 0.08;      // never machine-gun them on return
  while(nextStepTime < ac.currentTime + 0.12){
    scheduleStep(stepIdx,nextStepTime);
    nextStepTime += STEP_DUR;
    stepIdx=(stepIdx+1)%STEPS;
    if(stepIdx===0) phrase++;
  }
}
function startSeq(){
  if(!ready||musicTimer) return;
  stepIdx=0; phrase=0; nextStepTime=ac.currentTime+0.06;
  musicTimer=setInterval(musicTick,40);
}
function startMusic(){
  init(); if(!ready) return;
  musicOn=true;
  initMusicEl();
  if(musicEl){
    const p=musicEl.play();
    if(p&&p.catch)p.catch(err=>{
      if(!(err&&err.name==='NotAllowedError')){  // real failure -> synth fallback
        useSeq=true; musicEl=null; startSeq();
      }                                          // autoplay block: gesture retries
    });
  }else startSeq();
  applyMusicTarget();
}
function stopMusic(){
  musicOn=false;
  if(musicTimer){clearInterval(musicTimer);musicTimer=null;}
  if(musicEl)try{musicEl.pause();}catch{}
}
function duckMusic(low){ musicDuck=!!low; applyMusicTarget(); }
// keep the bed out of the way when the tab hides; pick it back up on return
document.addEventListener&&document.addEventListener('visibilitychange',()=>{
  if(!musicEl)return;
  if(document.hidden){ try{musicEl.pause();}catch{} }
  else if(musicOn){ const p=musicEl.play(); if(p&&p.catch)p.catch(()=>{}); }
});

// ---- public ---------------------------------------------------------------
function beatRate(){                   // beats per second, playbackRate included
  return MUSIC_BPM/60*((musicEl&&musicEl.playbackRate)||1);
}
function beatPhase(){
  if(musicEl&&!useSeq&&!musicEl.paused&&musicEl.currentTime>0)
    return (musicEl.currentTime*MUSIC_BPM/60)%1;
  return -1;
}
const api={
  resume,startWind,setWind,stopWind,startMusic,stopMusic,duckMusic,setMusicMode,musicRate,beatPhase,beatRate,
  loadSample,stopSample,pantStart,pantStop,
  dripStart,dripStop,rainStart,rainStop,
  setVolume(v){ volume=Math.max(0,Math.min(1,v)); applyVolume(); },
  get volume(){ return volume; },
  setSteps(on){ stepsOn=!!on; },
  get steps(){ return stepsOn; },
  get musicOn(){ return !!musicTimer; },
  toggleMute(){ muted=!muted; applyVolume(); return muted; },
  get muted(){ return muted; },
};
for(const k of Object.keys(V)) api[k]=(...a)=>{ if(!muted) try{V[k](...a);}catch{} };
for(const k of Object.keys(EV)) api[k]=()=>{ if(!muted) try{EV[k]();}catch{} };
return api;
})();
