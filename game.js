/* Ateshane — course contre la soif
   States: MENU → READY → PLAY → OVER  (the Flappy loop: tap anywhere to launch,
   world holds still until the first tap, one tap back into a run). */
(() => {
'use strict';
const BUILD='v22';

// ---------------------------------------------------------------- config
const VH=540, GROUND_OFF=92, MAX_JUMPS=2;
const GRAV_UP=1800, GRAV_DOWN=2650, JUMP_V=-620, JUMP_CUT=.45;
const SPEED_START=235, SPEED_RAMP=0.0295, SPEED_MAX=780, REGION_LEN=4800;
const EASE_IN=0.9;                       // seconds from standstill to full start speed
const COMBO_WINDOW=2.4;                  // seconds between pickups to keep the chain
const GOLD_AT=5, GOLD_TIME=7, COMBO_CAP=9;
const SHOUTS={3:'Behi !',5:'Barcha !',7:'Sa77a !',9:'Wa7ch !'};

// ---------------------------------------------------------------- i18n
// Tounsi is the soul; FR/EN are full translations. Signature shouts stay derja.
const LANGS=['tn','fr','en'];
const I18N={
tn:{dir:'rtl',
 tag:'سابق العطش · SABBE9 EL 3TACH', namePh:'شنيّة إسمك ؟', nameHint:'بلا إسم ما تجريش !',
 play:'ابدأ', playLat:'YALLA !', help:'كيفاش نلعب', helpLat:'KIFECH ?',
 scores:'أحسن النتائج', scoresLat:'RECORDS', settings:'الإعدادات', settingsLat:'SETTINGS',
 best:'أحسن نتيجة : ',
 helpTitle:'كيفاش نلعب',
 h1:'دُزّ باش <b>تنقّز</b> — دُزّ مرّة أخرى في الهواء باش تنقّز <b>زوز</b>. أطلق فيسع، النقزة تقصر.',
 h2:'لمّ <b>الدبابز</b> : يعبّيولك القربة ويطلّعولك <b>الكومبو</b> (×2…×9).',
 h3:'الدبّوزة الذهبيّة الصغيرة في الشاشة <b>تتعبّى وإنتي تلعب</b>. كي تعبى : <b>٧ ثواني ذهب</b>، تكسّر كل شي.',
 h4:'كان دقّيت في حاجة، <b>وفات</b>. دقّة وحدة برك.',
 h5:'القربة <b>تنقص وإنتي تجري</b>. فرغت = وفات… وباش تسمعو يلهث.',
 go:'يالله', goLat:'NEBDEW !',
 scoresTitle:'أحسن النتائج', empty:'حتى حد مازال ما جراش…', back:'ارجع',
 setTitle:'الإعدادات', sound:'الصوت', steps:'صوت الخطوات', vol:'حجم الصوت',
 lang:'اللغة', wipe:'امسح النتائج', on:'مفعّل', off:'مسكّر',
 pauseEyebrow:'وقفة', pauseBody:' متر — خوذ نفس.', resume:'كمّل', resumeLat:'KAMMEL',
 retryFull:'عاود من الأوّل', menuBtn:'القائمة', retry:'عاود', retryLat:'3AWED !',
 readyTitle:'دُزّ باش تبدا', readyRun:n=>`اجري يا ${n} !`, readyBest:'أحسن نتيجة : ',
 install:'ركّب «عطشان» في تليفونك — يخدم حتّى بلا إنترنت',
 installIOS:'باش تركّب «عطشان» : دزّ على ⬆️ وبعد «Add to Home Screen»',
 installBtn:'ركّب',
 m:'متر', bottlesU:'دبّوزة', pts:'نقاط',
 sumOf:(r,m,b)=>`${r} — ${m} متر · ${b} دبّوزة`,
 rank1:'🏆 رقم قياسي جديد !', rankN:n=>`رقمك #${n} في الأحسن`,
 arrived:'Wselt ! +100', graze:'B’ch3ra ! +10', bidon:'Bidoun ! +38', heavy:'Th9il…',
 lightBack:'Rja3 el dhaw !', escapedSun:'هربت منها !', bribePop:'☕ قهوتك… −30',
 thirst:['العطش غلبك 😮‍💨','القربة فرغت…','حتى قطرة ما بقات'],
 burn:['الشمس كلاتك ☀️','قلتلك البس كسكّة…','شويتني… ☀️'],
 crash:['دقّيتها… 🌵','شفتها وما نقّزتش ؟!','الحيط ما يتنحّاش يا بطل'],
 copStop:'A9EF ! 🚔',
 dlg:['بطاقة تعريف !','ما عنديش…','ما عندكش ؟! عدّيه تحقيق !','شوف… خوذ قهوتك ☕'],
 dlgGo:'يزّي، برّا !', tapNext:'دزّ ↓',
 frozeMain:'دسولي… الضو قصّ 😅',
 regions:['سيدي بوسعيد','مدينة تونس','القيروان','دوز','شط الجريد','قرطاج','الصحراء'],
 stopPaddle:'قف', waterLbl:'ما', enOr:'ذهب !',
 boonGold:'ذهب !', boonRain:'شتا دبابز !', boonWind:'ريح الصحرا !',
 boonGoldSub:'كسّر كل شي', boonRainSub:'الدبابز طايحة !', boonWindSub:'الريح تجرفهم',
 world:'العالم', mine:'متاعي', boardOff:'الترتيب العالمي ما يخدمش توّا',
 wkTab:'هالجمعة', allTab:'الكل', youAre:'إنتي', ofN:(r,n)=>`${r} من ${n} لاعب`,
 ev:{coupure:['\u26a0 EL MA BECH YET9TA3','EL MA MA9TOU3 !'],
     delestage:['⚠ EL DHAW BECH YEMCHI','DHAW MA9TOU3 !'],
     canicule:['⚠ S’HANA JEYA','S’HANA !'],
     citerne:['✦ CAMION EL MA','CAMION EL MA !'],
     pluie:['🌧 EL CHTA JEYA','EL CHTA ! 🌧'],
     chams:['⚠ CHAMS GHADHBA','CHAMS GHADHBA !'],
     police:['🚔 BARRAGE POLICE','A9EF !'],
     dhaw9ass:['','']},
},
fr:{dir:'ltr',
 tag:'Cours plus vite que la soif', namePh:'Ton petit nom ?', nameHint:'Pas de nom, pas de course !',
 play:'Jouer', playLat:'YALLA !', help:'Comment jouer', helpLat:'KIFECH ?',
 scores:'Meilleurs scores', scoresLat:'RECORDS', settings:'Réglages', settingsLat:'SETTINGS',
 best:'Record : ',
 helpTitle:'Comment jouer',
 h1:'Tape pour <b>sauter</b> — retape en l’air pour le <b>double saut</b>. Relâche tôt, le saut raccourcit.',
 h2:'Ramasse les <b>bouteilles</b> : elles remplissent la gourde et montent le <b>combo</b> (×2…×9).',
 h3:'La petite bouteille dorée à l’écran <b>se remplit en jouant</b>. Pleine : <b>7 s en or</b>, tu casses tout.',
 h4:'Tu touches un obstacle, <b>c’est fini</b>. Un seul choc suffit.',
 h5:'La gourde <b>se vide en courant</b>. Vide = fini… et tu l’entendras haleter.',
 go:'Allez', goLat:'NEBDEW !',
 scoresTitle:'Meilleurs scores', empty:'Personne n’a encore couru…', back:'Retour',
 setTitle:'Réglages', sound:'Son', steps:'Bruits de pas', vol:'Volume',
 lang:'Langue', wipe:'Effacer les scores', on:'Activé', off:'Coupé',
 pauseEyebrow:'Pause', pauseBody:' m — respire un coup.', resume:'Continuer', resumeLat:'KAMMEL',
 retryFull:'Recommencer', menuBtn:'Menu', retry:'Rejouer', retryLat:'3AWED !',
 readyTitle:'Tape pour partir', readyRun:n=>`Cours, ${n} !`, readyBest:'Record : ',
 install:'Installe « Ateshane » — ça marche même sans internet',
 installIOS:'Pour installer : touche ⬆️ puis « Sur l’écran d’accueil »',
 installBtn:'Installer',
 m:'m', bottlesU:'bouteilles', pts:'points',
 sumOf:(r,m,b)=>`${r} — ${m} m · ${b} bouteilles`,
 rank1:'🏆 Nouveau record !', rankN:n=>`#${n} au classement`,
 arrived:'Bien arrivé ! +100', graze:'Chaud ! +10', bidon:'Bidon ! +38', heavy:'Lourd…',
 lightBack:'Le courant revient !', escapedSun:'Soleil semé !', bribePop:'☕ la « kahwa »… −30',
 thirst:['La soif t’a eu 😮‍💨','La gourde est vide…','Plus une goutte'],
 burn:['Le soleil t’a cuit ☀️','Je t’avais dit, la kachabia…','Grillé… ☀️'],
 crash:['En plein dedans… 🌵','Tu l’as vu et t’as pas sauté ?!','Le mur ne bouge pas, champion'],
 copStop:'HALTE ! 🚔',
 dlg:['Papiers !','J’en ai pas…','T’en as pas ?! Au poste !','Tiens… ta kahwa ☕'],
 dlgGo:'Allez, file !', tapNext:'Tape ↓',
 frozeMain:'Désolé… coupure de courant 😅',
 regions:['Sidi Bou Saïd','Médina de Tunis','Kairouan','Douz','Chott el Djerid','Carthage','Le Sahara'],
 stopPaddle:'STOP', waterLbl:'EAU', enOr:'EN OR !',
 boonGold:'EN OR !', boonRain:'PLUIE DE BOUTEILLES !', boonWind:'VENT DE SABLE !',
 boonGoldSub:'casse tout', boonRainSub:'ça tombe du ciel !', boonWindSub:'le vent les balaie',
 world:'Monde', mine:'Moi', boardOff:'Classement mondial indisponible',
 wkTab:'Semaine', allTab:'Tout', youAre:'Toi', ofN:(r,n)=>`${r} sur ${n} joueurs`,
 ev:{coupure:['\u26a0 COUPURE D\u2019EAU IMMINENTE','EAU COUPÉE !'],
     delestage:['⚠ DÉLESTAGE IMMINENT','COURANT COUPÉ !'],
     canicule:['⚠ CANICULE EN APPROCHE','CANICULE !'],
     citerne:['✦ CAMION-CITERNE','CAMION D’EAU !'],
     pluie:['🌧 LA PLUIE ARRIVE','LA PLUIE ! 🌧'],
     chams:['⚠ LE SOLEIL EST FURAX','SOLEIL EN COLÈRE !'],
     police:['🚔 BARRAGE POLICE','HALTE !'],
     dhaw9ass:['','']},
},
en:{dir:'ltr',
 tag:'Outrun the thirst', namePh:'Your name?', nameHint:'No name, no run!',
 play:'Play', playLat:'YALLA !', help:'How to play', helpLat:'KIFECH ?',
 scores:'Best scores', scoresLat:'RECORDS', settings:'Settings', settingsLat:'SETTINGS',
 best:'Best: ',
 helpTitle:'How to play',
 h1:'Tap to <b>jump</b> — tap again mid-air for a <b>double jump</b>. Release early for a short hop.',
 h2:'Grab <b>bottles</b>: they refill the waterskin and build your <b>combo</b> (×2…×9).',
 h3:'The little golden bottle on screen <b>fills as you play</b>. Full: <b>7 s of gold</b>, smash everything.',
 h4:'Hit anything and <b>it’s over</b>. One touch is enough.',
 h5:'The waterskin <b>drains as you run</b>. Empty = done… and you’ll hear him pant.',
 go:'Let’s go', goLat:'NEBDEW !',
 scoresTitle:'Best scores', empty:'Nobody has run yet…', back:'Back',
 setTitle:'Settings', sound:'Sound', steps:'Footsteps', vol:'Volume',
 lang:'Language', wipe:'Wipe scores', on:'On', off:'Off',
 pauseEyebrow:'Paused', pauseBody:' m — catch your breath.', resume:'Resume', resumeLat:'KAMMEL',
 retryFull:'Restart', menuBtn:'Menu', retry:'Again', retryLat:'3AWED !',
 readyTitle:'Tap to start', readyRun:n=>`Run, ${n}!`, readyBest:'Best: ',
 install:'Install “Ateshane” — works even offline',
 installIOS:'To install: tap ⬆️ then “Add to Home Screen”',
 installBtn:'Install',
 m:'m', bottlesU:'bottles', pts:'points',
 sumOf:(r,m,b)=>`${r} — ${m} m · ${b} bottles`,
 rank1:'🏆 New record!', rankN:n=>`#${n} on the board`,
 arrived:'Made it! +100', graze:'Close one! +10', bidon:'Jerrican! +38', heavy:'Heavy…',
 lightBack:'Power’s back!', escapedSun:'Outran the sun!', bribePop:'☕ “coffee money”… −30',
 thirst:['Thirst got you 😮‍💨','The waterskin ran dry…','Not a drop left'],
 burn:['The sun cooked you ☀️','Told you to wear the kachabia…','Toasted… ☀️'],
 crash:['Right into it… 🌵','You saw it and didn’t jump?!','The wall won’t move, champ'],
 copStop:'HALT! 🚔',
 dlg:['ID card!','Don’t have one…','No ID?! You’re coming in!','Here… coffee money ☕'],
 dlgGo:'Go on, move!', tapNext:'Tap ↓',
 frozeMain:'Sorry… power’s out 😅',
 regions:['Sidi Bou Saïd','Tunis Medina','Kairouan','Douz','Chott el Djerid','Carthage','The Sahara'],
 stopPaddle:'STOP', waterLbl:'WATER', enOr:'IN GOLD!',
 boonGold:'GOLD RUSH!', boonRain:'BOTTLE RAIN!', boonWind:'SANDSTORM!',
 boonGoldSub:'smash everything', boonRainSub:'they fall from the sky!', boonWindSub:'the wind clears the way',
 world:'World', mine:'Me', boardOff:'Global board unavailable',
 wkTab:'Week', allTab:'All time', youAre:'You', ofN:(r,n)=>`${r} of ${n} players`,
 ev:{coupure:['\u26a0 WATER CUT INCOMING','WATER\u2019S CUT!'],
     delestage:['⚠ BLACKOUT INCOMING','POWER’S OUT!'],
     canicule:['⚠ HEATWAVE INCOMING','HEATWAVE!'],
     citerne:['✦ WATER TRUCK','WATER TRUCK!'],
     pluie:['🌧 RAIN INCOMING','RAIN! 🌧'],
     chams:['⚠ THE SUN IS FURIOUS','ANGRY SUN!'],
     police:['🚔 POLICE CHECKPOINT','HALT!'],
     dhaw9ass:['','']},
},
};
let lang='tn';
const t=k=>I18N[lang][k];
const regionName=i=>(I18N[lang].regions||[])[i]||REGIONS[i].name;
const evTxt=(type,i)=>I18N[lang].ev[type][i];
/* Les Événements — world events drawn from the real 2026 water summer.
   No real institution is named on purpose: satire aims at the situation. */
const EVENTS={
  coupure:  {dur:8,  tel:'⚠ EL MA BECH YET9TA3', name:'EL MA MA9TOU3 !', w:26},
  delestage:{dur:9,  tel:'⚠ EL DHAW BECH YEMCHI', name:'DHAW MA9TOU3 !',  w:20},
  canicule: {dur:12, tel:'⚠ S\u2019HANA JEYA',    name:'S\u2019HANA !',  w:22},
  citerne:  {dur:6.5,tel:'\u2726 CAMION EL MA',   name:'CAMION EL MA !',  w:20},
  pluie:    {dur:10, tel:'\ud83c\udf27 EL CHTA JEYA', name:'EL CHTA ! \ud83c\udf27', w:12},
  chams:    {dur:13, tel:'\u26a0 CHAMS GHADHBA',  name:'CHAMS GHADHBA !', w:14, min:320},
  police:   {dur:14, tel:'\ud83d\ude94 BARRAGE POLICE', name:'A9EF !',    w:12, min:260},
  dhaw9ass: {dur:2.8,tel:'',                       name:'',               w:8,  min:200},
};
const EVENT_FIRST=11, EVENT_GAP=[13,21];
// La jauge d'or fills by playing well; full = gold mode. No pickup to chase.
const GOLD_FULL=100, GOLD_PER_BOTTLE=7, GOLD_PER_PASS=4, GOLD_PER_GRAZE=6;
// The gauge used to pay out the same seven seconds and the same song, forever.
// Now it draws from a bag of three, so no two fills feel alike.
const BOONS={
  dhahab:{dur:7,   col:'#F5D77E', rgb:'255,232,150'},
  chta:  {dur:8.5, col:'#7FC4EE', rgb:'150,215,255'},
  rih:   {dur:6,   col:'#E0A85C', rgb:'238,196,130'},
};
let boonBag=[];
function nextBoon(){
  if(!boonBag.length){
    boonBag=Object.keys(BOONS);
    for(let i=boonBag.length-1;i>0;i--){
      const j=(Math.random()*(i+1))|0;
      [boonBag[i],boonBag[j]]=[boonBag[j],boonBag[i]];
    }
    if(boonBag[boonBag.length-1]===game.boonLast&&boonBag.length>1)
      boonBag.unshift(boonBag.pop());          // no repeat across the seam
  }
  return boonBag.pop();
}
const BRAND_NAME={delice:'Délice',hayat:'Hayat',marwa:'Marwa',mira:'Mira',
  palma:'Palma',sabrine:'Sabrine',tijen:'Tijen'};

const BRANDS=['delice','hayat','marwa','mira','palma','sabrine','tijen'];
const BRAND_TINT={delice:'#2E76B8',hayat:'#C4453B',marwa:'#3E8FC4',mira:'#5A7FA8',
  palma:'#D93A6A',sabrine:'#C4453B',tijen:'#C9A227'};

const REGIONS=[
  {name:'Sidi Bou Saïd',  sky:['#8FC7E8','#DCEBF5'],sand:'#E7C892',hill:'#C9A97A',build:'#F7F4EE',trim:'#17457A',sun:'#FBE9B0',night:0},
  {name:'Médina de Tunis',sky:['#9AC4DC','#F0DCBE'],sand:'#DFB578',hill:'#C09A66',build:'#F2E7D2',trim:'#2E76B8',sun:'#FBDF9A',night:0},
  {name:'Kairouan',       sky:['#B9CBD6','#F6D9A6'],sand:'#DCA45E',hill:'#B98A4C',build:'#EFDDBC',trim:'#8A6A3A',sun:'#F9D07E',night:0},
  {name:'Douz',           sky:['#CFC3A8','#F4C97E'],sand:'#D69850',hill:'#B07E42',build:'#E8D2A8',trim:'#96633A',sun:'#F6B85C',night:0},
  {name:'Chott el Djerid',sky:['#B98CA8','#F3B08A'],sand:'#D9A88E',hill:'#A87E74',build:'#E9CBBE',trim:'#7A4A5A',sun:'#F58C6A',night:.2},
  {name:'Carthage',       sky:['#2C3F6B','#7C6A8E'],sand:'#8A7A72',hill:'#5E5460',build:'#B8A896',trim:'#2C3F6B',sun:'#E8C88A',night:.7},
  {name:'Le Sahara',      sky:['#101C38','#2E3B62'],sand:'#5A4E48',hill:'#3A3440',build:'#6E6258',trim:'#101C38',sun:'#F0EAD2',night:1},
];

// ---------------------------------------------------------------- utils
const hex2rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const rgb2hex=c=>'#'+c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
const lerp=(a,b,t)=>a+(b-a)*t;
const mixHex=(a,b,t)=>{const A=hex2rgb(a),B=hex2rgb(b);
  return rgb2hex([lerp(A[0],B[0],t),lerp(A[1],B[1],t),lerp(A[2],B[2],t)]);};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

const store={_m:{},
  get(k,d){try{const v=localStorage.getItem(k);return v===null?d:v;}catch{return this._m[k]??d;}},
  set(k,v){try{localStorage.setItem(k,v);}catch{this._m[k]=String(v);}}};

// ---------------------------------------------------------------- high scores
const SCORES_KEY='ateshane.scores';
function loadScores(){ try{const a=JSON.parse(store.get(SCORES_KEY,'[]'));return Array.isArray(a)?a:[];}catch{return [];} }
function saveScore(name,score,m){
  const a=loadScores();
  a.push({n:(name||'Anonyme').slice(0,12),s:score,m,d:Date.now()});
  a.sort((x,y)=>y.s-x.s);
  const top=a.slice(0,10);
  store.set(SCORES_KEY,JSON.stringify(top));
  return top.findIndex(e=>e.d && e.s===score && e.n===(name||'Anonyme').slice(0,12));
}
const bestScore=()=>loadScores()[0]?.s||0;

// ---------------------------------------------------------------- global board
// Same-origin /api/scores. If it isn't deployed or isn't configured, every call
// fails soft and the panel shows the local board instead — the game never waits
// on the network and never breaks because of it.
const BOARD={scope:'week',rows:null,me:null,total:0,week:'',state:'idle',ts:0,key:''};

// A per-device id, generated once and kept. The board keys on this, never on the
// name: keying by name meant two players called Nour shared one row and
// overwrote each other, which is certain to happen the moment this is public.
const UID_KEY='ateshane.uid';
function myUid(){
  let u=store.get(UID_KEY,'');
  if(!/^[A-Za-z0-9_-]{8,24}$/.test(u)){
    let r=new Uint8Array(12);
    if(typeof crypto!=='undefined'&&crypto.getRandomValues)crypto.getRandomValues(r);
    else for(let i=0;i<12;i++)r[i]=(Math.random()*256)|0;
    u=Array.from(r,x=>x.toString(36).padStart(2,'0')).join('').slice(0,16);
    store.set(UID_KEY,u);
  }
  return u;
}
// Same origin by default. Set window.ATESHANE_API in index.html to point every
// future build at one fixed board — handy because each Vercel Drop spins up a
// brand-new project that won't carry the old environment variables.
const API_URL=((typeof window!=='undefined'&&window.ATESHANE_API)||'')
  .replace(/\/+$/,'')+'/api/scores';
async function api(path,opts={},ms=6000){
  if(typeof fetch!=='function')return null;
  const ac=typeof AbortController==='function'?new AbortController():null;
  const kill=ac?setTimeout(()=>ac.abort(),ms):0;
  try{
    const r=await fetch(path,{...opts,cache:'no-store',
      ...(ac?{signal:ac.signal}:{})});
    if(!r.ok)return null;
    return await r.json();
  }catch{ return null; }
  finally{ clearTimeout(kill); }
}
async function fetchBoard(force){
  if(BOARD.scope==='local')return;
  const key=BOARD.scope;
  if(BOARD.state==='loading')return;
  if(!force&&BOARD.rows&&BOARD.key===key&&Date.now()-BOARD.ts<30000)return;
  BOARD.state='loading';renderScores();
  const d=await api(`${API_URL}?scope=${key}&uid=${encodeURIComponent(myUid())}`);
  if(d&&d.ok&&Array.isArray(d.top)){
    BOARD.rows=d.top;BOARD.me=d.me||null;BOARD.total=d.total||0;
    BOARD.week=d.week||'';BOARD.key=key;BOARD.ts=Date.now();BOARD.state='ok';
  }else{
    BOARD.state='off';
  }
  renderScores();
}
async function submitScore(n,sc,m,b){
  const d=await api(API_URL,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({u:myUid(),n:(n||'?').slice(0,14),s:sc,m,b}),
  });
  if(d&&d.ok){ BOARD.rows=null; return d.rank; }
  return null;
}

// ---------------------------------------------------------------- canvas
const cv=document.getElementById('game'), ctx=cv.getContext('2d');
let W=960,H=VH,camY=0;
function resize(){
  const dpr=Math.min(window.devicePixelRatio||1,2.5);
  const cw=cv.clientWidth||window.innerWidth, ch=cv.clientHeight||window.innerHeight;
  // 540 logical units across the SMALLER dimension: landscape = wide world,
  // portrait = tall world, identical reaction distance either way.
  const base=cw<ch?460:VH;                 // portrait renders ~17% larger
  const k=Math.min(cw,ch)/base;
  W=Math.round(cw/k); H=Math.round(ch/k);
  cv.width=Math.round(cw*dpr); cv.height=Math.round(ch*dpr);
  const s=k*dpr; ctx.setTransform(s,0,0,s,0,0);
  ctx.imageSmoothingQuality='high';
  player.x=Math.max(96,Math.min(W*.22,180));
}
window.addEventListener('resize',resize);
window.addEventListener('orientationchange',()=>setTimeout(resize,120));
const groundY=()=>H>W?Math.min(H-GROUND_OFF,Math.round(H*.60)):H-GROUND_OFF;


// ---------------------------------------------------------------- assets
const imgs={},goldImgs={};
function makeGold(n,im){
  try{
    const c=document.createElement('canvas');
    c.width=im.width;c.height=im.height;
    const g=c.getContext('2d');
    g.drawImage(im,0,0);
    g.globalCompositeOperation='source-atop';
    g.fillStyle='rgba(245,196,60,.72)';g.fillRect(0,0,c.width,c.height);
    g.globalCompositeOperation='overlay';
    g.fillStyle='rgba(255,236,170,.35)';g.fillRect(0,0,c.width,c.height);
    goldImgs[n]=c;
  }catch{ goldImgs[n]=im; }
}
const sunImg=new Image(), whipImg=new Image();
const loadAssets=()=>Promise.all([
  new Promise(res=>{sunImg.onload=res;sunImg.onerror=res;
    sunImg.src='assets/img/sun_angry.png';}),
  new Promise(res=>{whipImg.onload=res;whipImg.onerror=res;
    whipImg.src='assets/img/whip.png';}),
].concat(BRANDS.flatMap(n=>[
  new Promise(res=>{
    const im=new Image();
    im.onload=()=>{imgs[n]=im;if(!goldImgs[n])makeGold(n,im);res();};
    im.onerror=res;
    im.src=`assets/${n}.png`;
  }),
  new Promise(res=>{
    const gm=new Image();
    gm.onload=()=>{goldImgs[n]=gm;res();};
    gm.onerror=res;
    gm.src=`assets/gold/${n}.png`;
  }),
])));

// ---------------------------------------------------------------- state
const S={MENU:0,READY:1,PLAY:2,OVER:3,PAUSE:4};
let state=S.MENU;

const LIVES=3, HIT_INVULN=1.5;          // v21: three hearts, then the run ends
const game={dist:0,score:0,bottles:0,speed:0,drain:3,hydration:100,lives:LIVES,
  shake:0,invuln:0,flash:0,t:0,region:0,wasLow:false,stepAcc:0,ease:0,
  combo:0,comboT:0,gold:0,goldMeter:0,slow:0,freeze:0,jumpBuf:0,
  spawnCount:0,obStreak:0,policeHold:false,sunHold:false,
  boon:'',boonLast:'',goldMax:GOLD_TIME,rainT:0,
  event:null,eventCd:EVENT_FIRST,eventLast:'',heavy:0,bidonDropped:false};
let truck=null;
const player={x:0,y:0,vy:0,jumps:0,onGround:true,runT:0,sx:1,sy:1,
  mood:'run',moodT:0,blink:0,blinkT:2.4,wipe:0,wipeT:5};
let obstacles=[],bottles=[],particles=[],lines=[],popups=[],nextSpawn=0;
// -- v16 juice state --
let ghosts=[],hudMotes=[],flies=[],weeds=[],puddleT=0;
let glint=0,gaugePulse=0,camKick=0,rawDt=0,ghostAcc=0;
let lastBeat=-1,beatPh=0,beatRaw=-1,goldBarA=0;
let deathFX=null,overDelay=0,pendingOver=null;
const scarf=[];for(let i=0;i<6;i++)scarf.push({x:0,y:0,px:0,py:0});

function regionMix(){
  const f=game.dist/REGION_LEN;
  const i=Math.min(Math.floor(f),REGIONS.length-1);
  const j=Math.min(i+1,REGIONS.length-1);
  const t=i>=REGIONS.length-1?0:Math.max(0,((f-Math.floor(f))-.75)/.25);
  const A=REGIONS[i],B=REGIONS[j];
  return {idx:i,name:regionName(i),
    sky:[mixHex(A.sky[0],B.sky[0],t),mixHex(A.sky[1],B.sky[1],t)],
    sand:mixHex(A.sand,B.sand,t),hill:mixHex(A.hill,B.hill,t),
    build:mixHex(A.build,B.build,t),trim:mixHex(A.trim,B.trim,t),
    sun:mixHex(A.sun,B.sun,t),night:lerp(A.night,B.night,t)};
}

function resetRun(){
  Object.assign(game,{dist:0,score:0,bottles:0,speed:0,drain:3,hydration:100,lives:LIVES,
    shake:0,invuln:0,flash:0,region:0,wasLow:false,stepAcc:0,ease:0,
    combo:0,comboT:0,gold:0,goldMeter:0,slow:0,freeze:0,jumpBuf:0,
    spawnCount:0,obStreak:0,
    event:null,eventCd:EVENT_FIRST,eventLast:'',heavy:0,bidonDropped:false,
    policeHold:false,sunHold:false,boon:'',goldMax:GOLD_TIME,rainT:0});
  truck=null;sunA=null;scorch=[];cop=null;
  Audio2.dripStop();Audio2.rainStop();
  syncCombo();syncGold();syncLives(true);goldBarA=0;beatPh=0;beatRaw=-1;lastBeat=-1;
  obstacles=[];bottles=[];particles=[];lines=[];popups=[];rings=[];birds=[];birdTimer=2;
  ghosts=[];hudMotes=[];flies=[];weeds=[];glint=0;gaugePulse=0;camKick=0;ghostAcc=0;
  fillBag();obBag=[];
  for(const k in _hudLast)delete _hudLast[k];
  deathFX=null;overDelay=0;pendingOver=null;
  player.blink=0;player.blinkT=2.4;player.wipe=0;player.wipeT=5;
  nextSpawn=W+280;camY=0;
  player.x=Math.max(96,W*.22);player.y=groundY();player.vy=0;
  player.jumps=0;player.onGround=true;player.sx=1;player.sy=1;
  for(const p of scarf){p.x=p.px=player.x-9;p.y=p.py=player.y-46;}
  setMood('run',0);
}

function setMood(m,dur){ player.mood=m; player.moodT=dur; }

// ---------------------------------------------------------------- input
function tap(){
  if(state===S.READY){ launch(); return; }
  if(state!==S.PLAY)return;
  if(evOn()==='dhaw9ass')return;
  if(game.sunHold)return;                      // the sun's entrance owns the stage
  if(game.policeHold){ if(cop)advanceChat(false); return; }
  if(player.jumps>=MAX_JUMPS){ game.jumpBuf=.14; return; }
  if(player.jumps<MAX_JUMPS){
    const second=player.jumps===1;
    player.vy=JUMP_V*(second?.87:1)*(game.heavy>0?.85:1);
    player.jumps++;player.onGround=false;
    player.sy=1.3;player.sx=.78;
    ring(player.x,groundY()+2);
    setMood('jump',.4);
    second?Audio2.doubleJump():Audio2.jump();
    for(let i=0;i<5;i++)dust(player.x-6,groundY(),.5);
  }
}
function jumpCut(){
  if(state===S.PLAY&&!player.onGround&&player.vy<0)player.vy*=JUMP_CUT;
}
cv.addEventListener('pointerdown',e=>{e.preventDefault();tap();});
cv.addEventListener('pointerup',jumpCut);
cv.addEventListener('pointercancel',jumpCut);
document.getElementById('ready').addEventListener('pointerdown',e=>{e.preventDefault();tap();});
window.addEventListener('keydown',e=>{
  if(['Space','ArrowUp','KeyW'].includes(e.code)){
    if(document.activeElement===nameInput)return;
    e.preventDefault();tap();
  }
  if(e.code==='KeyM')syncMute(Audio2.toggleMute());
  if(e.code==='Escape'||e.code==='KeyP'){
    if(state===S.PLAY)pauseGame(); else if(state===S.PAUSE)resumeGame();
  }
});
window.addEventListener('keyup',e=>{
  if(['Space','ArrowUp','KeyW'].includes(e.code))jumpCut();
});

// ---------------------------------------------------------------- spawning
const jumpH1=()=>JUMP_V*JUMP_V/(2*GRAV_UP);                       // single-jump apex
const jumpH2=()=>jumpH1()+(JUMP_V*.87)*(JUMP_V*.87)/(2*GRAV_UP);  // double-jump apex
const airTime=()=>{
  const up=Math.abs(JUMP_V)/GRAV_UP;
  const h=JUMP_V*JUMP_V/(2*GRAV_UP);
  return up+Math.sqrt(2*h/GRAV_DOWN);
};
// v21 — obstacle catalogue. Every kind has its own footprint and height band
// so the silhouette alone tells you what you're jumping.
const OBS={
  cactus: {w:36,h:[56,82]},   // hendi
  jar:    {w:40,h:[46,60]},   // zir
  crate:  {w:48,h:[42,58]},   // caisse of empties
  barrier:{w:58,h:[42,54]},   // travaux
  tires:  {w:46,h:[40,58]},   // burnt tyres
  pipe:   {w:54,h:[32,44]},   // burst main
  blocks: {w:50,h:[44,64]},   // parpaing
  bin:    {w:42,h:[52,66]}    // poubelle
};
const OB_KINDS=Object.keys(OBS);
// same discipline as the event scheduler: a shuffled bag, so every kind shows
// up before any of them repeats. A weighted draw leaves half of them theoretical.
let obBag=[];
function obKind(){
  if(!obBag.length){
    obBag=OB_KINDS.slice();
    for(let i=obBag.length-1;i>0;i--){
      const j=(Math.random()*(i+1))|0;
      const tmp=obBag[i];obBag[i]=obBag[j];obBag[j]=tmp;
    }
  }
  return obBag.pop();
}
const obH=k=>{const b=OBS[k].h;return b[0]+Math.random()*(b[1]-b[0]);};

function spawn(){
  const gapMin=airTime()*game.speed*1.3+150;
  const prog=Math.min(game.dist/8000,1);
  game.spawnCount++;
  const ev=evOn();
  let density=.30+prog*.30;
  if(ev==='delestage')density*=.7;                       // fair in the dark
  const needWater=(game.hydration<45||game.obStreak>=2||game.spawnCount<=2)
                  &&ev!=='coupure';                      // the cut means the cut
  // during CHAMS the sun is the only obstacle — the rest stand down
  if(ev==='coupure'||(!needWater&&ev!=='chams'&&Math.random()<density)){
    game.obStreak++;
    const mkOb=(dx2,kind,h)=>{
      const hh=h||obH(kind);
      obstacles.push({x:W+70+dx2,y:groundY()-hh,w:OBS[kind].w,h:hh,kind,
                      seed:Math.random()*6.283});
    };
    const roll=Math.random();
    if(roll<.5||prog<.15){                       // single
      const k=obKind();mkOb(0,k);
      nextSpawn=gapMin+OBS[k].w+Math.random()*200;
    }else if(roll<.8){                            // pair — land between, jump again
      const k1=obKind(),k2=obKind();
      const between=airTime()*game.speed*1.18+70+OBS[k1].w;
      mkOb(0,k1);mkOb(between,k2);
      nextSpawn=between+gapMin+Math.random()*180;
    }else if(roll<.93){                           // tall — double-jump territory
      const k=Math.random()<.5?'cactus':'blocks';
      mkOb(0,k,Math.min(86+Math.random()*16,jumpH2()-58));
      nextSpawn=gapMin+120+Math.random()*200;
    }else{                                        // wide wall — commit to the jump
      const k=Math.random()<.5?'crate':'tires';
      obstacles.push({x:W+70,y:groundY()-66,w:58,h:66,kind:k,seed:Math.random()*6.283});
      nextSpawn=gapMin+140+Math.random()*200;
    }
  }else{
    game.obStreak=0;
    if(ev==='citerne'){ nextSpawn=260; return; }         // the truck is the supply
    // bottle trains, 3–5, every height derived from jump physics so all are takeable
    const n=3+((Math.random()*3)|0);
    const shape=game.spawnCount<2?1:Math.random();          // first trains: ground lines
    const baseY=groundY()-58;
    const hi1=jumpH1()-26, hi2=jumpH2()-46;                 // safe single / double ceilings
    const stepX=Math.max(58,game.speed*.16);
    for(let i=0;i<n;i++){
      let off=0;
      if(shape<.35)      off=Math.sin((i+1)/(n+1)*Math.PI)*Math.min(hi2,150); // arc: apex needs double
      else if(shape<.6)  off=Math.sin(i*1.15)*(hi1*.45)+hi1*.45;              // wave within one jump
      for(;;){break}                                        // ground line default off=0
      bottles.push({x:W+70+i*stepX,y:baseY-off,
        brand:BRANDS[(Math.random()*BRANDS.length)|0],
        w:H>W?40:30,h:H>W?80:62,bob:Math.random()*Math.PI*2});
    }
    nextSpawn=180+n*stepX+Math.random()*160;
  }
}

// ---------------------------------------------------------------- fx bits
function burst(x,y,color,n=12,spd=200){
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2,s=60+Math.random()*spd;
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-70,
      life:.45+Math.random()*.4,max:.85,r:2+Math.random()*3.5,color,grav:640});
  }
}
function dust(x,y,scale=1){
  particles.push({x:x+(Math.random()-.5)*14,y:y-2,
    vx:-(40+Math.random()*90)*scale,vy:-(18+Math.random()*55)*scale,
    life:.32+Math.random()*.3,max:.62,r:(2.2+Math.random()*3.5)*scale,
    color:'rgba(214,178,120,.55)',grav:60,grow:14*scale});
}
let rings=[];
function ring(x,y,color='rgba(214,178,120,.6)',max=34){
  rings.push({x,y,r:6,max,life:.32,tot:.32,color});
}
function popup(x,y,text,color,size=17){
  popups.push({x,y,text,color,size,life:.95,max:.95});
}

const chamsChase=()=>evOn()==='chams'&&sunA&&sunA.state==='chase';
// -- the fire whip: anticipation curl -> crack to the ground -> retract -------
function stepWhip(su,dt){
  const w=su.whip;
  if(su.state==='chase'){
    su.strike-=dt;
    if(w.ph==='idle'&&su.strike<=0){
      w.ph='wind'; w.t=.55;
      // the mark scrolls with the ground, so aim it where he'll be standing
      // when the lash lands — a strike you can read coming and jump.
      w.tx=player.x+game.speed*.55+(Math.random()*80-40);
      scorch.push({x:w.tx,phase:'warn',t:.55});
    }
  }
  if(w.ph==='wind'){ w.t-=dt;
    if(w.t<=0){ w.ph='lash'; w.t=.13;
      Audio2.whipCrack();
      game.shake=Math.max(game.shake,.4); camKick=Math.max(camKick,.5); } }
  else if(w.ph==='lash'){ w.t-=dt;
    if(w.t<=0){ w.ph='rec'; w.t=.8;
      const z=scorch.find(z2=>z2.phase==='warn');     // the mark ignites in place
      const fx2=z?z.x:w.tx;
      burst(fx2,groundY()-6,'#F58C3C',14,240);
      burst(fx2,groundY()-6,'#FFE9A0',6,160); } }
  else if(w.ph==='rec'){ w.t-=dt;
    if(w.t<=0){ w.ph='idle'; su.strike=1.5+Math.random()*.8; } }
  // geometry: 10 points from the sun's "hand" to the tip
  const N=10, hx=su.x+su.r*.8, hy=su.y+su.r*.3, gy=groundY()-2;
  w.pts.length=0;
  if(w.ph==='lash'||w.ph==='rec'){
    const q=w.ph==='lash'?1-(w.t/.13):(w.t/.8);      // 1 = fully cracked out
    const e2=w.ph==='lash'?1-Math.pow(1-q,3):q*q;    // out fast, back soft
    const tipX=lerp(hx+30,w.tx,e2), tipY=lerp(hy-60,gy,e2);
    const cx2=(hx+tipX)/2, cy2=Math.min(hy,tipY)-70*(1-e2)-14;
    for(let i=0;i<N;i++){
      const u=i/(N-1), a2=1-u;
      w.pts.push({x:a2*a2*hx+2*a2*u*cx2+u*u*tipX,
                  y:a2*a2*hy+2*a2*u*cy2+u*u*tipY});
    }
    if(particles.length<PARTS_MAX)                    // flames lick the lash
      for(let k2=0;k2<2;k2++){
        const p=w.pts[2+((Math.random()*(N-2))|0)];
        particles.push({x:p.x,y:p.y,vx:(Math.random()-.5)*50,
          vy:-(30+Math.random()*60),life:.28,max:.28,
          r:1.6+Math.random()*2,color:Math.random()<.5?'#F6C33C':'#F58C3C',grav:-60});
      }
  }else{
    const k=w.ph==='wind'?1-(w.t/.55):0;             // coil up behind — anticipation
    let px2=hx,py2=hy,ang=-.6-k*1.4;
    for(let i=0;i<N;i++){
      w.pts.push({x:px2,y:py2});
      px2+=Math.cos(ang)*13; py2+=Math.sin(ang)*13;
      ang+= .34*k + .10 + Math.sin(game.t*5+i)*.08;
    }
  }
}
function drawWhip(su){
  const w=su.whip;
  if(whipImg.naturalWidth&&(w.ph==='idle'||w.ph==='wind')){
    const k=w.ph==='wind'?1-(w.t/.55):0;             // anticipation: coil rises
    const hx=su.x+su.r*.8, hy=su.y+su.r*.3;
    const sc=.5+k*.06, iw=whipImg.naturalWidth*sc, ih=whipImg.naturalHeight*sc;
    ctx.save();
    ctx.translate(hx,hy);
    ctx.rotate(-.30 - k*.85 + Math.sin(game.t*5)*.05);
    ctx.drawImage(whipImg,-iw*.80,-ih*.84,iw,ih);    // grip pinned to the hand
    ctx.restore();
    return;
  }
  if(!w.pts||w.pts.length<2)return;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  for(let pass=0;pass<2;pass++){
    for(let i=1;i<w.pts.length;i++){
      const u=i/(w.pts.length-1);
      ctx.lineWidth=pass?(6.5-u*4.5):(10-u*7);
      ctx.strokeStyle=pass
        ?`rgba(255,233,160,${.9-u*.3})`
        :`rgba(226,96,30,${.55-u*.2})`;
      ctx.beginPath();
      ctx.moveTo(w.pts[i-1].x,w.pts[i-1].y);
      ctx.lineTo(w.pts[i].x,w.pts[i].y);ctx.stroke();
    }
  }
  const tip=w.pts[w.pts.length-1];                    // ember at the tip
  const g2=ctx.createRadialGradient(tip.x,tip.y,1,tip.x,tip.y,12);
  g2.addColorStop(0,'rgba(255,240,190,.9)');g2.addColorStop(1,'rgba(246,140,60,0)');
  ctx.fillStyle=g2;ctx.beginPath();ctx.arc(tip.x,tip.y,12,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
// ---------------------------------------------------------------- v16 juice
const PARTS_MAX=240;
function splashAt(x,k=.5){
  ring(x,groundY()+2,'rgba(150,210,255,.7)',18+k*26);
  if(particles.length>PARTS_MAX)return;
  const n=3+(k*4|0);
  for(let i=0;i<n;i++)
    particles.push({x:x+(Math.random()-.5)*10,y:groundY()-2,
      vx:(Math.random()-.5)*90,vy:-(70+Math.random()*140*k),
      life:.3+Math.random()*.2,max:.5,r:1.4+Math.random()*1.6,
      color:'rgba(160,215,255,.85)',grav:620});
}
// afterimages while golden or on a hot combo
function addGhost(dt){
  if(game.gold<=0&&game.combo<5){ghostAcc=0;return;}
  ghostAcc+=dt;
  if(ghostAcc<.05)return;
  ghostAcc=0;
  if(ghosts.length>7)ghosts.shift();
  ghosts.push({x:player.x,y:player.y,rot:player.onGround?0:clamp(player.vy/2100,-.2,.3),
    sx:player.sx,sy:player.sy,t:.3,max:.3,gold:game.gold>0});
}
function stepGhosts(dt){
  for(let i=ghosts.length-1;i>=0;i--){
    const g=ghosts[i];g.t-=dt;g.x-=game.speed*dt*.35;
    if(g.t<=0)ghosts.splice(i,1);
  }
}
function drawGhosts(){
  for(const g of ghosts){
    const a=Math.max(0,g.t/g.max)*.34;
    ctx.save();ctx.globalAlpha=a;
    ctx.translate(g.x,g.y-30);ctx.rotate(g.rot);ctx.scale(g.sx,g.sy);
    ctx.fillStyle=g.gold?'#F5D77E':'#8FC7E8';
    ctx.beginPath();ctx.moveTo(-13,8);ctx.lineTo(-10,-22);
    ctx.lineTo(10,-22);ctx.lineTo(13,8);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.arc(3,-33,12,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha=1;
}
// scarf: 6-point verlet tail off the neck, wind = run speed
function scarfAnchor(){
  if(deathFX){
    const d=deathFX,ox=-9,oy=-16,c=Math.cos(d.rot),sn=Math.sin(d.rot);
    return {x:d.x+ox*c-oy*sn,y:(d.y-30)+ox*sn+oy*c};
  }
  return {x:player.x-9,y:player.y-46};
}
function stepScarf(dt){
  const a=scarfAnchor();
  scarf[0].x=a.x;scarf[0].y=a.y;scarf[0].px=a.x;scarf[0].py=a.y;
  const wind=-(60+game.speed*.5),SEG=7;
  for(let i=1;i<scarf.length;i++){
    const p=scarf[i];
    const vx=(p.x-p.px)*.86+wind*dt*(.5+i*.14)
             +Math.sin(game.t*17+i*1.7)*(6+game.speed*.02)*dt;
    const vy=(p.y-p.py)*.86+260*dt;
    p.px=p.x;p.py=p.y;p.x+=vx;p.y+=vy;
    const q=scarf[i-1];let dx2=p.x-q.x,dy2=p.y-q.y;
    const d=Math.hypot(dx2,dy2)||1,k=(d-SEG)/d;
    p.x-=dx2*k;p.y-=dy2*k;
  }
}
function drawScarf(){
  ctx.save();
  ctx.strokeStyle=game.gold>0?'#F5D77E':'#2E76B8';
  ctx.lineCap='round';ctx.lineJoin='round';
  for(let i=1;i<scarf.length;i++){
    ctx.lineWidth=5.5-i*.75;
    ctx.beginPath();ctx.moveTo(scarf[i-1].x,scarf[i-1].y);
    ctx.lineTo(scarf[i].x,scarf[i].y);ctx.stroke();
  }
  ctx.restore();
}
// meter feedback: a gold mote flies from the source into the jauge
function gaugePos(){
  const gx=H>W?Math.round(W/2-31):20, gy=H>W?16:86;
  return {x:gx+26+12+10,y:gy+7+26};
}
function spawnHudMote(x,y){
  if(hudMotes.length>10)return;
  hudMotes.push({x,y,vx:(Math.random()-.5)*120,vy:-120-Math.random()*80,t:0});
}
function stepHudMotes(dt){
  const g=gaugePos();
  for(let i=hudMotes.length-1;i>=0;i--){
    const m=hudMotes[i];m.t+=dt;
    const k=Math.min(1,m.t*2.6);
    m.vx+=( (g.x-m.x)*10*k - m.vx*4 )*dt*4;
    m.vy+=( (g.y-m.y)*10*k - m.vy*4 )*dt*4;
    m.x+=m.vx*dt;m.y+=m.vy*dt;
    if(Math.hypot(m.x-g.x,m.y-g.y)<10||m.t>1.4){
      hudMotes.splice(i,1);gaugePulse=1;
    }
  }
}
function drawHudMotes(){
  for(const m of hudMotes){
    ctx.fillStyle='rgba(245,215,126,.95)';
    ctx.beginPath();ctx.arc(m.x,m.y,3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,246,210,.5)';
    ctx.beginPath();ctx.arc(m.x,m.y,6,0,Math.PI*2);ctx.fill();
  }
}
// fireflies inside the delestage torch radius
function stepFlies(dt){
  if(evOn()==='delestage'){
    while(flies.length<6)
      flies.push({a:Math.random()*6.28,r:60+Math.random()*90,
        sp:.5+Math.random(),ph:Math.random()*6});
  }else if(flies.length&&Math.random()<dt*2)flies.pop();
  for(const f of flies){f.a+=f.sp*dt;f.ph+=dt*3;}
}
function drawFlies(){
  for(const f of flies){
    const x=player.x+Math.cos(f.a)*f.r,
          y=player.y-40+Math.sin(f.a*1.3)*f.r*.5,
          tw=.5+.5*Math.sin(f.ph*4);
    ctx.fillStyle=`rgba(220,255,150,${.25+.6*tw})`;
    ctx.beginPath();ctx.arc(x,y,1.8+tw*1.4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=`rgba(220,255,150,${.12*tw})`;
    ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fill();
  }
}
// tumbleweed: rolls through coupure and the deep-desert regions
function maybeWeed(dt){
  const dry=evOn()==='coupure'||regionMix().idx>=3;
  if(!dry||weeds.length>=2)return;
  if(Math.random()<dt*.22)
    weeds.push({x:W+40,y:groundY()-13,r:12+Math.random()*7,rot:0,hop:0,vy:0});
}
function stepWeeds(dt){
  for(let i=weeds.length-1;i>=0;i--){
    const w=weeds[i],v=game.speed*1.18+70;
    w.x-=v*dt;w.rot-=v/w.r*dt;
    w.vy+=900*dt;w.y+=w.vy*dt;
    if(w.y>groundY()-w.r){w.y=groundY()-w.r;w.vy=-(60+Math.random()*90);}
    if(w.x<-60)weeds.splice(i,1);
  }
}
function drawWeeds(){
  for(const w of weeds){
    ctx.save();ctx.translate(w.x,w.y);ctx.rotate(w.rot);
    ctx.strokeStyle='rgba(122,96,48,.75)';ctx.lineWidth=1.8;
    for(let k=0;k<7;k++){
      ctx.beginPath();
      ctx.arc(0,0,w.r*(.45+.55*((k*37%7)/7)),k*.9,k*.9+2.4);ctx.stroke();
    }
    ctx.restore();
  }
}
// puddle shine strips while it rains
function drawPuddles(){
  const gy=groundY(),off=game.dist%210;
  ctx.fillStyle='rgba(190,230,255,.14)';
  for(let x=-off-60;x<W+80;x+=210){
    const wdt=60+((x/210|0)%3)*24;
    ctx.beginPath();ctx.ellipse(x+40,gy+18,wdt,4.5,0,0,Math.PI*2);ctx.fill();
  }
}
// diagonal light sweep on region change
function drawGlint(){
  if(glint<=0)return;
  const p=1-glint,x=-W*.4+p*(W*1.8);
  const g=ctx.createLinearGradient(x-90,0,x+90,0);
  g.addColorStop(0,'rgba(255,255,255,0)');
  g.addColorStop(.5,'rgba(255,255,255,.16)');
  g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.save();ctx.translate(0,0);ctx.transform(1,0,-0.35,1,0,0);
  ctx.fillStyle=g;ctx.fillRect(x-120,-40,240,H+80);
  ctx.restore();
}
// rotating god-rays behind the runner while golden
function drawGoldRays(gr){
  ctx.save();ctx.translate(player.x,player.y-36);
  ctx.rotate(game.t*.8);
  ctx.fillStyle=`rgba(${(BOONS[game.boon]||BOONS.dhahab).rgb},${.10*gr})`;
  for(let i=0;i<5;i++){
    ctx.rotate(Math.PI*2/5);
    ctx.beginPath();ctx.moveTo(0,0);
    ctx.arc(0,0,120,-.26,.26);ctx.closePath();ctx.fill();
  }
  ctx.restore();
}
// ---- death cinematic: hit-stop -> slow-mo tumble -> panel ----
function startDeathCine(cause){
  game.freeze=.09;game.slow=.8;overDelay=1.5;
  const crash=cause==='crash',burn=cause==='burn';
  deathFX={x:player.x,y:player.y,rot:0,bounced:false,rest:false,
    vy:crash?-380:burn?-430:-170,
    vr:crash?-8.5:burn?8.5:-3.6,
    hat:{x:player.x+3,y:player.y-72,vx:100+Math.random()*90,
         vy:-330,rot:0,vr:8+Math.random()*4,down:false}};
}
function stepOverCine(dt){
  if(!deathFX)return;
  overDelay-=rawDt;
  if(overDelay<=0&&pendingOver)finishOver();
  if(dt<=0)return;                       // hit-stop: the world holds its breath
  const d=deathFX;
  if(!d.rest){
    d.vy+=1500*dt;d.y+=d.vy*dt;d.rot+=d.vr*dt;
    if(d.vy>0&&d.y>=groundY()){          // only a *fall* can land
      d.y=groundY();
      if(!d.bounced){d.bounced=true;d.vy*=-.34;d.vr*=.45;
        game.shake=Math.max(game.shake,.5);camKick=Math.max(camKick,.7);
        for(let i=0;i<8;i++)dust(d.x,groundY(),.9);Audio2.land();}
      else{d.vy=0;d.rest=true;}
    }
  }else d.rot+=(Math.round(d.rot/(Math.PI/2))*(Math.PI/2)-d.rot)*Math.min(1,dt*8);
  const h=d.hat;
  if(!h.down){
    h.vy+=900*dt;h.x+=h.vx*dt;h.y+=h.vy*dt;h.rot+=h.vr*dt;
    if(h.vy>0&&h.y>=groundY()-4){h.y=groundY()-4;h.down=true;dust(h.x,groundY(),.5);}
  }
  stepScarf(dt);
}
function drawFlyingHat(){
  const h=deathFX&&deathFX.hat;if(!h)return;
  ctx.save();ctx.translate(h.x,h.y);ctx.rotate(h.rot);
  ctx.fillStyle='#B22B2B';
  ctx.beginPath();ctx.ellipse(0,0,12,7.5,0,Math.PI,0);ctx.fill();
  ctx.fillRect(-12,-1,24,3.4);
  ctx.restore();
}
function drawDeadPlayer(){
  const d=deathFX;
  const air=Math.max(0,(groundY()-d.y)/180);
  ctx.fillStyle='rgba(0,0,0,.18)';
  ctx.beginPath();
  ctx.ellipse(d.x,groundY()+4,20*(1-air*.45),5.5*(1-air*.4),0,0,Math.PI*2);ctx.fill();
  drawScarf();
  ctx.save();ctx.translate(d.x,d.y-30);ctx.rotate(d.rot);
  ctx.strokeStyle='#3C2E22';ctx.lineWidth=7;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(14,26);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(-13,25);ctx.stroke();
  ctx.fillStyle='#F7F4EE';
  ctx.beginPath();ctx.moveTo(-13,8);ctx.lineTo(-10,-22);
  ctx.lineTo(10,-22);ctx.lineTo(13,8);ctx.closePath();ctx.fill();
  ctx.fillStyle='#2E76B8';ctx.fillRect(-12,-4,24,4);
  ctx.strokeStyle='#C68A5E';ctx.lineWidth=6;
  ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(-19,-27);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(18,-30);ctx.stroke();
  const hx=3,hy=-33;
  ctx.fillStyle='#C68A5E';
  ctx.beginPath();ctx.arc(hx,hy,12,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#3A2A1E';ctx.lineWidth=2;
  for(const dx of [-4,5]){
    ctx.beginPath();ctx.moveTo(hx+dx-2.4,hy-4.4);ctx.lineTo(hx+dx+2.4,hy+.4);ctx.stroke();
    ctx.beginPath();ctx.moveTo(hx+dx+2.4,hy-4.4);ctx.lineTo(hx+dx-2.4,hy+.4);ctx.stroke();
  }
  ctx.fillStyle='#7A3A2A';
  ctx.beginPath();ctx.ellipse(hx+.5,hy+7,2.4,3.2,0,0,Math.PI*2);ctx.fill();
  ctx.restore();
  if(d.bounced){                                  // dizzy stars orbit the head
    for(let i=0;i<3;i++){
      const a=game.t*4+i*2.09,
            sx2=d.x+3+Math.cos(a)*17,sy2=d.y-64+Math.sin(a)*6;
      drawStar(sx2,sy2,3.4,'rgba(245,215,126,.85)');
    }
  }
  drawFlyingHat();
}
function finishOver(){
  const po=pendingOver;pendingOver=null;
  hud.hidden=true;
  el('finalScore').textContent=po.sc;
  el('overEyebrow').textContent=po.line;
  el('overSummary').textContent=po.sum;
  el('overRank').textContent=po.rankTxt;
  showPanel('over');
  if(A){
    A({targets:'#finalScore',innerHTML:[0,po.sc],round:1,
       easing:'easeOutExpo',duration:1200});
    if(po.rank===0){
      fireConfetti();
      A({targets:'#overRank',scale:[1,1.18,1],duration:900,
         easing:'easeInOutQuad',loop:3});
    }
  }
}
function fireConfetti(){
  if(!A)return;
  const host=el('frame')||document.body;
  const cols=['#E70013','#F5D77E','#2E76B8','#3FA9E8','#F7F4EE','#D93A6A'];
  const bits=[];
  for(let i=0;i<26;i++){
    const b=document.createElement('span');
    const sz=7+Math.random()*7;
    b.style.cssText='position:absolute;top:-20px;left:'+(Math.random()*100)+
      '%;width:'+sz+'px;height:'+(sz*.6)+'px;border-radius:2px;z-index:80;'+
      'pointer-events:none;background:'+cols[i%cols.length];
    host.appendChild(b);bits.push(b);
  }
  A({targets:bits,
     translateY:()=> (window.innerHeight||700)+60,
     translateX:()=> (Math.random()-.5)*140,
     rotate:()=>Math.random()*720-360,
     duration:()=>1500+Math.random()*1100,
     delay:()=>Math.random()*350,
     easing:'easeInCubic',
     complete:()=>bits.forEach(b=>b.remove())});
}

// ---------------------------------------------------------------- update
function update(dt){
  game.t+=dt;
  if(state===S.PAUSE)return;

  if(state===S.READY){
    // idle: breathing, no scroll — the world holds still until the first tap
    player.runT+=dt*2.2;
    player.sy=1+Math.sin(game.t*2.6)*.02;
    stepScarf(dt);stepGhosts(dt);
    stepParticles(dt);
    return;
  }
  if(state===S.OVER){
    stepOverCine(dt);stepGhosts(dt);stepParticles(dt);stepPopups(dt);
    if(game.shake>0)game.shake=Math.max(0,game.shake-dt*3);
    if(camKick>0)camKick=Math.max(0,camKick-dt*6);
    return;
  }
  if(state!==S.PLAY){ stepParticles(dt); stepPopups(dt); return; }

  if(evOn()==='dhaw9ass'){ stepEvents(dt); stepParticles(dt); return; }

  // ease from standstill, then the continuous ramp
  game.ease=Math.min(1,game.ease+dt/EASE_IN);
  const easeK=game.ease*game.ease*(3-2*game.ease);           // smoothstep
  game.speed=Math.min(SPEED_START+game.dist*SPEED_RAMP,SPEED_MAX)*easeK;
  if(game.boon==='rih'&&game.gold>0)game.speed*=1.45;
  if(game.policeHold||game.sunHold)game.speed=0;
  if(chamsChase())game.speed*=.55;             // hunted: he WALKS, spent
  game.drain=(2.7+game.speed*.0094)*easeK;

  const dx=game.speed*dt;
  game.dist+=dx; game.score+=dx*.06;

  stepEvents(dt);
  if(evOn()==='dhaw9ass'){ stepParticles(dt); return; }   // the country froze, so do we
  if(game.heavy>0)game.heavy-=dt;

  const r=Math.floor(game.dist/REGION_LEN);
  if(r!==game.region&&r<REGIONS.length){
    game.region=r;Audio2.milestone();glint=1;
    game.score+=100;
    popup(player.x,player.y-104,t('arrived'),'#F5D77E',15);
    showBanner(regionName(Math.min(r,REGIONS.length-1)));
  }
  Audio2.setWind(clamp((game.speed-SPEED_START)/(SPEED_MAX-SPEED_START),0,1));

  const evD=evOn();
  if(game.comboT>0){
    game.comboT-=dt;
    if(game.comboT<=0)breakCombo();
    else el('comboBar').style.width=(game.comboT/COMBO_WINDOW*100)+'%';
  }
  if(game.gold>0){
    game.gold-=dt;
    if(game.boon==='chta'){                       // the sky opens: dbabez rain down
      game.rainT-=dt;
      if(game.rainT<=0&&bottles.length<26){
        game.rainT=.24;
        const bw=H>W?46:30, bh=H>W?94:62;
        bottles.push({x:player.x+40+Math.random()*300,   // a downpour on him,
                                                         // not a distant curtain
          y:-60-Math.random()*90, vy:0, ty:groundY()-46-Math.random()*120,
          sky:true, brand:BRANDS[(Math.random()*BRANDS.length)|0],
          w:bw,h:bh,bob:Math.random()*6});
      }
    }else if(game.boon==='rih'){                  // the wind clears his path
      for(let i=obstacles.length-1;i>=0;i--){
        const o=obstacles[i];
        if(o.x>player.x+30&&o.x<player.x+360){
          burst(o.x,o.y-20,'#E0A85C',9,230);
          obstacles.splice(i,1);game.score+=15;
          if(particles.length<PARTS_MAX)
            for(let k=0;k<3;k++)particles.push({x:o.x,y:o.y-10-Math.random()*40,
              vx:260+Math.random()*180,vy:(Math.random()-.5)*60,life:.4,max:.4,
              r:1.4+Math.random()*1.8,color:'#EEC482',grav:40});
        }
      }
    }
    if(game.gold<=1.6&&game.gold+dt>1.6)Audio2.goldEnd();
    if(game.gold<=0){
      game.gold=0;
      // a frame ago you were smashing through everything — don't get killed by
      // the crate you were already standing inside.
      clearAhead(player.x+150);
      game.invuln=Math.max(game.invuln,.8);
      if(game.boon==='chta'&&evOn()!=='pluie')Audio2.rainStop();
      if(game.boon==='rih')Audio2.musicRate(1);
      Audio2.setMusicMode('play');
      game.boon='';
      syncGold();
      Audio2.stopSample('gold',0.4);
      Audio2.duckMusic(game.hydration<28);
    }
    if(Math.random()<.5)                                     // golden trail
      particles.push({x:player.x-14+(Math.random()-.5)*10,y:player.y-30-Math.random()*30,
        vx:-(60+Math.random()*60),vy:(Math.random()-.5)*40,life:.4,max:.4,
        r:2+Math.random()*2.5,color:'#F5D77E',grav:0});
  }
  if(game.policeHold)game.drain*=.5;
  if(game.sunHold)game.drain*=.2;
  if(chamsChase())game.drain*=1.5;             // sweating it out
  if(evD==='canicule')game.drain*=1.8;
  if(evD==='pluie'){ game.drain=0; game.hydration=Math.min(100,game.hydration+2.2*dt); }
  if(game.gold<=0)game.hydration-=game.drain*dt;
  const low=game.hydration<28;
  if(low&&!game.wasLow){Audio2.warn();Audio2.duckMusic(true);Audio2.pantStart();}
  if(!low&&game.wasLow){Audio2.duckMusic(false);Audio2.pantStop();}
  game.wasLow=low;
  if(player.mood==='run'&&low)setMood('tired',.2);
  if(player.mood==='tired'&&!low)setMood('run',0);
  player.blinkT-=dt;
  if(player.blinkT<=0){player.blink=.09;player.blinkT=2.2+Math.random()*2.6;}
  if(player.blink>0)player.blink-=dt;
  if(game.invuln>0)game.invuln-=dt;
  if(evD==='canicule'&&player.onGround){
    player.wipeT-=dt;
    if(player.wipeT<=0){player.wipe=.6;player.wipeT=4+Math.random()*3;}
  }
  if(player.wipe>0){
    player.wipe-=dt;
    if(player.wipe<=0)burst(player.x+14,player.y-56,'#7FC4EE',3,90);
  }
  if(game.hydration<=0){game.hydration=0;return gameOver();}

  if(player.moodT>0){player.moodT-=dt;if(player.moodT<=0)setMood(low?'tired':'run',0);}

  const wasAir=!player.onGround;
  player.vy+=(player.vy<0?GRAV_UP:GRAV_DOWN)*dt; player.y+=player.vy*dt;
  if(player.y>=groundY()){
    player.y=groundY();player.jumps=0;player.onGround=true;
    if(game.jumpBuf>0){ game.jumpBuf=0; setTimeout(tap,0); }
    if(wasAir){
      const impact=Math.min(Math.abs(player.vy)/900,1);
      player.sy=1-.34*impact;player.sx=1+.30*impact;
      game.shake=Math.max(game.shake,impact*.42);
      camKick=Math.max(camKick,impact*.8);
      ring(player.x,groundY()+2,'rgba(214,178,120,.7)',26+impact*26);
      Audio2.land();
      if(evD==='pluie')splashAt(player.x,.5+impact*.6);
      else for(let i=0;i<8;i++)dust(player.x,groundY(),.6+impact*.8);
    }
    player.vy=0;
  }
  player.sx+=(1-player.sx)*Math.min(1,dt*13);
  player.sy+=(1-player.sy)*Math.min(1,dt*13);

  player.runT+=dt*(player.onGround?
    ((game.sunHold||game.policeHold)?1.4:chamsChase()?3.3:6+game.speed*.021):4);
  if(chamsChase()&&Math.random()<dt*7)
    particles.push({x:player.x+6+(Math.random()-.5)*10,y:player.y-66,
      vx:(Math.random()-.5)*30,vy:40+Math.random()*50,life:.5,max:.5,
      r:1.6+Math.random()*1.2,color:'#7FC4EE',grav:300});
  if(player.onGround&&game.ease>=1){
    game.stepAcc+=dt*(game.speed/58);
    if(game.stepAcc>=1){game.stepAcc=0;Audio2.step();
      if(evD==='pluie')splashAt(player.x-6,.35);
      else dust(player.x-8,groundY(),.55);
      if(game.gold>0)ring(player.x-6,groundY()+2,'rgba(245,215,126,.65)',20);}
  }

  camY=lerp(camY,player.onGround?0:-(groundY()-player.y)*.055,Math.min(1,dt*6));

  if(game.jumpBuf>0)game.jumpBuf-=dt;
  if(game.shake>0)game.shake=Math.max(0,game.shake-dt*3);
  if(game.flash>0)game.flash=Math.max(0,game.flash-dt*2.6);
  if(camKick>0)camKick=Math.max(0,camKick-dt*6);
  if(gaugePulse>0)gaugePulse=Math.max(0,gaugePulse-dt*4);
  goldBarA+=((game.gold>0?1:0)-goldBarA)*Math.min(1,dt*9);
  if(glint>0)glint=Math.max(0,glint-dt*1.6);
  addGhost(dt);stepGhosts(dt);stepScarf(dt);
  stepHudMotes(dt);stepFlies(dt);maybeWeed(dt);stepWeeds(dt);
  if(evD==='pluie'&&Math.random()<dt*9)splashAt(Math.random()*W,.3+Math.random()*.4);

  if(game.speed>400&&Math.random()<(game.speed-400)/700)
    lines.push({x:W+30,y:40+Math.random()*(groundY()-70),len:30+Math.random()*90,life:.36});
  for(let i=lines.length-1;i>=0;i--){
    const l=lines[i];l.x-=game.speed*2.1*dt;l.life-=dt;
    if(l.life<=0||l.x<-160)lines.splice(i,1);
  }

  nextSpawn-=dx;
  if(nextSpawn<=0)spawn();

  const pl={x:player.x-19,y:player.y-62,w:38,h:62};

  for(let i=obstacles.length-1;i>=0;i--){
    const o=obstacles[i];o.x-=dx;
    if(o.x+o.w<-90){obstacles.splice(i,1);continue;}
    if(!o.passed && o.x+o.w < player.x-19){
      o.passed=true;
      gainGold(GOLD_PER_PASS,o.x+o.w/2,o.y);
      if(!player.onGround && game.gold<=0 && (o.y-player.y)>-34 && player.y-62<o.y){
        game.score+=10;
        gainGold(GOLD_PER_GRAZE,player.x+20,player.y-70);
        popup(player.x+18,player.y-92,t('graze'),'#BFE3FF',13);
      }
    }
    if(aabb(pl,{x:o.x+6,y:o.y+6,w:o.w-12,h:o.h-8})){
      if(game.gold>0){                                        // smash through it
        obstacles.splice(i,1);
        game.score+=30;
        game.shake=Math.max(game.shake,.5);
        burst(o.x+o.w/2,o.y+o.h/2,'#F5D77E',18,300);
        popup(o.x+o.w/2,o.y,'+30','#F5D77E',15);
        Audio2.smash();
        continue;
      }
      if(game.invuln>0)continue;                       // still blinking from the last one
      obstacles.splice(i,1);
      burst(o.x+o.w/2,o.y+o.h/2,'#C4453B',20,300);
      burst(player.x,player.y-30,'#F7F4EE',8,180);
      if(!loseLife('crash'))return;                    // that was the last heart
      continue;
    }
  }

  for(let i=bottles.length-1;i>=0;i--){
    const b=bottles[i];b.x-=dx;b.bob+=dt*3.2;
    if(b.sky){ b.vy+=1250*dt; b.y+=b.vy*dt;
      if(b.y>=b.ty){ b.y=b.ty;b.sky=false;
        burst(b.x,b.y+20,'#BFE3FF',5,120); } }
    if(b.gl===undefined)b.gl=1+Math.random()*4;
    b.gl-=dt;if(b.gl<-.4)b.gl=2+Math.random()*4;
    if(game.gold>0&&!b.bidon){
      const ddx=player.x-b.x,ddy=(player.y-42)-b.y;
      if(ddx*ddx+ddy*ddy<32400){                 // 180px magnet
        const k=Math.min(1,dt*8);b.x+=ddx*k;b.y+=ddy*k;
      }
    }
    if(b.x+b.w<-90){bottles.splice(i,1);continue;}
    if(aabb(pl,{x:b.x-b.w/2,y:b.y-b.h/2,w:b.w,h:b.h})){
      bottles.splice(i,1);
      if(b.bidon){
        game.hydration=Math.min(100,game.hydration+38);
        game.score+=40;game.heavy=2.5;
        burst(b.x,b.y,'#3FA9E8',18,240);
        popup(b.x,b.y-42,t('bidon'),'#BFE3FF',16);
        popup(player.x,player.y-100,t('heavy'),'#F7F4EE',12);
        Audio2.pickup(2);
        continue;
      }
      game.bottles++;
      game.combo=game.comboT>0?Math.min(game.combo+1,COMBO_CAP):1;
      game.comboT=COMBO_WINDOW;
      const mult=game.combo, pts=55*mult;
      game.score+=pts;
      game.hydration=Math.min(100,game.hydration+(evOn()==='canicule'?17:11));
      if(player.mood!=='hurt')setMood('happy',.45);
      burst(b.x,b.y,BRAND_TINT[b.brand]||'#2E76B8',14,220);
      burst(b.x,b.y,'#FFFFFF',6,150);
      popup(b.x,b.y-40,'+'+pts+(mult>1?' ×'+mult:''),
            mult>=4?'#F5D77E':'#FFF3C4',13+Math.min(mult,6)*1.6);
      if(SHOUTS[mult])popup(player.x,player.y-100,SHOUTS[mult],'#F5D77E',19);
      gainGold(GOLD_PER_BOTTLE,b.x,b.y);
      Audio2.pickup(mult);popCounter();syncCombo();
    }
  }

  stepParticles(dt);stepPopups(dt);
}

function stepParticles(dt){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];p.life-=dt;
    if(p.life<=0){particles.splice(i,1);continue;}
    p.vy+=p.grav*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
    if(p.grow)p.r+=p.grow*dt;
  }
  for(let i=rings.length-1;i>=0;i--){
    const g=rings[i];g.life-=dt;
    g.r=6+(1-g.life/g.tot)*(g.max-6);
    if(g.life<=0)rings.splice(i,1);
  }
}
function stepPopups(dt){
  for(let i=popups.length-1;i>=0;i--){
    const p=popups[i];p.life-=dt;p.y-=46*dt;
    if(p.life<=0)popups.splice(i,1);
  }
}
const aabb=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;

const evOn=()=>game.event&&game.event.phase==='on'?game.event.type:null;

// A weighted roll made the rare events genuinely rare: measured over 45 min of
// simulated play, the barrage never came up once. So: a shuffled bag instead —
// every event gets its turn before any of them repeats.
let evBag=[];
function fillBag(){
  evBag=Object.keys(EVENTS);
  for(let i=evBag.length-1;i>0;i--){
    const j=(Math.random()*(i+1))|0;
    [evBag[i],evBag[j]]=[evBag[j],evBag[i]];
  }
}
const evOk=k=>game.dist>=(EVENTS[k].min||0)
  &&!(k==='coupure'&&game.hydration<55)
  &&!(k==='chams'&&regionMix().night>.45)     // no angry sun once the sun has set
  &&!(k===game.eventLast&&evBag.length>1);
function pickEvent(){
  for(let pass=0;pass<2;pass++){
    for(let i=0;i<evBag.length;i++)
      if(evOk(evBag[i]))return evBag.splice(i,1)[0];
    fillBag();                                   // bag exhausted or all gated
  }
  return 'canicule';                             // always legal, never blocks
}
let sunA=null, scorch=[], cop=null;
function eventEnter(t){
  if(t==='chams'){
    sunA={x:W*.86,y:-90,r:52,face:0,state:'intro',it:1.9,exit:0,
      strike:1.2,whip:{ph:'idle',t:0,tx:0,pts:[]}};
    scorch=[]; game.sunHold=true;
    for(let oi=obstacles.length-1;oi>=0;oi--)
      if(obstacles[oi].x<player.x+430)obstacles.splice(oi,1);
    Audio2.sunRoar();
  }
  else if(t==='police'){ cop={x:W+170,hold:false,chat:-1,give:0,coins:[],
    done:false,wave:0}; }
  else if(t==='dhaw9ass'){ Audio2.powerDown(); Audio2.duckMusic(true); }
  if(t==='coupure'){ game.bidonDropped=false; Audio2.dripStart(); }
  else if(t==='delestage'){ Audio2.powerDown(); }
  else if(t==='canicule'){ Audio2.sizzle(); }
  else if(t==='citerne'){ Audio2.horn(); truck={x:W+160,drop:0}; }
  else if(t==='pluie'){ Audio2.chime(); Audio2.rainStart(); }
}
function eventExit(t){
  if(t==='chams'){ sunA=null; scorch=[]; game.sunHold=false;
    if(!game.wasLow)Audio2.pantStop(); }
  if(t==='police'){ cop=null; game.policeHold=false; }
  if(t==='dhaw9ass'){ Audio2.powerUp(); Audio2.duckMusic(game.hydration<28);
    popup(player.x,player.y-110,I18N[lang].lightBack,'#F5D77E',15); }
  if(t==='coupure')Audio2.dripStop();
  else if(t==='delestage')Audio2.powerUp();
  else if(t==='pluie')Audio2.rainStop();
  if(t==='citerne')truck=null;
}
function stepEvents(dt){
  const e=game.event;
  if(!e){
    // Gold is its own scene. Nothing telegraphs, banners or blacks out on top
    // of it — the clock stops and the next event lands after you land.
    if(game.gold>0)return;
    game.eventCd-=dt;
    if(game.eventCd<=0&&game.ease>=1&&game.dist>400){
      const t=pickEvent();
      game.event={type:t,phase:'tel',t:evTxt(t,0)?1.7:.05};
      game.eventLast=t;
      if(evTxt(t,0)){ Audio2.warn(); showBanner(evTxt(t,0)); }
    }
    return;
  }
  if(!game.policeHold&&!game.sunHold)e.t-=dt;   // a halted scene can't time out
  if(e.phase==='tel'&&e.t<=0){
    e.phase='on'; e.t=EVENTS[e.type].dur;
    if(evTxt(e.type,1))showBanner(evTxt(e.type,1));
    eventEnter(e.type);
  }else if(e.phase==='on'&&e.t<=0){
    eventExit(e.type);
    game.event=null;
    game.eventCd=EVENT_GAP[0]+Math.random()*(EVENT_GAP[1]-EVENT_GAP[0]);
  }
  // guaranteed mercy bidon halfway through a coupure
  if(e.phase==='on'&&e.type==='coupure'&&!game.bidonDropped&&e.t<EVENTS.coupure.dur*.55){
    game.bidonDropped=true;
    bottles.push({x:W+90,y:groundY()-64,bidon:true,w:H>W?48:38,h:H>W?58:46,bob:Math.random()*6,brand:''});
  }
  // the tanker spills a trail of plenty
  if(truck){
    truck.x-=(game.speed*1.28)*dt;
    truck.drop-=game.speed*1.28*dt;
    if(particles.length<PARTS_MAX&&Math.random()<dt*18)
      particles.push({x:truck.x+62,y:groundY()-4,vx:70+Math.random()*50,
        vy:-(40+Math.random()*70),life:.3,max:.3,r:1.4+Math.random()*1.4,
        color:'rgba(120,190,240,.8)',grav:520});
    if(truck.drop<=0&&truck.x>player.x+60){
      truck.drop=88;
      bottles.push({x:truck.x-70,y:groundY()-58,
        brand:BRANDS[(Math.random()*BRANDS.length)|0],w:H>W?46:30,h:H>W?94:62,bob:Math.random()*6});
    }
    if(truck.x<-260)truck=null;
  }
  // angry sun v2: cinematic entrance, then it hunts from BEHIND with a fire whip
  if(sunA&&e&&e.phase==='on'&&e.type==='chams'){
    const su=sunA;
    if(su.state==='intro'){
      su.it-=dt; su.age=(su.age||0)+dt;
      if(su.age>4.5)su.it=0;                     // never stall the world
      su.x+=((W*.55)-su.x)*Math.min(1,dt*3.4);
      su.y+=((H*.30)-su.y)*Math.min(1,dt*3.0);
      su.face=Math.min(1,su.face+dt*1.4);
      if(su.it<=0){ su.state='chase'; game.sunHold=false;
        Audio2.pantStart(); su.strike=1.1; }
    }else if(e.t<=1.0&&su.state!=='exit'){
      su.state='exit';
      popup(player.x,player.y-108,I18N[lang].escapedSun,'#F5D77E',15);
    }
    if(su.state==='chase'){
      su.x+=((player.x-138)-su.x)*Math.min(1,dt*2.4);   // behind his back
      su.y+=((H*.27+Math.sin(game.t*1.7)*10)-su.y)*Math.min(1,dt*2.2);
      stepWhip(su,dt);
    }else if(su.state==='exit'){
      su.exit+=dt;
      su.x-=140*dt; su.y-=(220+su.exit*420)*dt;         // storms off skyward
      if(su.whip.ph!=='idle'){su.whip.ph='rec';su.whip.t=Math.min(su.whip.t,.3);}
      stepWhip(su,dt);
    }
  }
  const scroll=game.speed*dt;
  for(let i=scorch.length-1;i>=0;i--){
    const z=scorch[i]; z.x-=scroll; z.t-=dt;
    if(z.x<-120){ scorch.splice(i,1); continue; }
    if(z.phase==='warn'&&z.t<=0){ z.phase='fire'; z.t=.28; Audio2.sizzle();
      burst(z.x,groundY()-6,'#F58C3C',10,180); }
    else if(z.phase==='fire'){
      if(player.onGround&&Math.abs(player.x-z.x)<30&&game.gold<=0&&game.invuln<=0){
        scorch.splice(i,1);
        if(!loseLife('burn'))return;
        break;                                   // clearAhead just reshuffled this list
      }
      if(z.t<=0)scorch.splice(i,1);
    }
  }
  // barrage police v2: he pulls you over, the shakedown plays out in bubbles
  if(cop&&e&&e.phase==='on'&&e.type==='police'){
    if(!cop.hold&&!cop.done){
      cop.x-=game.speed*dt;
      if(cop.x<=player.x+185){
        cop.hold=true; game.policeHold=true; cop.chat=0; cop.dwell=0; cop.age=0;
        for(let oi=obstacles.length-1;oi>=0;oi--)
          if(obstacles[oi].x<player.x+380)obstacles.splice(oi,1);
        Audio2.horn(); Audio2.whistle();
        popup(player.x,player.y-116,t('copStop'),'#FFD9D4',19);
        Audio2.radio();                          // «بطاقة تعريف !»
      }
    }
    // the dialogue advances itself: a player mid-run is already tapping to jump,
    // and four taps used to flush the whole scene in under a second.
    if(cop.hold&&cop.chat>=0&&!cop.give){
      cop.dwell+=dt; cop.age+=dt;
      if(cop.dwell>=LINE_AUTO)advanceChat(true);
      if(cop.age>20)finishBribe();               // never soft-lock the run
    }
    // coins arc from the runner's hand into the cop's palm
    for(let i=cop.coins.length-1;i>=0;i--){
      const c=cop.coins[i];
      c.vy+=760*dt;c.x+=c.vx*dt;c.y+=c.vy*dt;
      if(c.x>=cop.x-46){
        cop.coins.splice(i,1);
        burst(cop.x-44,groundY()-42,'#F5D77E',5,120);
        if(!cop.coins.length&&cop.give===1){cop.give=2;finishBribe();}
      }
    }
    if(cop.wave>0)cop.wave=Math.max(0,cop.wave-dt);
  }
}

const LINE_MIN=1.15, LINE_AUTO=2.3;             // read-time floor / hands-off pace
function advanceChat(auto){
  if(!cop||!cop.hold||cop.give)return;
  if(!auto&&cop.dwell<LINE_MIN)return;          // a mashed tap can't skip the line
  cop.dwell=0;
  if(cop.chat<3){
    cop.chat++;
    if(cop.chat===1||cop.chat===3)Audio2.button();   // the runner speaks
    else Audio2.radio();                             // the radio crackles back
    if(cop.chat===3){                                // «خوذ قهوتك ☕»
      cop.give=1;
      game.score=Math.max(0,game.score-30);
      popup(player.x+30,player.y-96,I18N[lang].bribePop,'#F5D77E',14);
      for(let i=0;i<3;i++)
        cop.coins.push({x:player.x+14,y:player.y-46,
          vx:210+i*46,vy:-(230+i*34),
          rot:Math.random()*Math.PI,vr:(Math.random()*6-3)});
    }
  }
}
function finishBribe(){
  if(!cop)return;
  cop.hold=false;cop.done=true;cop.wave=1.2;game.policeHold=false;
  Audio2.radio();
  popup(cop.x-40,groundY()-96,I18N[lang].dlgGo,'#BFE3FF',14);
  if(game.event)game.event.t=Math.min(game.event.t,1.3);
}

function breakCombo(){
  game.combo=0;game.comboT=0;syncCombo();
}
// v21 — hearts. A hit costs one and buys a blink of mercy instead of ending
// the run outright; the third one still ends it.
function clearAhead(px){
  for(let i=obstacles.length-1;i>=0;i--)
    if(obstacles[i].x<px)obstacles.splice(i,1);
  for(let i=scorch.length-1;i>=0;i--)
    if(scorch[i].x<px)scorch.splice(i,1);
}
function loseLife(cause){
  game.lives--;
  breakCombo();
  syncLives();
  if(game.lives<=0){
    game.shake=1;game.flash=1;game.slow=.6;
    setMood('hurt',9);Audio2.hit();
    gameOver(cause);
    return false;
  }
  game.invuln=HIT_INVULN;
  game.freeze=.08;game.shake=.85;game.flash=.6;game.slow=.4;
  game.goldMeter=Math.max(0,game.goldMeter-GOLD_FULL*.3);
  game.hydration=Math.max(6,game.hydration-6);
  setMood('hurt',1.2);
  clearAhead(player.x+190);          // don't land him straight into the next one
  popup(player.x,player.y-104,'-1 \u2665','#E8564A',17);
  Audio2.hit();
  const h=el('hearts');
  if(h){h.classList.remove('hit');void h.offsetWidth;h.classList.add('hit');}
  return true;
}
function syncLives(force){
  const h=el('hearts');if(!h)return;
  if(!force&&h.dataset.n===String(game.lives))return;
  h.dataset.n=String(game.lives);
  let s='';
  for(let i=0;i<LIVES;i++)s+='<i'+(i<game.lives?'':' class="off"')+'>\u2665</i>';
  h.innerHTML=s;
}
function syncCombo(){
  const c=el('combo');if(!c)return;
  if(game.combo>=2){
    c.hidden=false;el('comboN').textContent=game.combo;
    if(A){A.remove('#combo');A({targets:'#combo',scale:[1.35,1],
      easing:'spring(1, 92, 11, 0)',duration:420});}
  }else c.hidden=true;
}
function syncGold(){                 // the countdown is a canvas bar now
  if(game.gold<=0&&state!==S.PLAY)goldBarA=0;
}
function gainGold(n,sx,sy){
  if(game.gold>0)return;                                   // not while already golden
  game.goldMeter=Math.min(GOLD_FULL,game.goldMeter+n);
  spawnHudMote(sx===undefined?player.x:sx,sy===undefined?player.y-50:sy);
  if(game.goldMeter>=GOLD_FULL){
    game.goldMeter=0;
    activateGold(BRANDS[(Math.random()*BRANDS.length)|0],player.x,player.y-46);
  }
}
function activateGold(brand,x,y){
  const kind=nextBoon(), B=BOONS[kind];
  game.boon=kind; game.boonLast=kind;
  game.gold=B.dur; game.goldMax=B.dur; game.rainT=0;
  // Gold clears the stage. A telegraph in flight is called off before it can
  // banner over the boon; anything already running is closed out properly, so
  // the lights come back instead of a blackout sitting under a golden wash.
  // A held scene (barrage, chams intro) is left alone — it owns the screen.
  if(game.event&&!game.policeHold&&!game.sunHold){
    if(game.event.phase==='on')eventExit(game.event.type);
    game.event=null;
    game.eventCd=B.dur+1.5;
    banner.hidden=true; if(bannerTl)bannerTl.pause();
  }
  game.score+=250;game.slow=.55;
  Audio2.pantStop();Audio2.duckMusic(true);
  if(kind==='dhahab')
    Audio2.goldGet(B.dur+0.45, Math.random()*46);  // a different slice of 3otchana each time
  else if(kind==='chta'){
    Audio2.sparkle(); Audio2.rainStart(); Audio2.setMusicMode('boon');
  }else{
    Audio2.gust(); Audio2.musicRate(1.09); Audio2.setMusicMode('boon');
  }
  game.hydration=Math.min(100,game.hydration+20);
  burst(x,y,B.col,26,340);burst(x,y,'#FFFFFF',10,200);
  popup(x,y-46,'+250',B.col,18);
  setMood('happy',.9);
  syncGold();
  const img=el('goldImg'),txt=el('goldTxt'),pop=el('goldPop');
  if(pop){
    img.src=`assets/gold/${brand}.png`;
    img.onerror=()=>{img.onerror=null;img.src=`assets/${brand}.png`;};
    txt.textContent=kind==='dhahab'
      ?(BRAND_NAME[brand]||brand).toUpperCase()+' '+t('enOr')
      :t(kind==='chta'?'boonRain':'boonWind');
    pop.hidden=false;
    if(A){
      A.remove('#goldImg');A.remove('#goldTxt');
      // Kept short on purpose: this fires mid-run, and every frame it is up is a
      // frame of obstacles you cannot read. ~1.0s total, was ~2.0s.
      A.timeline({easing:'spring(1, 80, 11, 0)'})
        .add({targets:'#goldImg',scale:[0,1],rotate:['-14deg','0deg'],duration:400})
        .add({targets:'#goldTxt',translateY:[18,0],opacity:[0,1],duration:300},'-=260')
        .add({targets:['#goldImg','#goldTxt'],opacity:0,duration:240,delay:320,
              easing:'easeInQuad',complete:()=>{pop.hidden=true;
                img.style.opacity=txt.style.opacity=1;}});
    }else setTimeout(()=>{pop.hidden=true;},1000);
  }
}

// ---------------------------------------------------------------- drawing
function drawBackground(R){
  const g=ctx.createLinearGradient(0,0,0,groundY());
  g.addColorStop(0,R.sky[0]);g.addColorStop(1,R.sky[1]);
  ctx.fillStyle=g;ctx.fillRect(-60,-60,W+120,H+120);

  const hot=evOn()==='canicule';
  // The sun used to hang in the sky through Carthage and the Sahara, stars and
  // all. It sets now: cross-faded into a crescent as the night factor climbs.
  const nf=R.night, sx0=W*.78, sy0=H*.2;
  if(evOn()==='chams'){ /* the angry sun replaces it */ } else {
    if(nf<.98){
      const sr=hot?58+Math.sin(game.t*2.2)*4:46;
      const sy=sy0+nf*H*.10;                       // dips toward the horizon
      ctx.fillStyle=hot?'#FBCB5A':R.sun;ctx.globalAlpha=.92*(1-nf);
      ctx.beginPath();ctx.arc(sx0,sy,sr,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=(hot?.22:.14)*(1-nf);
      ctx.beginPath();ctx.arc(sx0,sy,sr+36,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;
    }
    if(nf>.06){
      const mr=30, mx=W*.70, my=H*.16;
      ctx.globalAlpha=.10*nf;                      // halo
      ctx.fillStyle='#F2EEDC';
      ctx.beginPath();ctx.arc(mx,my,mr+26,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=.92*nf;
      ctx.beginPath();ctx.arc(mx,my,mr,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=nf;                          // bite the crescent out
      ctx.fillStyle=R.sky[0];
      ctx.beginPath();ctx.arc(mx+13,my-7,mr*.92,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=1;
    }
  }

  if(R.night>.05){
    ctx.fillStyle='#F7F4EE';
    for(let i=0;i<50;i++){
      let sx=(i*137.5-game.dist*.02)%(W+40);if(sx<0)sx+=W+40;
      ctx.globalAlpha=R.night*(.25+((i*7)%10)/18);
      ctx.fillRect(sx,(i*61.8)%(H*.5),2,2);
    }
    ctx.globalAlpha=1;
  }
  drawClouds(R);
  dunes(R,.14,groundY()-22,74,.55);
  drawCamels(R);
  skyline(R,.32);
  dunes(R,.5,groundY()-4,42,.85);
  palms(R,.62);
  drawBirds(R);
}

function drawClouds(R){
  const off=game.dist*.1, span=430;
  const first=Math.floor(off/span)-1;
  ctx.fillStyle='rgba(255,255,255,'+(0.55*(1-R.night*.8))+')';
  for(let i=first;i<first+Math.ceil(W/span)+3;i++){
    const r=((Math.sin(i*41.7)*9631.4)%1+1)%1;
    if(r<.35)continue;
    const x=i*span-off+r*160, y=46+r*120, sc=.7+r*.8;
    ctx.beginPath();
    ctx.arc(x,y,16*sc,0,Math.PI*2);
    ctx.arc(x+18*sc,y-7*sc,13*sc,0,Math.PI*2);
    ctx.arc(x+36*sc,y,15*sc,0,Math.PI*2);
    ctx.arc(x+18*sc,y+6*sc,14*sc,0,Math.PI*2);
    ctx.fill();
  }
}

let birds=[],birdTimer=0;
function drawBirds(R){
  birdTimer-=1/60;
  if(birdTimer<=0&&R.night<.5&&birds.length<6){
    birdTimer=5+Math.random()*9;
    const y=50+Math.random()*140,n=2+((Math.random()*3)|0);
    for(let i=0;i<n;i++)
      birds.push({x:W+40+i*26+Math.random()*10,y:y+(i%2)*12,ph:Math.random()*6});
  }
  ctx.strokeStyle=R.night>.4?'rgba(230,230,240,.7)':'rgba(40,50,70,.75)';
  ctx.lineWidth=2;ctx.lineCap='round';
  for(let i=birds.length-1;i>=0;i--){
    const b=birds[i];
    b.x-=(game.speed*.5+40)/60;b.ph+=.22;
    if(b.x<-40){birds.splice(i,1);continue;}
    const w=Math.sin(b.ph)*5;
    ctx.beginPath();
    ctx.moveTo(b.x-7,b.y-w);ctx.quadraticCurveTo(b.x-2,b.y+2,b.x,b.y);
    ctx.quadraticCurveTo(b.x+2,b.y+2,b.x+7,b.y-w);ctx.stroke();
  }
}

function drawCamels(R){
  if(R.idx<3||R.idx===5)return;                       // dunes regions only
  const off=game.dist*.22, span=760, base=groundY()-30;
  const first=Math.floor(off/span)-1;
  ctx.fillStyle=R.night>.5?'rgba(20,24,40,.85)':'rgba(90,64,40,.55)';
  for(let i=first;i<first+Math.ceil(W/span)+2;i++){
    const r=((Math.sin(i*57.3)*7777.7)%1+1)%1;
    if(r<.55)continue;
    const x=i*span-off+r*200, y=base-Math.sin((x+off*0)*.004)*8, sc=.9+r*.4;
    ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);
    ctx.beginPath();                                  // silhouette: body + two humps
    ctx.moveTo(-16,0);
    ctx.quadraticCurveTo(-14,-10,-7,-11);
    ctx.quadraticCurveTo(-3,-16,1,-11);
    ctx.quadraticCurveTo(5,-16,9,-11);
    ctx.quadraticCurveTo(14,-10,15,-4);
    ctx.lineTo(17,-4);ctx.lineTo(19,-14);              // neck
    ctx.quadraticCurveTo(19,-18,23,-17);               // head
    ctx.lineTo(23,-14);ctx.lineTo(20,-13);ctx.lineTo(19,-4);
    ctx.lineTo(15,0);ctx.closePath();ctx.fill();
    ctx.fillRect(-13,0,2.6,10);ctx.fillRect(-5,0,2.6,10);   // legs
    ctx.fillRect(4,0,2.6,10);ctx.fillRect(11,0,2.6,10);
    ctx.restore();
  }
}

// foreground scrub passing in front of the action, for depth
function drawForeground(R){
  const off=game.dist*1.22, span=340;
  const first=Math.floor(off/span)-1;
  for(let i=first;i<first+Math.ceil(W/span)+3;i++){
    const r=((Math.sin(i*93.1)*5417.9)%1+1)%1;
    if(r<.4)continue;
    const x=i*span-off+r*120, y=groundY()+46+r*30;
    if(r<.7){                                          // rock
      ctx.fillStyle='rgba(0,0,0,.16)';
      ctx.beginPath();ctx.ellipse(x,y,16+r*14,9+r*6,0,Math.PI,0);ctx.fill();
    }else{                                             // dry grass tuft
      ctx.strokeStyle='rgba(90,74,40,.5)';ctx.lineWidth=2.4;ctx.lineCap='round';
      for(let k=-2;k<=2;k++){
        ctx.beginPath();ctx.moveTo(x,y);
        ctx.quadraticCurveTo(x+k*4,y-12,x+k*7,y-19-Math.abs(k));ctx.stroke();
      }
    }
  }
}
function dunes(R,par,baseY,amp,alpha){
  const off=game.dist*par;
  ctx.fillStyle=R.hill;ctx.globalAlpha=alpha;
  ctx.beginPath();ctx.moveTo(-60,H+60);
  for(let x=-60;x<=W+60;x+=12)
    ctx.lineTo(x,baseY-Math.sin((x+off)*.0042)*amp-Math.sin((x+off)*.011)*amp*.35);
  ctx.lineTo(W+60,H+60);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
}
function skyline(R,par){
  const off=game.dist*par,span=150,base=groundY()-16;
  const first=Math.floor(off/span)-1;
  ctx.globalAlpha=.9;
  for(let i=first;i<first+Math.ceil(W/span)+3;i++){
    const x=i*span-off;
    const r=((Math.sin(i*12.9898)*43758.5453)%1+1)%1;
    const bw=82+r*46,bh=74+r*78;
    ctx.fillStyle=R.build;ctx.fillRect(x,base-bh,bw,bh);
    if(r>.66){ctx.beginPath();ctx.arc(x+bw/2,base-bh,bw*.3,Math.PI,0);ctx.fill();}
    ctx.fillStyle=R.trim;
    const dw=15,dh=26,dx=x+bw/2-dw/2;
    ctx.beginPath();ctx.moveTo(dx,base);ctx.lineTo(dx,base-dh+dw/2);
    ctx.arc(dx+dw/2,base-dh+dw/2,dw/2,Math.PI,0);ctx.lineTo(dx+dw,base);
    ctx.closePath();ctx.fill();
    if(bh>100){ctx.fillRect(x+14,base-bh+22,12,15);ctx.fillRect(x+bw-26,base-bh+22,12,15);}
    if(r>.84){                                        // Tunisian flag on the roof
      const fx=x+bw*.5,fy=base-bh-(r>.66?bw*.3:0);
      ctx.strokeStyle='#5A4632';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx,fy-22);ctx.stroke();
      const wav=Math.sin(game.t*3+i)*1.6;
      ctx.fillStyle='#E70013';                       // red field
      ctx.beginPath();ctx.moveTo(fx,fy-24);
      ctx.quadraticCurveTo(fx+10,fy-26+wav,fx+20,fy-24+wav);
      ctx.lineTo(fx+20,fy-11+wav);
      ctx.quadraticCurveTo(fx+10,fy-13+wav,fx,fy-11);
      ctx.closePath();ctx.fill();
      const cx=fx+10,cy=fy-17.5+wav*.5;
      ctx.fillStyle='#FFFFFF';                       // white disc
      ctx.beginPath();ctx.arc(cx,cy,4.6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#E70013';                       // red crescent, horns to the fly
      ctx.beginPath();ctx.arc(cx-.5,cy,3.4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#FFFFFF';
      ctx.beginPath();ctx.arc(cx+.9,cy,2.9,0,Math.PI*2);ctx.fill();
      drawStar(cx+1.2,cy,1.7,'#E70013');             // red star in the opening
    }
  }
  ctx.globalAlpha=1;
}
function palms(R,par){
  const off=game.dist*par,span=260,base=groundY()+4;
  const first=Math.floor(off/span)-1;
  const trunk=mixHex('#7A5A38','#2A2418',R.night);
  const frond=mixHex('#5C7A44','#22351F',R.night);
  for(let i=first;i<first+Math.ceil(W/span)+3;i++){
    const x=i*span-off+40;
    const r=((Math.sin(i*78.233)*12345.6789)%1+1)%1;
    const tr=66+r*46, sway=Math.sin(game.t*1.4+i)*3;
    ctx.strokeStyle=trunk;ctx.lineWidth=6;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(x,base);
    ctx.quadraticCurveTo(x+8,base-tr*.6,x+3+sway,base-tr);ctx.stroke();
    ctx.fillStyle=frond;
    for(let f=0;f<6;f++){
      const a=-Math.PI/2+(f-2.5)*.46,px=x+3+sway,py=base-tr;
      ctx.beginPath();ctx.moveTo(px,py);
      ctx.quadraticCurveTo(px+Math.cos(a)*34,py+Math.sin(a)*30-12,px+Math.cos(a)*52,py+Math.sin(a)*46+8);
      ctx.quadraticCurveTo(px+Math.cos(a)*30,py+Math.sin(a)*26+4,px,py);ctx.fill();
    }
  }
}
function drawGround(R){
  const gy=groundY();
  ctx.fillStyle=R.sand;ctx.fillRect(-60,gy,W+120,H-gy+120);
  ctx.fillStyle='rgba(0,0,0,.10)';ctx.fillRect(-60,gy,W+120,5);
  ctx.strokeStyle='rgba(0,0,0,.07)';ctx.lineWidth=3;ctx.lineCap='round';
  const off=game.dist%74;
  for(let x=-off-60;x<W+120;x+=74){
    const y=gy+26+((x|0)%3)*13;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+34,y);ctx.stroke();
  }
}

// ---- the runner, now with a face ------------------------------------------
function drawPlayer(){
  if(state===S.OVER&&deathFX){
    const pk0=H>W?1.22:1;
    ctx.save();
    ctx.translate(deathFX.x,deathFX.y);ctx.scale(pk0,pk0);
    ctx.translate(-deathFX.x,-deathFX.y);
    drawDeadPlayer();
    ctx.restore();
    return;
  }
  const y=player.y;
  const pk=H>W?1.22:1;
  ctx.save();
  ctx.translate(player.x,player.y);ctx.scale(pk,pk);ctx.translate(-player.x,-player.y);
  const air=Math.max(0,(groundY()-player.y)/180);
  ctx.fillStyle='rgba(0,0,0,.18)';
  ctx.beginPath();ctx.ellipse(player.x,groundY()+4,20*(1-air*.45),5.5*(1-air*.4),0,0,Math.PI*2);ctx.fill();
  drawScarf();

  if(game.gold>0){
    const blink=game.gold<1.6&&Math.floor(game.t*8)%2===0;
    const ga=ctx.createRadialGradient(player.x,y-32,6,player.x,y-32,52);
    ga.addColorStop(0,`rgba(245,215,126,${blink?.15:.4})`);
    ga.addColorStop(1,'rgba(245,215,126,0)');
    ctx.fillStyle=ga;ctx.beginPath();ctx.arc(player.x,y-32,52,0,Math.PI*2);ctx.fill();
  }
  ctx.save();
  ctx.translate(player.x,y-30);
  if(!player.onGround)ctx.rotate(clamp(player.vy/2100,-.2,.3));
  ctx.scale(player.sx,player.sy);
  ctx.translate(-player.x,-(y-30));

  const x=player.x;
  let swing=player.onGround&&state===S.PLAY?Math.sin(player.runT):(state===S.READY?Math.sin(player.runT)*.25:.75);
  const hunted=chamsChase();
  if(hunted){ swing*=.6; ctx.translate(x,y-30);ctx.rotate(.11);ctx.translate(-x,-(y-30)); }

  // legs / tunic / arms
  ctx.strokeStyle='#3C2E22';ctx.lineWidth=7;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x,y-22);ctx.lineTo(x+swing*16,y);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x,y-22);ctx.lineTo(x-swing*16,y-3);ctx.stroke();
  ctx.fillStyle='#F7F4EE';
  ctx.beginPath();ctx.moveTo(x-13,y-22);ctx.lineTo(x-10,y-52);
  ctx.lineTo(x+10,y-52);ctx.lineTo(x+13,y-22);ctx.closePath();ctx.fill();
  ctx.fillStyle='#2E76B8';ctx.fillRect(x-12,y-34,24,4);
  ctx.strokeStyle='#C68A5E';ctx.lineWidth=6;
  ctx.beginPath();ctx.moveTo(x,y-48);ctx.lineTo(x-swing*18,y-34);ctx.stroke();
  if(player.wipe>0){                              // wiping the brow in the heat
    const wp=Math.sin(Math.min(1,(0.6-player.wipe)/0.6)*Math.PI);
    ctx.beginPath();ctx.moveTo(x,y-48);
    ctx.quadraticCurveTo(x+16,y-52,x+8-wp*4,y-62);ctx.stroke();
  }else{
    ctx.beginPath();ctx.moveTo(x,y-48);ctx.lineTo(x+swing*18,y-37);ctx.stroke();
  }

  // head — bigger, facing travel direction
  const hx=x+3,hy=y-63,hr=12;
  ctx.fillStyle='#C68A5E';
  ctx.beginPath();ctx.arc(hx,hy,hr,0,Math.PI*2);ctx.fill();
  // chechia
  ctx.fillStyle='#B22B2B';
  ctx.beginPath();ctx.ellipse(hx,hy-9,hr+1,8.5,0,Math.PI,0);ctx.fill();
  ctx.fillRect(hx-hr-1,hy-10,2*hr+2,3.5);
  ctx.strokeStyle='#7E1E1E';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(hx+4,hy-16);ctx.quadraticCurveTo(hx+10,hy-14,hx+9,hy-9);ctx.stroke(); // tassel

  drawFace(hx,hy);
  ctx.restore();
  ctx.restore();

  // sweat drop when tired
  if(player.mood==='tired'&&Math.floor(game.t*2)%2===0){
    ctx.fillStyle='#7FC4EE';
    const sy2=y-74+((game.t*40)%10);
    ctx.beginPath();ctx.ellipse(x+16,sy2,2.4,3.6,0,0,Math.PI*2);ctx.fill();
  }
}

function drawFace(hx,hy){
  let m=player.mood;
  if(chamsChase()&&m==='run')m='tired';              // hunted = drained
  const ex=hx+4.5, ey=hy-2;                       // eyes toward travel direction
  ctx.fillStyle='#FFFFFF';
  if(m==='hurt'){
    // >< eyes
    ctx.strokeStyle='#3A2A1E';ctx.lineWidth=2;ctx.lineCap='round';
    for(const dx of [-3.5,4.5]){
      ctx.beginPath();ctx.moveTo(ex+dx-2.4,ey-2.4);ctx.lineTo(ex+dx+2.4,ey+2.4);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ex+dx+2.4,ey-2.4);ctx.lineTo(ex+dx-2.4,ey+2.4);ctx.stroke();
    }
  }else if(game.gold>0){
    // gold shades: too cool to have eyes
    ctx.fillStyle='#1A1410';
    rr(ex-6.8,ey-3,6.4,4.6,2);rr(ex+1.6,ey-3,6.4,4.6,2);
    ctx.fillRect(ex-1,ey-1.6,3,1.6);
    ctx.fillStyle='rgba(255,255,255,.55)';
    ctx.fillRect(ex-5.6,ey-2.2,2,1.4);ctx.fillRect(ex+2.8,ey-2.2,2,1.4);
  }else if(player.blink>0){
    ctx.strokeStyle='#3A2A1E';ctx.lineWidth=1.8;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(ex-6,ey);ctx.lineTo(ex-1.2,ey);ctx.stroke();
    ctx.beginPath();ctx.moveTo(ex+2,ey);ctx.lineTo(ex+6.8,ey);ctx.stroke();
  }else{
    const wide=m==='jump', tired=m==='tired';
    const rY=wide?3.4:tired?1.7:2.7;
    ctx.beginPath();ctx.ellipse(ex-3.5,ey,2.6,rY,0,0,Math.PI*2);
    ctx.ellipse(ex+4.5,ey,2.6,rY,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#2A1E14';
    const px=wide?0:1;                            // pupils forward while running
    ctx.beginPath();ctx.arc(ex-3.5+px,ey+(tired?.6:0),1.3,0,Math.PI*2);
    ctx.arc(ex+4.5+px,ey+(tired?.6:0),1.3,0,Math.PI*2);ctx.fill();
    if(tired){                                     // droopy lids
      ctx.fillStyle='#C68A5E';
      ctx.fillRect(ex-6.4,ey-2.6,5.6,1.8);ctx.fillRect(ex+1.6,ey-2.6,5.6,1.8);
    }
  }
  // brows
  ctx.strokeStyle='#3A2A1E';ctx.lineWidth=1.8;ctx.lineCap='round';
  const bl=m==='hurt'?1.5:m==='jump'?-2.6:m==='tired'?1:-.6;
  ctx.beginPath();ctx.moveTo(ex-6,ey-5+bl);ctx.lineTo(ex-1.4,ey-5.6);ctx.stroke();
  ctx.beginPath();ctx.moveTo(ex+2.4,ey-5.6);ctx.lineTo(ex+7,ey-5+bl);ctx.stroke();
  // mouth
  ctx.strokeStyle='#7A3A2A';ctx.lineWidth=2;
  ctx.beginPath();
  if(m==='happy'){ ctx.arc(ex+.5,hy+4.4,3.4,.15*Math.PI,.85*Math.PI); }
  else if(m==='jump'){ ctx.fillStyle='#7A3A2A';ctx.ellipse(ex+.5,hy+5,2.2,3,0,0,Math.PI*2);ctx.fill(); }
  else if(m==='hurt'){ ctx.arc(ex+.5,hy+7.5,3,1.15*Math.PI,1.85*Math.PI); }
  else if(m==='tired'){ ctx.fillStyle='#7A3A2A';ctx.ellipse(ex+.5,hy+5.4,2.6,2,0,0,Math.PI*2);ctx.fill(); }
  else { ctx.moveTo(ex-2,hy+4.8);ctx.lineTo(ex+3.4,hy+4.4); }
  ctx.stroke();
}

// ---- obstacles ----------------------------------------------------------
// Everything shares the same language: heavy ink outline, a red accent, and a
// hard contact shadow. Read it as danger before you read what it is.
const OB_INK='#1E1610';
function pr(x,y,w,h,r){ctx.beginPath();
  if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);}
function inked(fill,lw){
  ctx.fillStyle=fill;ctx.fill();
  ctx.strokeStyle=OB_INK;ctx.lineWidth=lw||2.6;ctx.lineJoin='round';ctx.stroke();
}
function obCactus(o){
  const x=o.x,y=o.y,w=o.w,h=o.h;
  pr(x+w*.30,y,w*.40,h,9);            inked('#4E7A46');
  pr(x,y+h*.30,w*.34,h*.46,9);        inked('#4E7A46');
  pr(x+w*.66,y+h*.16,w*.34,h*.50,9);  inked('#4E7A46');
  ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(x+w*.40,y+9);ctx.lineTo(x+w*.40,y+h-9);ctx.stroke();
  for(let i=0;i<3;i++){
    ctx.beginPath();
    ctx.ellipse(x+w*(.36+i*.13),y+3+(i%2)*4,4.2,5.4,0,0,Math.PI*2);
    inked('#D9584C',1.8);
  }
}
function obJar(o){
  const x=o.x,y=o.y,w=o.w,h=o.h;
  const body=()=>{ctx.beginPath();
    ctx.moveTo(x+w*.32,y+7);
    ctx.quadraticCurveTo(x-5,y+h*.52,x+w*.24,y+h);
    ctx.lineTo(x+w*.76,y+h);
    ctx.quadraticCurveTo(x+w+5,y+h*.52,x+w*.68,y+7);
    ctx.closePath();};
  body();inked('#B4703C');
  ctx.save();body();ctx.clip();
  ctx.fillStyle='#E4D2B4';ctx.fillRect(x-10,y+h*.44,w+20,5);
  ctx.fillStyle='#C4453B';ctx.fillRect(x-10,y+h*.55,w+20,4);
  ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(x+w*.30,y+9,5,h);
  ctx.restore();
  pr(x+w*.22,y,w*.56,10,3);inked('#8E5228');
}
function obCrate(o){
  const x=o.x,y=o.y,w=o.w,h=o.h;
  for(let i=0;i<3;i++){                       // empties poking out of the top
    const bx=x+w*(.24+i*.26);
    pr(bx-4,y-12,8,15,2);inked('#2E76B8',2);
    pr(bx-5,y-15,10,4,1.5);inked('#F2B33D',1.6);
  }
  pr(x,y,w,h,4);inked('#9C7A4E');
  ctx.strokeStyle=OB_INK;ctx.lineWidth=2.4;
  ctx.beginPath();
  ctx.moveTo(x+3,y+3);ctx.lineTo(x+w-3,y+h-3);
  ctx.moveTo(x+w-3,y+3);ctx.lineTo(x+3,y+h-3);
  ctx.moveTo(x,y+h*.5);ctx.lineTo(x+w,y+h*.5);
  ctx.stroke();
  ctx.fillStyle='#C4453B';ctx.fillRect(x+w*.16,y+h*.60,w*.68,6);
}
function obBarrier(o){
  const x=o.x,y=o.y,w=o.w,h=o.h;
  ctx.strokeStyle=OB_INK;ctx.lineWidth=5.5;ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(x+w*.20,y+h*.36);ctx.lineTo(x+w*.07,y+h);
  ctx.moveTo(x+w*.80,y+h*.36);ctx.lineTo(x+w*.93,y+h);
  ctx.stroke();
  const py=y+h*.26,ph=h*.36;
  ctx.save();pr(x,py,w,ph,3);ctx.clip();
  ctx.fillStyle='#F2EDE3';ctx.fillRect(x,py,w,ph);
  ctx.fillStyle='#D9382B';
  for(let i=-1;i<7;i++){
    const sx=x+i*14;
    ctx.beginPath();
    ctx.moveTo(sx,py+ph);ctx.lineTo(sx+8,py);
    ctx.lineTo(sx+16,py);ctx.lineTo(sx+8,py+ph);
    ctx.closePath();ctx.fill();
  }
  ctx.restore();
  pr(x,py,w,ph,3);ctx.strokeStyle=OB_INK;ctx.lineWidth=2.6;ctx.stroke();
  const on=Math.floor(game.t*4+o.seed)%2===0;          // blinking works lamp
  if(on){ctx.fillStyle='rgba(255,198,74,.30)';
    ctx.beginPath();ctx.arc(x+w*.5,y+h*.10,15,0,Math.PI*2);ctx.fill();}
  ctx.beginPath();ctx.arc(x+w*.5,y+h*.10,6,0,Math.PI*2);
  inked(on?'#FFC64A':'#8A6A22',2);
}
function obTires(o){
  const x=o.x,y=o.y,w=o.w,h=o.h;
  const n=h>50?3:2,th=h/n;
  for(let i=0;i<n;i++){
    const cy=y+th*(i+.5),off=(i%2?2.5:-2.5),cx=x+w/2+off;
    ctx.beginPath();ctx.ellipse(cx,cy,w*.5,th*.55,0,0,Math.PI*2);inked('#23262B');
    ctx.beginPath();ctx.ellipse(cx,cy,w*.20,th*.24,0,0,Math.PI*2);inked('#6E747C',2);
    ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=2;
    for(let k=0;k<5;k++){
      const a=k*.5-1.1;
      ctx.beginPath();
      ctx.moveTo(cx+Math.cos(a)*w*.30,cy+Math.sin(a)*th*.32);
      ctx.lineTo(cx+Math.cos(a)*w*.46,cy+Math.sin(a)*th*.48);
      ctx.stroke();
    }
  }
  ctx.fillStyle='#E8564A';ctx.fillRect(x+w*.14,y+1,w*.72,4);
}
function obPipe(o){
  const x=o.x,y=o.y,w=o.w,h=o.h;
  const ty=y+h*.34,th=h*.66;
  pr(x,ty,w,th,7);inked('#8A9099');
  ctx.save();pr(x,ty,w,th,7);ctx.clip();
  ctx.fillStyle='rgba(255,255,255,.22)';ctx.fillRect(x,ty+5,w,5);
  ctx.fillStyle='#A8603A';ctx.fillRect(x+w*.56,ty,w*.15,h);
  ctx.restore();
  pr(x+w*.04,ty-5,w*.16,th+5,3);inked('#6E747C',2.2);
  pr(x+w*.80,ty-5,w*.16,th+5,3);inked('#6E747C',2.2);
  const j=Math.sin(game.t*9+o.seed)*4;                 // the burst main
  ctx.strokeStyle='rgba(150,214,255,.85)';ctx.lineWidth=4;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x+w*.44,ty);
  ctx.quadraticCurveTo(x+w*.36,y-20+j,x+w*.14,y-4+j);ctx.stroke();
  ctx.fillStyle='rgba(190,232,255,.8)';
  for(let i=0;i<4;i++){
    const p=(game.t*2.2+i*.25+o.seed)%1;
    ctx.beginPath();
    ctx.arc(x+w*.44-p*38,ty-26*Math.sin(p*3.14),2.4,0,Math.PI*2);ctx.fill();
  }
}
function obBlocks(o){
  const x=o.x,y=o.y,w=o.w,h=o.h;
  const rows=h>52?3:2,rh=h/rows;
  for(let r=0;r<rows;r++){
    const off=r%2?-w*.10:0;
    pr(x+off,y+r*rh,w,rh-2,2);inked('#B0A796');
    ctx.fillStyle='#6C6459';
    ctx.fillRect(x+off+w*.16,y+r*rh+rh*.26,w*.22,rh*.42);
    ctx.fillRect(x+off+w*.60,y+r*rh+rh*.26,w*.22,rh*.42);
  }
  ctx.strokeStyle='#C4453B';ctx.lineWidth=3;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x+w*.20,y+h*.74);ctx.lineTo(x+w*.74,y+h*.42);ctx.stroke();
}
function obBin(o){
  const x=o.x,y=o.y,w=o.w,h=o.h;
  ctx.beginPath();
  ctx.moveTo(x+w*.10,y+h*.16);ctx.lineTo(x+w*.90,y+h*.16);
  ctx.lineTo(x+w*.80,y+h-5);ctx.lineTo(x+w*.20,y+h-5);
  ctx.closePath();inked('#3E7A4E');
  ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=2;
  for(let i=1;i<4;i++){
    const yy=y+h*.16+i*(h*.68/4);
    ctx.beginPath();ctx.moveTo(x+w*.18,yy);ctx.lineTo(x+w*.82,yy);ctx.stroke();
  }
  pr(x+w*.03,y+h*.01,w*.94,h*.17,4);inked('#2C5B3A');
  ctx.fillStyle='#C4453B';ctx.fillRect(x+w*.30,y+h*.38,w*.40,7);
  ctx.fillStyle=OB_INK;
  ctx.beginPath();ctx.arc(x+w*.26,y+h-4,5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+w*.74,y+h-4,5,0,Math.PI*2);ctx.fill();
}
// far-field warning chevron: fades in on the right edge, gone before it reaches
// you. In a blackout it stays lit — you can't dodge what you can't see.
function obWarn(o,a){
  const x=o.x+o.w/2,y=o.y-19-Math.sin(game.t*6+o.seed)*3;
  ctx.save();ctx.globalAlpha=a;
  ctx.beginPath();ctx.moveTo(x,y-11);ctx.lineTo(x+10,y+6);ctx.lineTo(x-10,y+6);
  ctx.closePath();
  ctx.fillStyle='#E8564A';ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1.6;ctx.stroke();
  ctx.fillStyle='#FFF3E8';ctx.fillRect(x-1.4,y-5,2.8,7);
  ctx.beginPath();ctx.arc(x,y+4,1.5,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
const OB_DRAW={cactus:obCactus,jar:obJar,crate:obCrate,barrier:obBarrier,
               tires:obTires,pipe:obPipe,blocks:obBlocks,bin:obBin};
function drawObstacles(){
  const gy=groundY(),dark=evOn()==='delestage';
  for(const o of obstacles){
    if(o.seed===undefined)o.seed=0;
    ctx.fillStyle='rgba(0,0,0,.30)';            // a real contact shadow
    ctx.beginPath();ctx.ellipse(o.x+o.w/2,gy+4,o.w*.56,6.5,0,0,Math.PI*2);ctx.fill();
    ctx.save();
    (OB_DRAW[o.kind]||obCrate)(o);
    ctx.restore();
    // scaled to the screen, not to pixels: on a phone the right half is all
    // the runway there is.
    const run=Math.max(120,W-player.x);
    const far=clamp((o.x-(player.x+run*.42))/(run*.34),0,1);
    const a=dark?Math.max(.6,far):far;
    if(a>.02)obWarn(o,a*.85);
  }
}
function drawStar(x,y,r,color){
  ctx.fillStyle=color;ctx.beginPath();
  for(let i=0;i<10;i++){
    const a=-Math.PI/2+i*Math.PI/5, rad=i%2?r*.45:r;
    const px=x+Math.cos(a)*rad, py=y+Math.sin(a)*rad;
    i?ctx.lineTo(px,py):ctx.moveTo(px,py);
  }
  ctx.closePath();ctx.fill();
}
function rr(x,y,w,h,r){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);ctx.fill();}

function drawBottles(){
  for(const b of bottles){
    const y=b.y+Math.sin(b.bob)*5;          // own bob only — never the beat
    const g=ctx.createRadialGradient(b.x,y,2,b.x,y,40);
    g.addColorStop(0,'rgba(255,255,255,.6)');g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,y,40,0,Math.PI*2);ctx.fill();
    if(b.bidon){
      ctx.save();ctx.translate(b.x,y);ctx.rotate(Math.sin(b.bob)*.06);
      ctx.fillStyle='#2E76B8';rr(-17,-20,34,40,6);
      ctx.fillStyle='#3FA9E8';rr(-13,-16,12,32,4);
      ctx.strokeStyle='#17457A';ctx.lineWidth=4;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(-6,-20);ctx.quadraticCurveTo(0,-30,6,-20);ctx.stroke();
      ctx.fillStyle='#F2B33D';rr(8,-26,9,8,2);
      ctx.restore();
      continue;
    }
    const im=imgs[b.brand];
    if(im){
      const h=b.h,w=im.width*(h/im.height);
      ctx.save();ctx.translate(b.x,y);ctx.rotate(Math.sin(b.bob*.7)*.09);
      ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();
    }else{ctx.fillStyle='#2E76B8';rr(b.x-10,y-b.h/2,20,b.h,5);}
    if(b.gl!==undefined&&b.gl<0){                  // 4-point twinkle
      const k=Math.sin((-b.gl/.4)*Math.PI),
            tx=b.x-b.w*.28,ty=y-b.h*.32;
      ctx.save();ctx.translate(tx,ty);ctx.rotate(.5);
      ctx.fillStyle=`rgba(255,255,255,${.9*k})`;
      ctx.beginPath();
      for(let q=0;q<8;q++){
        const rr2=q%2?1.6:5.5*k,a=q*Math.PI/4;
        ctx.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2);
      }
      ctx.closePath();ctx.fill();ctx.restore();
    }
  }
}
function drawRings(){
  for(const g of rings){
    ctx.globalAlpha=Math.max(0,g.life/g.tot)*.8;
    ctx.strokeStyle=g.color;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.ellipse(g.x,g.y,g.r,g.r*.35,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.globalAlpha=1;
}
function drawSunAngry(){
  if(!sunA)return;
  if(sunA.state==='intro'){                          // the world dims for its entrance
    const k=Math.min(1,sunA.face*1.4);
    ctx.fillStyle=`rgba(20,10,6,${.34*k})`;ctx.fillRect(0,0,W,H);
    const halo=ctx.createRadialGradient(sunA.x,sunA.y,sunA.r,sunA.x,sunA.y,sunA.r*4);
    halo.addColorStop(0,`rgba(246,160,60,${.30*k})`);
    halo.addColorStop(1,'rgba(246,160,60,0)');
    ctx.fillStyle=halo;ctx.beginPath();
    ctx.arc(sunA.x,sunA.y,sunA.r*4,0,Math.PI*2);ctx.fill();
  }
  drawWhip(sunA);
  const sh=Math.sin(game.t*22)*2*sunA.face;         // furious tremble
  const x=sunA.x+sh, y=sunA.y, r=52;
  if(sunImg.naturalWidth){                           // the uploaded sun, alive
    const f=sunA.face;
    const ov=1.7-.7*f;                               // entrance overshoot
    const sc=(f<1? f*ov : 1)* (1+Math.sin(game.t*3.1)*.02);
    const w2=r*4.5*sc, h2=w2*(sunImg.naturalHeight/sunImg.naturalWidth);
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(Math.sin(game.t*17)*.035*f);
    ctx.drawImage(sunImg,-w2/2,-h2/2,w2,h2);
    ctx.restore();
    return;
  }
  ctx.save();
  ctx.fillStyle='rgba(246,140,60,.25)';
  ctx.beginPath();ctx.arc(x,y,r+30+Math.sin(game.t*6)*6,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#F58C3C';ctx.lineWidth=5;ctx.lineCap='round';
  for(let i=0;i<10;i++){                             // jagged rays
    const a=game.t*1.2+i*Math.PI/5;
    ctx.beginPath();
    ctx.moveTo(x+Math.cos(a)*(r+6),y+Math.sin(a)*(r+6));
    ctx.lineTo(x+Math.cos(a)*(r+22+Math.sin(game.t*9+i)*5),y+Math.sin(a)*(r+22+Math.sin(game.t*9+i)*5));
    ctx.stroke();
  }
  ctx.fillStyle='#F6A23C';
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#E2601E';                           // furious brows
  ctx.save();ctx.translate(x,y);
  ctx.rotate(.35);ctx.fillRect(-34,-24,26,7);
  ctx.rotate(-.7);ctx.fillRect(8,-24,26,7);
  ctx.restore();
  ctx.fillStyle='#7A2E0E';                           // eyes + snarl
  ctx.beginPath();ctx.arc(x-16,y-8,6,0,Math.PI*2);ctx.arc(x+16,y-8,6,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#7A2E0E';ctx.lineWidth=5;
  ctx.beginPath();ctx.arc(x,y+22,13,1.15*Math.PI,1.85*Math.PI);ctx.stroke();
  ctx.restore();
}
function drawScorch(){
  const gy=groundY();
  for(const z of scorch){
    if(z.phase==='warn'){
      const p=.5+.5*Math.sin(game.t*18);
      ctx.fillStyle=`rgba(245,90,40,${.35+.3*p})`;
      ctx.beginPath();ctx.ellipse(z.x,gy+2,44,8,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=`rgba(255,190,80,${.5+.3*p})`;ctx.lineWidth=2;
      ctx.beginPath();ctx.ellipse(z.x,gy+2,30+p*10,6,0,0,Math.PI*2);ctx.stroke();
    }else{
      ctx.fillStyle='rgba(255,190,80,.32)';
      ctx.fillRect(z.x-40,0,80,gy);
      for(let f=0;f<6;f++){
        const fx=z.x-30+f*12, fh=26+Math.sin(game.t*18+f*2)*10;
        ctx.fillStyle=f%2?'#F58C3C':'#F6C33C';
        ctx.beginPath();
        ctx.moveTo(fx-7,gy);ctx.quadraticCurveTo(fx,gy-fh,fx+7,gy);
        ctx.closePath();ctx.fill();
      }
      if(Math.random()<.5)
        particles.push({x:z.x+(Math.random()-.5)*60,y:gy-8,vx:(Math.random()-.5)*30,
          vy:-(60+Math.random()*70),life:.4,max:.4,r:1.6+Math.random()*2,
          color:'#F6A23C',grav:-40});
    }
  }
}
function drawCopChat(){
  if(!cop||!cop.hold||cop.chat<0)return;
  const D=I18N[lang], line=D.dlg[Math.min(cop.chat,3)];
  const isCop=cop.chat%2===0;
  const bx=isCop?cop.x-40:player.x+6,
        by=isCop?groundY()-118:player.y-118;
  ctx.save();
  ctx.font='700 13px system-ui,sans-serif';
  const tw=ctx.measureText(line).width, pw=tw+26, ph=32;
  const x0=clamp(bx-pw/2,8,W-pw-8), y0=by-ph;
  ctx.fillStyle=isCop?'rgba(247,244,238,.96)':'rgba(191,227,255,.96)';
  ctx.strokeStyle='rgba(20,36,61,.85)';ctx.lineWidth=2;
  ctx.beginPath();
  if(ctx.roundRect)ctx.roundRect(x0,y0,pw,ph,9);else ctx.rect(x0,y0,pw,ph);
  ctx.fill();ctx.stroke();
  ctx.beginPath();                                    // tail
  ctx.moveTo(bx-6,y0+ph);ctx.lineTo(bx+6,y0+ph);ctx.lineTo(bx,y0+ph+9);
  ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#14243D';ctx.textAlign='center';
  ctx.fillText(line,x0+pw/2,y0+21);
  if(!cop.give){                                      // blinking "tap" hint
    ctx.globalAlpha=.55+.35*Math.sin(game.t*6);
    ctx.font='700 11px system-ui,sans-serif';
    ctx.fillStyle='#F7F4EE';
    ctx.fillText(D.tapNext,x0+pw/2,y0+ph+24);
    ctx.globalAlpha=1;
  }
  ctx.textAlign='left';ctx.restore();
  for(const c of cop.coins){                          // 20-dinar notes fluttering
    c.rot+=(c.vr||0)*.016;
    ctx.save();ctx.translate(c.x,c.y);ctx.rotate(Math.sin(c.rot)*.5);
    ctx.fillStyle='#E8A7A2';ctx.fillRect(-8,-4.5,16,9);
    ctx.strokeStyle='#B4534B';ctx.lineWidth=1;ctx.strokeRect(-8,-4.5,16,9);
    ctx.fillStyle='#B4534B';ctx.font='800 6px system-ui,sans-serif';
    ctx.textAlign='center';ctx.fillText('20',0,2.2);ctx.textAlign='left';
    ctx.restore();
  }
}
function drawCop(){
  if(!cop)return;
  const gy=groundY(), x=cop.x;
  ctx.save();
  ctx.fillStyle='rgba(0,0,0,.16)';
  ctx.beginPath();ctx.ellipse(x+40,gy+4,74,7,0,0,Math.PI*2);ctx.fill();
  // berline in the official livery: white, blue band, dotted trim, both scripts
  ctx.fillStyle='#F4F4F1';rr(x-18,gy-40,120,28,8);
  ctx.beginPath();ctx.moveTo(x+8,gy-40);ctx.lineTo(x+22,gy-60);
  ctx.lineTo(x+72,gy-60);ctx.lineTo(x+86,gy-40);ctx.closePath();ctx.fill();
  ctx.fillStyle='#2456A4';rr(x-18,gy-32,120,13,2);   // the band
  ctx.fillStyle='#F4F4F1';
  for(let dx2=-14;dx2<100;dx2+=7){                   // dotted white edges
    ctx.fillRect(x+dx2,gy-31.5,3.5,1.6);
    ctx.fillRect(x+dx2,gy-20.6,3.5,1.6);
  }
  ctx.font='800 8.5px system-ui,sans-serif';ctx.textAlign='center';
  ctx.fillText('POLICE',x+16,gy-22.5);
  ctx.font='800 10px system-ui,sans-serif';
  ctx.fillText('\u0634\u0631\u0637\u0629',x+66,gy-22);
  ctx.textAlign='left';
  ctx.fillStyle='#BFE3FF';rr(x+26,gy-57,20,14,3);rr(x+50,gy-57,18,14,3);
  const bl=Math.floor(game.t*5)%2===0;               // single red beacon
  ctx.fillStyle=bl?'#E04638':'#7E241C';rr(x+41,gy-68,12,8,2);
  if(bl){ctx.fillStyle='rgba(224,70,56,.25)';
    ctx.beginPath();ctx.arc(x+47,gy-64,16,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#2A2A30';
  for(const wx of [x+4,x+76]){
    ctx.beginPath();ctx.arc(wx,gy-8,11,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#6E7480';ctx.beginPath();ctx.arc(wx,gy-8,4.5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#2A2A30';
  }
  // the officer, paddle up while holding, waving when done
  const ox=x-42, oy=gy;
  ctx.strokeStyle='#26354E';ctx.lineWidth=7;ctx.lineCap='round';  // navy trousers
  ctx.beginPath();ctx.moveTo(ox,oy-20);ctx.lineTo(ox-7,oy);ctx.stroke();
  ctx.beginPath();ctx.moveTo(ox,oy-20);ctx.lineTo(ox+7,oy);ctx.stroke();
  ctx.fillStyle='#6E9FD4';                                        // light-blue shirt
  ctx.beginPath();ctx.moveTo(ox-11,oy-20);ctx.lineTo(ox-9,oy-46);
  ctx.lineTo(ox+9,oy-46);ctx.lineTo(ox+11,oy-20);ctx.closePath();ctx.fill();
  ctx.fillStyle='#1A2230';rr(ox-10,oy-27,20,4,1);                 // duty belt
  ctx.fillStyle='#26354E';ctx.fillRect(ox-1.5,oy-45,3,12);        // tie
  ctx.fillStyle='#F2B33D';                                        // badge
  ctx.beginPath();ctx.arc(ox+6,oy-40,2.2,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#C68A5E';ctx.lineWidth=5;
  const armA=cop.hold?-1.15:cop.wave>0?-.5+Math.sin(game.t*8)*.4:.5;
  ctx.beginPath();ctx.moveTo(ox,oy-42);
  ctx.lineTo(ox-16*Math.cos(armA),oy-42+16*Math.sin(armA));ctx.stroke();
  ctx.strokeStyle='#1A2E4A';
  ctx.beginPath();ctx.moveTo(ox,oy-42);ctx.lineTo(ox+10,oy-30);ctx.stroke();
  ctx.fillStyle='#C68A5E';
  ctx.beginPath();ctx.arc(ox,oy-53,8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#26354E';                                        // service cap
  ctx.beginPath();ctx.arc(ox,oy-56,8.5,Math.PI,0);ctx.fill();
  rr(ox-9,oy-57.5,18,3,1);
  ctx.fillStyle='#1A2230';rr(ox-8,oy-54.5,10,2.2,1);              // visor
  ctx.fillStyle='#F2B33D';
  ctx.beginPath();ctx.arc(ox,oy-59,1.6,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#1A2E4A';                           // kepi
  ctx.fillRect(ox-9,oy-60,18,5);ctx.fillRect(ox-9,oy-62,14,3);
  if(cop.hold){                                      // the STOP paddle: قف
    const px2=ox-16*Math.cos(armA),py2=oy-42+16*Math.sin(armA);
    ctx.strokeStyle='#8A6A3A';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(px2,py2);ctx.lineTo(px2-4,py2-16);ctx.stroke();
    ctx.fillStyle='#D9584C';
    ctx.beginPath();ctx.arc(px2-6,py2-24,11,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#fff';ctx.font='800 10px system-ui,sans-serif';
    ctx.textAlign='center';ctx.fillText(t('stopPaddle'),px2-6,py2-20);ctx.textAlign='left';
  }
  ctx.restore();
}
function drawTruck(){
  if(!truck)return;
  const y=groundY();
  ctx.save();ctx.translate(truck.x,y+Math.sin(game.t*11)*1.6);
  ctx.fillStyle='rgba(0,0,0,.16)';
  ctx.beginPath();ctx.ellipse(0,4,86,7,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#2E76B8';rr(-84,-56,118,40,10);            // tank
  ctx.fillStyle='#8FC7E8';rr(-84,-44,118,8,4);              // stripe
  ctx.fillStyle='#F7F4EE';
  ctx.font='800 15px system-ui,sans-serif';ctx.textAlign='center';
  ctx.fillText('EAU',-25,-27);ctx.textAlign='left';
  ctx.fillStyle='#17457A';rr(34,-46,44,30,6);               // cab
  ctx.fillStyle='#BFE3FF';rr(56,-42,18,13,3);               // window
  ctx.fillStyle='#2A2A30';
  for(const wx of [-58,-14,50]){
    ctx.beginPath();ctx.arc(wx,-8,12,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#6E7480';
    ctx.beginPath();ctx.arc(wx,-8,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#2A2A30';
  }
  // drips from the back valve
  ctx.fillStyle='rgba(63,169,232,.85)';
  ctx.beginPath();ctx.arc(-82,-12+((game.t*70)%14),2.4,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function drawParticles(){
  for(const p of particles){
    ctx.globalAlpha=Math.max(0,p.life/p.max);
    ctx.fillStyle=p.color;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;
}
function drawPopups(){
  ctx.textAlign='center';
  for(const p of popups){
    const a=Math.max(0,p.life/p.max);
    const k=Math.min(1,(p.max-p.life)/.16);
    const c=1.70158+1, t=k-1,
          sc=k>=1?1:(t*t*((c)*t+c-1)+1)*.85+.15;   // easeOutBack pop-in
    ctx.save();ctx.translate(p.x,p.y);ctx.scale(sc,sc);
    ctx.globalAlpha=a;
    ctx.font=`800 ${p.size}px ui-monospace,Menlo,monospace`;
    ctx.strokeStyle='rgba(20,36,61,.8)';ctx.lineWidth=4;ctx.strokeText(p.text,0,0);
    ctx.fillStyle=p.color;ctx.fillText(p.text,0,0);
    ctx.restore();
  }
  ctx.globalAlpha=1;ctx.textAlign='left';
}
function drawLines(){
  ctx.strokeStyle='#FFFFFF';ctx.lineWidth=2;ctx.lineCap='round';
  for(const l of lines){
    ctx.globalAlpha=Math.min(.34,l.life)*.8;
    ctx.beginPath();ctx.moveTo(l.x,l.y);ctx.lineTo(l.x+l.len,l.y);ctx.stroke();
  }
  ctx.globalAlpha=1;
}

// gauge: docked to the HUD corner on a plate, not floating in the sky
function bottlePath(gw,gh){
  const b=new Path2D();
  b.moveTo(gw*.34,0);b.lineTo(gw*.66,0);b.lineTo(gw*.66,gh*.13);
  b.quadraticCurveTo(gw,gh*.2,gw,gh*.36);b.lineTo(gw,gh*.9);
  b.quadraticCurveTo(gw,gh,gw*.86,gh);b.lineTo(gw*.14,gh);
  b.quadraticCurveTo(0,gh,0,gh*.9);b.lineTo(0,gh*.36);
  b.quadraticCurveTo(0,gh*.2,gw*.34,gh*.13);b.closePath();
  return b;
}
function drawGoldGauge(gx,gy){
  const gw=20,gh=48;
  const pct=game.gold>0?1:clamp(game.goldMeter/GOLD_FULL,0,1);
  const hot=pct>.75||game.gold>0;
  ctx.save();ctx.translate(gx,gy);
  if(gaugePulse>0){
    const pz=1+.16*gaugePulse;
    ctx.translate(gw/2,gh/2);ctx.scale(pz,pz);ctx.translate(-gw/2,-gh/2);
  }
  if(hot){ctx.shadowColor='rgba(245,215,126,.9)';ctx.shadowBlur=10+Math.sin(game.t*6)*5;}
  const body=bottlePath(gw,gh);
  ctx.fillStyle='rgba(247,244,238,.12)';ctx.fill(body);
  ctx.save();ctx.clip(body);
  const wl=gh*(1-pct*.9);
  const gg=ctx.createLinearGradient(0,gh,0,0);
  gg.addColorStop(0,'#C9922A');gg.addColorStop(1,'#F5D77E');
  ctx.fillStyle=gg;
  ctx.beginPath();ctx.moveTo(-3,wl);
  for(let x=-3;x<=gw+3;x+=3)ctx.lineTo(x,wl+Math.sin(x*.5+game.t*5)*1.4);
  ctx.lineTo(gw+3,gh+3);ctx.lineTo(-3,gh+3);ctx.closePath();ctx.fill();
  ctx.restore();
  ctx.shadowBlur=0;
  ctx.strokeStyle='rgba(245,215,126,.85)';ctx.lineWidth=1.8;ctx.stroke(body);
  ctx.fillStyle='#F5D77E';ctx.fillRect(gw*.3,-5,gw*.4,6);
  ctx.fillStyle='rgba(245,215,126,.85)';
  ctx.font='700 8px ui-monospace,Menlo,monospace';ctx.textAlign='center';
  ctx.fillText('\u2726',gw/2,gh+11);ctx.textAlign='left';
  ctx.restore();
}
function drawGauge(){
  const gw=26,gh=62;
  const gx=H>W?Math.round(W/2-31):20, gy=H>W?16:86;
  const pct=clamp(game.hydration/100,0,1), low=pct<.28;
  ctx.save();
  // plate wide enough for both bottles
  ctx.fillStyle='rgba(20,36,61,.5)';
  rr(gx-8,gy-14,gw+52,gh+30,12);
  ctx.translate(gx,gy);
  const body=new Path2D();
  body.moveTo(gw*.34,0);body.lineTo(gw*.66,0);body.lineTo(gw*.66,gh*.13);
  body.quadraticCurveTo(gw,gh*.2,gw,gh*.36);body.lineTo(gw,gh*.9);
  body.quadraticCurveTo(gw,gh,gw*.86,gh);body.lineTo(gw*.14,gh);
  body.quadraticCurveTo(0,gh,0,gh*.9);body.lineTo(0,gh*.36);
  body.quadraticCurveTo(0,gh*.2,gw*.34,gh*.13);body.closePath();
  ctx.fillStyle='rgba(247,244,238,.14)';ctx.fill(body);
  ctx.save();ctx.clip(body);
  const wl=gh*(1-pct*.86);
  ctx.fillStyle=low?'#D9584C':'#3FA9E8';
  ctx.beginPath();ctx.moveTo(-3,wl);
  for(let x=-3;x<=gw+3;x+=3)ctx.lineTo(x,wl+Math.sin(x*.4+game.t*4.5)*1.8);
  ctx.lineTo(gw+3,gh+3);ctx.lineTo(-3,gh+3);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(gw*.18,wl,3,gh-wl);
  ctx.restore();
  ctx.strokeStyle=low&&Math.floor(game.t*6)%2===0?'#F7F4EE':'rgba(247,244,238,.8)';
  ctx.lineWidth=2;ctx.stroke(body);
  ctx.fillStyle=low?'#D9584C':'#F2B33D';ctx.fillRect(gw*.3,-6,gw*.4,7);
  ctx.fillStyle='rgba(247,244,238,.75)';
  ctx.font='700 9px ui-monospace,Menlo,monospace';ctx.textAlign='center';
  ctx.fillText(t('waterLbl'),gw/2,gh+12);
  ctx.textAlign='left';
  ctx.restore();
  drawGoldGauge(gx+gw+12,gy+7);
  drawGoldBar(gx-8,gy+80,gw+52);
}
// Gold countdown: a slim bar tucked under the gauge plate. It fades in when the
// boon lands and fades out with it — no chip parked in the corner, no numbers.
function drawGoldBar(x,y,w){
  if(goldBarA<=.004)return;
  const h=6, p=clamp(game.gold/Math.max(.001,game.goldMax),0,1);
  ctx.save();
  ctx.globalAlpha=goldBarA*.55;
  ctx.fillStyle='rgba(20,36,61,.75)';rr(x,y,w,h,3);
  const blink=game.gold>0&&game.gold<1.5&&Math.floor(game.t*8)%2===0;
  ctx.globalAlpha=goldBarA*(blink?.34:1);
  const g=ctx.createLinearGradient(x,0,x+w,0);
  g.addColorStop(0,'#F5D77E');g.addColorStop(1,'#D9A927');
  ctx.fillStyle=g;rr(x,y,Math.max(3,w*p),h,3);
  ctx.restore();
}

function drawReadyHint(){
  const t=game.t;
  const py=player.y-96-Math.abs(Math.sin(t*3))*10;
  ctx.textAlign='center';ctx.font='800 26px system-ui,sans-serif';
  ctx.globalAlpha=.85;ctx.fillStyle='#F7F4EE';
  ctx.fillText('\u2b06',player.x,py);
  ctx.globalAlpha=1;ctx.textAlign='left';
  for(let i=0;i<2;i++){
    const ph=((t*.9+i*.5)%1);
    ctx.globalAlpha=(1-ph)*.5;
    ctx.strokeStyle='#F5D77E';ctx.lineWidth=2;
    ctx.beginPath();
    ctx.ellipse(player.x,groundY()+3,14+ph*26,(14+ph*26)*.32,0,0,Math.PI*2);
    ctx.stroke();
  }
  ctx.globalAlpha=1;
}
function goldRamp(){
  if(game.gold<=0)return 0;
  const inR=clamp((game.goldMax-game.gold)/.45,0,1); // ease in
  const outR=clamp(game.gold/.7,0,1);               // ease out
  return Math.min(inR,outR);
}
function render(){
  const R=regionMix();
  const gr=goldRamp();
  ctx.save();
  const s=game.shake*10;
  ctx.translate((Math.random()-.5)*s,(Math.random()-.5)*s+camY+camKick*9);
  if(gr>0){                                          // slight push-in on the runner
    const z=1+.05*gr;
    ctx.translate(player.x,player.y-40);
    ctx.scale(z,z);
    ctx.translate(-player.x,-(player.y-40));
  }
  drawBackground(R);drawGround(R);
  if(evOn()==='pluie')drawPuddles();
  drawObstacles();drawTruck();drawCop();drawScorch();drawWeeds();drawBottles();drawRings();
  if(gr>0)drawGoldRays(gr);
  drawGhosts();
  if(state===S.PLAY&&game.invuln>0&&Math.floor(game.t*16)%2===0){
    ctx.save();ctx.globalAlpha=.32;drawPlayer();ctx.restore();
  }else drawPlayer();
  drawParticles();drawLines();
  drawForeground(R);drawPopups();
  drawCopChat();
  ctx.restore();
  drawSunAngry();
  const ev=evOn();
  if(ev==='dhaw9ass'){                               // the meme freeze
    ctx.fillStyle=`rgba(4,7,16,${.86+Math.sin(game.t*40)*.03})`;
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#F7F4EE';ctx.textAlign='center';
    ctx.font='800 30px system-ui,sans-serif';
    ctx.fillText(t('frozeMain'),W/2,H*.44);
    ctx.font='700 15px ui-monospace,Menlo,monospace';ctx.globalAlpha=.7;
    ctx.fillText('DSL, DHAW 9ASS\u2026',W/2,H*.44+30);
    ctx.globalAlpha=1;
    for(let i=0;i<3;i++){                            // fake loading dots
      const on=Math.floor(game.t*3)%3===i;
      ctx.fillStyle=on?'#F5D77E':'rgba(247,244,238,.3)';
      ctx.beginPath();ctx.arc(W/2-20+i*20,H*.44+58,4,0,Math.PI*2);ctx.fill();
    }
    ctx.textAlign='left';
  }
  if(ev==='coupure'){                                // the colour drains with the water
    ctx.fillStyle='rgba(128,132,138,.30)';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(60,64,74,.14)';ctx.fillRect(0,0,W,H);
  }
  if(ev==='canicule'){                               // rising heat shimmer
    ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=2.5;ctx.lineCap='round';
    for(let k=0;k<5;k++){
      const bx=(k*W/5+((game.t*30+k*60)%(W/5)));
      const by=groundY()-8-((game.t*46+k*90)%150);
      ctx.beginPath();
      for(let yy=0;yy<=26;yy+=4)
        ctx.lineTo(bx+Math.sin((yy+game.t*160)*.24+k)*4,by-yy);
      ctx.stroke();
    }
    ctx.fillStyle='rgba(255,150,60,.07)';ctx.fillRect(0,0,W,H);
  }
  if(ev==='delestage'){                              // blackout: torchlight around the runner
    const d=ctx.createRadialGradient(player.x,player.y-36,44,player.x,player.y-36,190);
    d.addColorStop(0,'rgba(6,10,22,0)');
    d.addColorStop(.62,'rgba(6,10,22,.62)');
    d.addColorStop(1,'rgba(6,10,22,.9)');
    ctx.fillStyle=d;ctx.fillRect(0,0,W,H);
    for(const b of bottles){                         // collectibles glimmer in the dark
      const yy=b.y+Math.sin(b.bob)*5;
      const g2=ctx.createRadialGradient(b.x,yy,2,b.x,yy,26);
      g2.addColorStop(0,'rgba(180,220,255,.5)');g2.addColorStop(1,'rgba(180,220,255,0)');
      ctx.fillStyle=g2;ctx.beginPath();ctx.arc(b.x,yy,26,0,Math.PI*2);ctx.fill();
    }
    for(const o of obstacles){                       // and hazards keep an emergency edge
      const cx=o.x+o.w/2,cy=o.y+o.h/2,r=Math.max(o.w,o.h)*1.15;
      const g3=ctx.createRadialGradient(cx,cy,4,cx,cy,r);
      g3.addColorStop(0,'rgba(255,120,90,.32)');g3.addColorStop(1,'rgba(255,120,90,0)');
      ctx.fillStyle=g3;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(255,158,128,.7)';ctx.lineWidth=2;
      ctx.strokeRect(o.x+2,o.y+2,o.w-4,o.h-4);
    }
    drawFlies();
  }
  if(ev==='pluie'){                                  // the country's dream
    ctx.fillStyle='rgba(46,90,110,.12)';ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(190,225,255,.5)';ctx.lineWidth=1.6;ctx.lineCap='round';
    for(let k=0;k<46;k++){
      const rx=((k*173.7+game.t*(430+k%5*60))%(W+80))-40;
      const ry=((k*91.3+game.t*(560+k%4*80))%(H+40))-20;
      ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-6,ry+15);ctx.stroke();
    }
  }
  if(gr>0){                                          // golden wash + edge glow + motes
    ctx.fillStyle=`rgba(245,196,60,${.07*gr})`;
    ctx.fillRect(0,0,W,H);
    const v=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.34,W/2,H/2,Math.max(W,H)*.72);
    v.addColorStop(0,'rgba(245,215,126,0)');
    v.addColorStop(1,`rgba(214,150,30,${.34*gr})`);
    ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
    ctx.fillStyle=`rgba(255,240,180,${.85*gr})`;
    for(let i=0;i<14;i++){                           // drifting screen motes
      const mx=(i*197.3+game.t*26+Math.sin(i*7)*40)%(W+30)-15;
      const my=(i*127.9-game.t*(14+i%5*6))%(H+30);
      ctx.beginPath();
      ctx.arc(mx,my<0?my+H+30:my,1.4+(i%3),0,Math.PI*2);ctx.fill();
    }
  }
  if(cop&&cop.hold){                               // barrage: red/blue edge wash
    const bl=Math.floor(game.t*5)%2===0;
    const gl2=ctx.createLinearGradient(0,0,W*.24,0);
    gl2.addColorStop(0,bl?'rgba(217,88,76,.22)':'rgba(63,122,203,.22)');
    gl2.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=gl2;ctx.fillRect(0,0,W*.24,H);
    const gr2=ctx.createLinearGradient(W,0,W-W*.24,0);
    gr2.addColorStop(0,bl?'rgba(63,122,203,.22)':'rgba(217,88,76,.22)');
    gr2.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=gr2;ctx.fillRect(W-W*.24,0,W*.24,H);
  }
  drawGlint();
  if(state===S.OVER&&deathFX){                     // the light goes out with him
    const k=clamp(1-overDelay/1.5,0,1);
    const v2=ctx.createRadialGradient(deathFX.x,deathFX.y-30,60,
                                      deathFX.x,deathFX.y-30,Math.max(W,H)*.9);
    v2.addColorStop(0,'rgba(20,8,8,0)');
    v2.addColorStop(1,`rgba(20,8,8,${.5*k})`);
    ctx.fillStyle=v2;ctx.fillRect(0,0,W,H);
  }
  if(state===S.READY)drawReadyHint();
  if(state===S.PLAY||state===S.READY)drawGauge();
  if(state===S.PLAY)drawHudMotes();
  if(game.flash>0){ctx.fillStyle=`rgba(196,69,59,${game.flash*.3})`;ctx.fillRect(0,0,W,H);}
  if(state===S.PLAY&&game.hydration<28){                 // low-water vignette
    const v=ctx.createRadialGradient(W/2,H/2,H*.42,W/2,H/2,H*.85);
    v.addColorStop(0,'rgba(196,69,59,0)');
    v.addColorStop(1,`rgba(196,69,59,${.2+.1*Math.sin(game.t*5)})`);
    ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
  }
}

// ---------------------------------------------------------------- UI
const el=id=>document.getElementById(id);
const screenEl=el('screen'),hud=el('hud'),banner=el('banner'),readyEl=el('ready');
const nameInput=el('nameInput');
const panels={menu:el('panelMenu'),help:el('panelHelp'),scores:el('panelScores'),
  settings:el('panelSettings'),over:el('panelOver'),pause:el('panelPause')};
const A=window.anime;

function showPanel(which){
  screenEl.hidden=which===null;
  for(const k in panels)panels[k].hidden=k!==which;
  if(which&&A){
    const sel=`#panel${which[0].toUpperCase()+which.slice(1)} .panel-anim`;
    A.remove(sel);
    A({targets:sel,translateY:[24,0],opacity:[0,1],
       delay:A.stagger(60),easing:'spring(1, 84, 13, 0)',duration:700});
  }
}

let bannerTl=null;
function showBanner(name){
  banner.textContent=name;banner.hidden=false;
  if(A){
    if(bannerTl)bannerTl.pause();
    bannerTl=A.timeline({easing:'easeOutExpo'})
      .add({targets:banner,opacity:[0,1],translateY:[-22,0],
            letterSpacing:['0.6em','0.18em'],duration:620})
      .add({targets:banner,opacity:0,duration:520,delay:1500,
            complete:()=>{banner.hidden=true;}});
  }else setTimeout(()=>{banner.hidden=true;},2200);
}
function popCounter(){
  if(!A)return;
  A.remove('#bottles');
  A({targets:'#bottles',scale:[1.42,1],easing:'spring(1, 90, 10, 0)',duration:520});
}
// Writing textContent every frame invalidates style even when the number hasn't
// changed — cheap at 60 Hz, not free at 120. Only write on a change.
const _hudLast={};
function setTxt(id,v){
  if(_hudLast[id]===v)return;
  _hudLast[id]=v;
  const e2=el(id);if(e2)e2.textContent=v;
}
function syncHUD(){
  syncLives();
  setTxt('bottles',game.bottles);
  setTxt('score',Math.floor(game.score));
  setTxt('metres',Math.floor(game.dist/10));
}
function applyLang(l){
  if(!LANGS.includes(l))l='tn';
  lang=l;store.set('ateshane.lang',l);
  const D=I18N[l];
  try{document.documentElement.lang=l==='tn'?'ar':l;}catch{}
  document.body.classList.toggle('ltr',D.dir==='ltr');
  const set=(id,v)=>{const e2=el(id);if(e2)e2.textContent=v;};
  const setH=(id,v)=>{const e2=el(id);if(e2)e2.innerHTML=v;};
  set('tagline',D.tag);
  const ni=el('nameInput');if(ni){ni.placeholder=D.namePh;ni.dir=D.dir;}
  set('nameHint',D.nameHint);
  set('playAr',D.play);set('playLat',D.playLat);
  set('helpAr',D.help);set('helpLat',D.helpLat);
  set('scoresAr',D.scores);set('scoresLat',D.scoresLat);
  set('setAr',D.settings);set('setLat',D.settingsLat);
  set('bestLbl',D.best);
  set('helpTitle',D.helpTitle);
  setH('h1',D.h1);setH('h2',D.h2);setH('h3',D.h3);setH('h4',D.h4);setH('h5',D.h5);
  set('goAr',D.go);set('goLat',D.goLat);
  set('scoresTitle',D.scoresTitle);set('backScores',D.back);
  set('setTitle',D.setTitle);set('sndLbl',D.sound);set('stepLbl',D.steps);
  set('volLbl',D.vol);set('langLbl',D.lang);
  set('wipeLbl',D.wipe);set('backSet',D.back);
  set('pauseEyebrow',D.pauseEyebrow);set('pauseUnit',D.pauseBody);
  set('resumeAr',D.resume);set('resumeLat',D.resumeLat);
  set('pauseRetryLbl',D.retryFull);set('pauseMenuLbl',D.menuBtn);
  set('retryAr',D.retry);set('retryLat',D.retryLat);set('overMenuLbl',D.menuBtn);
  set('readyTitle',D.readyTitle);
  set('installText',isIOS?D.installIOS:D.install);
  set('btnInstall',D.installBtn);
  set('bottlesUnit',D.bottlesU);set('metresUnit',' '+D.m);set('ptsLbl',D.pts);
  for(const l2 of LANGS){
    const b=el('lang_'+l2);
    if(b)b.setAttribute('aria-pressed',String(l2===l));
  }
  syncMute(Audio2.muted);
  el('menuBest').textContent=bestScore();
  renderScores();
}
function syncMute(m){ el('muteBtn').textContent=m?'\ud83d\udd07':'\ud83d\udd0a';
  el('tglSound').setAttribute('aria-pressed',String(!m));
  el('tglSound').textContent=m?t('off'):t('on'); }

// ---- score list ----
const fmtN=(n)=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'\u202F');

// One row: rank, then name over distance, then score over its unit. The two
// numbers used to sit side by side with nothing saying which was which.
function boardLi(e,isMe){
  const li=document.createElement('li');
  if(isMe)li.classList.add('me');
  li.innerHTML='<span class="rk"></span>'+
    '<span class="who"><b class="nm"></b><i class="ds"></i></span>'+
    '<span class="sc"><b></b><i></i></span>';
  li.querySelector('.rk').textContent=e.rank;
  li.querySelector('.nm').textContent=e.n||'?';
  li.querySelector('.ds').textContent=e.m!=null?fmtN(e.m)+' '+t('m'):'';
  li.querySelector('.sc b').textContent=fmtN(e.s);
  li.querySelector('.sc i').textContent=t('pts');
  return li;
}

function podCard(e,place,isMe){
  const d=document.createElement('div');
  d.className='pod pod'+place+(isMe?' me':'');
  d.innerHTML='<span class="medal"></span><b class="nm"></b>'+
    '<span class="sc"></span><i class="ds"></i>';
  d.querySelector('.medal').textContent=place;
  d.querySelector('.nm').textContent=e.n||'?';
  d.querySelector('.sc').textContent=fmtN(e.s);
  d.querySelector('.ds').textContent=e.m!=null?fmtN(e.m)+' '+t('m'):'';
  return d;
}

function renderScores(highlight=-1){
  const list=el('scoreList');if(!list)return;
  const pod=el('podium'),meRow=el('meRow'),note=el('boardNote');
  list.innerHTML='';
  if(pod){pod.innerHTML='';pod.hidden=true;}
  if(meRow){meRow.innerHTML='';meRow.hidden=true;}

  const tabs=[['tabWeek','week','wkTab'],['tabAll','all','allTab'],['tabLocal','local','mine']];
  for(const [id,sc,key] of tabs){
    const b=el(id);if(!b)continue;
    b.textContent=t(key);
    b.setAttribute('aria-pressed',String(BOARD.scope===sc));
  }

  const online=BOARD.scope!=='local';
  if(online&&BOARD.state==='loading'){
    const li=document.createElement('li');
    li.className='empty';li.textContent='…';
    list.appendChild(li);
    if(note)note.hidden=true;
    return;
  }

  const uid=online?myUid():null;
  let rows,mine=highlight,myRow=null;
  if(online&&BOARD.state==='ok'&&BOARD.rows){
    rows=BOARD.rows;mine=-1;myRow=BOARD.me;
    if(note)note.hidden=true;
  }else{
    rows=loadScores().map((e,i)=>({...e,rank:i+1}));
    if(note){
      note.hidden=!(online&&BOARD.state==='off');
      note.textContent=t('boardOff');
    }
  }

  if(!rows.length){
    const li=document.createElement('li');
    li.className='empty';li.textContent=t('empty');
    list.appendChild(li);return;
  }

  const isMine=(e,i)=>online?(uid&&e.u===uid):(i===mine);

  // Top three get the podium, the rest a list. Below ten the board stops and
  // your own row is pinned instead, so rank 400 still sees where they stand.
  if(online&&pod&&rows.length>=3){
    pod.hidden=false;
    [rows[1],rows[0],rows[2]].forEach((e,k)=>{
      const place=[2,1,3][k];
      pod.appendChild(podCard(e,place,isMine(e,place-1)));
    });
    rows.slice(3).forEach((e,i)=>list.appendChild(boardLi(e,isMine(e,i+3))));
  }else{
    rows.forEach((e,i)=>list.appendChild(boardLi(e,isMine(e,i))));
  }

  if(online&&myRow&&meRow){
    meRow.hidden=false;
    meRow.className='merow panel-anim'+(myRow.top?' intop':'');
    meRow.innerHTML='<span class="rk"></span><span class="who"></span><span class="sc"></span>';
    meRow.querySelector('.rk').textContent='#'+myRow.rank;
    meRow.querySelector('.who').textContent=
      (myRow.n||t('youAre'))+' · '+t('youAre');
    meRow.querySelector('.sc').textContent=fmtN(myRow.s)+' '+t('pts');
    if(BOARD.total>0)meRow.title=t('ofN')(myRow.rank,BOARD.total);
  }
}

// ---- flow ----
function pauseGame(){
  if(state!==S.PLAY)return;
  state=S.PAUSE;
  Audio2.setMusicMode('pause');Audio2.stopWind();Audio2.pantStop();
  Audio2.dripStop();Audio2.rainStop();
  Audio2.stopSample('gold',0.15);
  el('pauseBtn').hidden=true;
  el('pauseScore').textContent=Math.floor(game.score);
  el('pauseM').textContent=Math.floor(game.dist/10);
  showPanel('pause');
}
function resumeGame(){
  if(state!==S.PAUSE)return;
  showPanel(null);
  el('pauseBtn').hidden=false;
  Audio2.setMusicMode('play');Audio2.startMusic();Audio2.startWind();
  if(game.wasLow||chamsChase())Audio2.pantStart();
  if(game.gold>0)Audio2.goldGet(game.gold+0.45);
  const evR=evOn();
  if(evR==='coupure')Audio2.dripStart();
  if(evR==='pluie')Audio2.rainStart();
  // back from the background you haven't read the screen yet: wipe the corridor
  // in front and hand him a blink of mercy.
  clearAhead(player.x+340);
  game.invuln=Math.max(game.invuln,1.1);
  state=S.PLAY;
}
function toMenu(){
  state=S.MENU;resetRun();
  showInstallBar();
  Audio2.setMusicMode('menu');Audio2.startMusic();
  Audio2.stopWind();Audio2.pantStop();
  Audio2.stopSample('gold',0.15);
  hud.hidden=true;readyEl.hidden=true;el('pauseBtn').hidden=true;
  el('menuBest').textContent=bestScore();
  showPanel('menu');
}
function requireName(){
  const nm=nameInput.value.trim();
  if(nm)return true;
  const hint=el('nameHint');
  if(hint)hint.hidden=false;
  nameInput.classList.remove('err');void nameInput.offsetWidth;   // restart shake
  nameInput.classList.add('err');
  nameInput.focus();
  Audio2.warn();
  return false;
}
function toReady(){
  Audio2.resume();Audio2.stopSample('death');Audio2.stopSample('gold',0.1);
  Audio2.setMusicMode('menu');Audio2.startWind();Audio2.startMusic();
  const nm=nameInput.value.trim();
  store.set('ateshane.name',nm);
  const best=bestScore();
  el('readyName').textContent=(nm?I18N[lang].readyRun(nm):'')+
    (best>0?`  \u00b7  ${t('readyBest')}${best}`:'');
  resize();resetRun();
  state=S.READY;hideInstallBar();
  showPanel(null);hud.hidden=false;readyEl.hidden=false;
  el('pauseBtn').hidden=false;syncHUD();
}
function launch(){
  state=S.PLAY;readyEl.hidden=true;
  Audio2.setMusicMode('play');                 // le passe-bas s'ouvre : on court
  Audio2.jump();
}
/* now localized via I18N — kept for reference
const THIRST_LINES=['\u0627\u0644\u0639\u0637\u0634 \u063a\u0644\u0628\u0643 \ud83d\ude2e\u200d\ud83d\udca8','\u0627\u0644\u0642\u0631\u0628\u0629 \u0641\u0631\u063a\u062a\u2026','\u062d\u062a\u0649 \u0642\u0637\u0631\u0629 \u0645\u0627 \u0628\u0642\u0627\u062a'];
const BURN_LINES=['\u0627\u0644\u0634\u0645\u0633 \u0643\u0644\u0627\u062a\u0643 \u2600\ufe0f','\u0642\u0644\u062a\u0644\u0643 \u0627\u0644\u0628\u0633 \u0643\u0633\u0643\u0651\u0629\u2026','\u0634\u0648\u064a\u062a\u0646\u064a\u2026 \u2600\ufe0f'];
const CRASH_LINES=['\u062f\u0642\u0651\u064a\u062a\u0647\u0627\u2026 \ud83c\udf35','\u0634\u0641\u062a\u0647\u0627 \u0648\u0645\u0627 \u0646\u0642\u0651\u0632\u062a\u0634 \u061f!','\u0627\u0644\u062d\u064a\u0637 \u0645\u0627 \u064a\u062a\u0646\u062d\u0651\u0627\u0634 \u064a\u0627 \u0628\u0637\u0644'];
*/
const pickLine=a=>a[(Math.random()*a.length)|0];
function endBoon(){
  if(!game.boon)return;
  if(game.boon==='chta'&&evOn()!=='pluie')Audio2.rainStop();
  if(game.boon==='rih')Audio2.musicRate(1);
  game.boon='';
}
function gameOver(cause='thirst'){
  endBoon();
  if(game.event){ eventExit(game.event.type); game.event=null; }
  truck=null;sunA=null;scorch=[];cop=null;
  state=S.OVER;
  Audio2.death();Audio2.stopSample('gold',0.15);
  Audio2.stopWind();Audio2.duckMusic(false);Audio2.setMusicMode('over');
  Audio2.pantStop();
  el('goldPop').hidden=true;el('pauseBtn').hidden=true;
  setMood('hurt',9);
  const sc=Math.floor(game.score),m=Math.floor(game.dist/10);
  const nm=nameInput.value.trim()||store.get('ateshane.name','')||'Anonyme';
  const rank=saveScore(nm,sc,m);
  store.set('ateshane.best',String(bestScore()));
  if(nm)try{ Promise.resolve(submitScore(nm,sc,m,game.bottles)).catch(()=>{}); }
        catch{}                              // fire-and-forget, 6 s ceiling
  pendingOver={sc,rank,
    line:pickLine(I18N[lang][cause==='burn'?'burn':cause==='crash'?'crash':'thirst']),
    sum:I18N[lang].sumOf(regionMix().name,m,game.bottles),
    rankTxt:rank===0?t('rank1'):rank>0?I18N[lang].rankN(rank+1):''};
  startDeathCine(cause);                    // hit-stop -> slow-mo tumble -> panel
}

// ---- wiring ----
const click=(id,fn)=>el(id).addEventListener('click',()=>{Audio2.resume();Audio2.button();fn();});
const HELP_KEY='ateshane.seenHelp';
function playPressed(){
  if(!requireName())return;
  if(store.get(HELP_KEY,'')!=='1'){ showPanel('help'); return; }
  toReady();
}
click('btnPlay',playPressed);
click('btnHelp',()=>showPanel('help'));
click('btnHelpGo',()=>{
  store.set(HELP_KEY,'1');
  if(requireName())toReady(); else showPanel('menu');
});
click('btnRetry',toReady);
click('btnMenu',toMenu);
click('btnScores',()=>{renderScores();showPanel('scores');fetchBoard(false);});
click('btnScoresBack',()=>showPanel('menu'));
click('btnSettings',()=>showPanel('settings'));
click('btnSetBack',()=>showPanel('menu'));
click('btnWipe',()=>{store.set(SCORES_KEY,'[]');renderScores();showPanel('scores');});
el('tglSound').addEventListener('click',()=>syncMute(Audio2.toggleMute()));
for(const l2 of LANGS)
  el('lang_'+l2).addEventListener('click',()=>{Audio2.button();applyLang(l2);});
el('tabWeek').addEventListener('click',()=>{
  Audio2.button();BOARD.scope='week';renderScores();fetchBoard(false);});
el('tabAll').addEventListener('click',()=>{
  Audio2.button();BOARD.scope='all';renderScores();fetchBoard(false);});
el('tabLocal').addEventListener('click',()=>{
  Audio2.button();BOARD.scope='local';renderScores();});
el('tglSteps').addEventListener('click',e=>{
  const on=e.currentTarget.getAttribute('aria-pressed')!=='true';
  e.currentTarget.setAttribute('aria-pressed',String(on));
  e.currentTarget.textContent=on?t('on'):t('off');
  Audio2.setSteps(on);
});
el('volRange').addEventListener('input',e=>Audio2.setVolume(e.target.value/100));
el('muteBtn').addEventListener('click',()=>syncMute(Audio2.toggleMute()));
el('pauseBtn').addEventListener('click',()=>{Audio2.button();pauseGame();});
click('btnResume',resumeGame);
click('btnPauseRetry',toReady);
click('btnPauseMenu',toMenu);
document.addEventListener('visibilitychange',()=>{
  if(document.hidden&&state===S.PLAY)pauseGame();
});
// some Android browsers never fire visibilitychange for the notification shade
window.addEventListener('blur',()=>{ if(state===S.PLAY)pauseGame(); });

let deferred=null;
const INSTALL_KEY='ateshane.installDismiss';
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent||'');
const standalone=(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)
  ||window.navigator.standalone===true;
function showInstallBar(){
  if(standalone||store.get(INSTALL_KEY,'')==='1')return;
  const bar=el('installBar');if(!bar)return;
  if(isIOS){
    el('installText').textContent=t('installIOS');
    el('btnInstall').hidden=true;
  }else if(!deferred)return;                      // Android/desktop: wait for the event
  bar.hidden=false;
  if(A)A({targets:'#installBar',translateY:[-56,0],opacity:[0,1],
          easing:'spring(1, 90, 14, 0)',duration:650});
}
function hideInstallBar(){const b=el('installBar');if(b)b.hidden=true;}
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();deferred=e;
  if(state===S.MENU)showInstallBar();
});
el('btnInstall').addEventListener('click',async()=>{
  Audio2.button();
  if(!deferred)return;
  deferred.prompt();
  const c=await deferred.userChoice;
  deferred=null;hideInstallBar();
  if(c&&c.outcome==='accepted')store.set(INSTALL_KEY,'1');
});
el('btnInstallClose').addEventListener('click',()=>{
  store.set(INSTALL_KEY,'1');hideInstallBar();
});

// ---------------------------------------------------------------- loop
// Beat clock. <audio>.currentTime only advances in chunks, so polling it every
// frame gives a staircase — tolerable at 60 Hz, visible judder at 120. Integrate
// our own phase at the track's rate and nudge it toward the audio only when the
// element publishes a fresh reading. Lives in the frame loop, not update(), so it
// keeps time through pauses, deaths and hit-stop — the music never stops either.
function stepBeat(raw){
  const br0=Audio2.beatRate?Audio2.beatRate():0;
  const br=(typeof br0==='number'&&br0>0)?br0:126.25/60;
  const bp0=Audio2.beatPhase?Audio2.beatPhase():-1;
  const bp=(typeof bp0==='number'&&isFinite(bp0))?bp0:-1;
  beatPh=(beatPh+raw*br)%1;
  if(bp>=0){
    if(bp!==beatRaw){
      beatRaw=bp;
      let err=bp-beatPh;
      if(err>.5)err-=1;else if(err<-.5)err+=1;
      if(Math.abs(err)>.35)beatPh=bp;            // seek / restart: hard lock
      else beatPh=(beatPh+err*.25+1)%1;          // otherwise pull a quarter of it
    }
    if(state===S.PLAY&&lastBeat>=0&&beatPh<lastBeat&&!game.gold){
      gaugePulse=Math.max(gaugePulse,.4);
      const cc=el('combo');
      if(game.combo>=2&&cc&&!cc.hidden){
        cc.classList.add('beat');
        setTimeout(()=>cc.classList.remove('beat'),130);
      }
    }
    lastBeat=beatPh;
  }else lastBeat=-1;
}
let last=0;
function frame(ts){
  const raw=Math.max(0,Math.min((ts-last)/1000||0,.05));  // never negative
  last=ts;
  rawDt=raw;
  stepBeat(raw);
  let dt=raw;
  if(game.freeze>0){game.freeze-=raw;dt=0;}
  else if(game.slow>0){game.slow-=raw;dt=raw*.35;}
  try{                                   // one bad DOM write must never kill the loop
    update(dt);render();
    if(state===S.PLAY)syncHUD();
  }catch(err){ console.error('frame error',err); }
  requestAnimationFrame(frame);
}

resize();
applyLang(store.get('ateshane.lang','tn'));
const firstTouch=()=>{Audio2.resume();Audio2.startMusic();
  document.removeEventListener('pointerdown',firstTouch);};
document.addEventListener('pointerdown',firstTouch);
nameInput.value=store.get('ateshane.name','');
nameInput.addEventListener('input',()=>{
  nameInput.classList.remove('err');
  const h=el('nameHint');if(h)h.hidden=true;
});
Audio2.loadSample('death','assets/audio/ta3fita.mp3');
Audio2.loadSample('gold','assets/audio/3otchana.mp3');
loadAssets().then(()=>{
  toMenu();
  if(isIOS)setTimeout(showInstallBar,900);
  requestAnimationFrame(ts=>{last=ts;frame(ts);});
});
try{console.log('Ateshane build',BUILD);
  const bt=document.getElementById('buildTag');if(bt)bt.textContent=BUILD;}catch{}
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
  // when a new version takes control, reload once so nobody plays a stale build again
  let reloaded=false;
  navigator.serviceWorker.addEventListener&&navigator.serviceWorker.addEventListener(
    'controllerchange',()=>{ if(reloaded)return; reloaded=true; location.reload(); });
}
})();
