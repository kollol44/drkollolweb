/* =====================================================================
   Shared script for inner pages: navbar (with Conditions & Treatments dropdown), footer, mobile bar,
   EN/BN switch (same localStorage key as homepage), scroll reveal, giant-word fit + upward drift.
   Each page sets <body data-root="../"> and defines window.renderPage(lang).
   All strings below are admin-editable content in the final build.
   ===================================================================== */
(function(){
const D=window.KOLLOL_DATA,ROOT=document.body.dataset.root||'';
const UI={
 en:{brand:'Dr. Kollol',home:'Home',about:'About the Doctor',ct:'Conditions & Treatments',all:'All conditions & treatments',blogs:'Blogs',contact:'Contact',
  book:'Book a serial',call:'Call now',wa:'WhatsApp',more:'Learn more',lap:'Laparoscopic',
  ctaH:'Don\'t wait. Talk to your surgeon.',ctaS:'Call for a serial or come to the chamber — Dr. Kollol will explain your problem and the right treatment.',
  ch1t:'Sherpur · Thursday',ch1:'Asia Diagnostic Center, Zila Hospital Road, Narayanpur · 3 PM – 9 PM',
  ch2t:'Sherpur · Friday',ch2:'Amjad Diagnostic Center, Zila Hospital Road, Narayanpur · 11 AM – 9 PM',
  ch3t:'Mymensingh · Sat – Tue',ch3:'New Medicare Pathology Lab, 204 Charpara (opp. Hospital Gate 1, 5th floor) · 3:30 PM – 8 PM',
  fAbout:'General, Laparoscopic, Breast & Colorectal Surgeon. Assistant Professor of Surgery, Mymensingh Medical College Hospital.',
  fLinks:'Pages',fContact:'Contact',fSerial:'Serial',fCopy:'© Dr. Fahim Foysal Kollol · BMDC Reg. A-61041 · Information on this site is not a substitute for a consultation.'},
 bn:{brand:'ডাঃ কল্লোল',home:'হোম',about:'ডাক্তার সম্পর্কে',ct:'রোগ ও চিকিৎসা',all:'সব রোগ ও চিকিৎসা',blogs:'ব্লগ',contact:'যোগাযোগ',
  book:'সিরিয়াল নিন',call:'কল করুন',wa:'হোয়াটসঅ্যাপ',more:'বিস্তারিত',lap:'ল্যাপারোস্কপিক',
  ctaH:'দেরি করবেন না। সার্জনের সাথে কথা বলুন।',ctaS:'সিরিয়ালের জন্য কল করুন বা চেম্বারে আসুন — ডাঃ কল্লোল আপনার সমস্যা ও সঠিক চিকিৎসা বুঝিয়ে বলবেন।',
  ch1t:'শেরপুর · বৃহস্পতিবার',ch1:'এশিয়া ডায়াগনস্টিক সেন্টার, জেলা হাসপাতাল রোড, নারায়ণপুর · দুপুর ৩টা – রাত ৯টা',
  ch2t:'শেরপুর · শুক্রবার',ch2:'আমজাদ ডায়াগনস্টিক সেন্টার, জেলা হাসপাতাল রোড, নারায়ণপুর · সকাল ১১টা – রাত ৯টা',
  ch3t:'ময়মনসিংহ · শনি – মঙ্গল',ch3:'নিউ মেডিকেয়ার প্যাথলজি ল্যাব, ২০৪ চরপাড়া (১নং হাসপাতাল গেটের বিপরীতে, ৫ম তলা) · বিকাল ৩:৩০টা – রাত ৮টা',
  fAbout:'জেনারেল, ল্যাপারোস্কপিক, ব্রেস্ট ও কলোরেক্টাল সার্জন। সহকারী অধ্যাপক (সার্জারি), ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল।',
  fLinks:'পেজ',fContact:'যোগাযোগ',fSerial:'সিরিয়াল',fCopy:'© ডাঃ ফাহিম ফয়সাল কল্লোল · বিএমডিসি রেজি: এ-৬১০৪১ · এই সাইটের তথ্য ডাক্তার দেখানোর বিকল্প নয়।'}};
const PHONE='01670879100',SERIAL='01750529252',WA='https://wa.me/8801670879100';
let L='en';try{L=localStorage.getItem('kollol-lang')||'en'}catch(e){}

/* ---------- helpers exposed to pages ---------- */
const K=window.K={D,ROOT,UI,PHONE,SERIAL,WA,get lang(){return L},
 t:k=>UI[L][k],
 cat:s=>D.categories.find(c=>c.slug===s),
 cond:s=>D.conditions.find(c=>c.slug===s),
 list:cat=>D.conditions.filter(c=>!c.hidden&&(!cat||c.cat===cat)),
 condUrl:s=>`${ROOT}conditions/condition.html?c=${s}`,
 catUrl:s=>`${ROOT}conditions/category.html?cat=${s}`,
 hubUrl:()=>`${ROOT}conditions/index.html`,
 esc:s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
 /* background-free condition image (img/conditions/<slug>.webp); admin-uploadable in the final build */
 condImg:c=>`${ROOT}img/conditions/${c.slug}.webp?v=2`,
 card(c){const x=c[L],cat=K.cat(c.cat)[L].name;
  return `<a class="ccard rv" href="${K.condUrl(c.slug)}"><img class="cimg" src="${K.condImg(c)}" alt="" loading="lazy"><span class="cat">${cat}</span><b>${x.name}</b>${x.med&&x.med!==x.name?`<span class="med">${x.med}</span>`:''}<p>${x.short}</p>
   <span class="foot">${c.lap?`<span class="badge lap">${UI[L].lap}</span>`:'<span></span>'}<span class="more">${UI[L].more}</span></span></a>`},
 ctaBand(o={}){const u=UI[L],doc=o.doc;return `<section class="ctaband rv${doc?' has-doc':''}" id="book">${doc?`<div class="cta-stick"><img class="cta-doc" src="${ROOT}img/doctor-cta.webp" alt="Dr. Fahim Foysal Kollol" width="649" height="1081" loading="lazy"></div>`:''}<div class="wrap">${doc?`<div class="cta-big">${u.brand}</div>`:''}<div class="${doc?'glass cta-card':''}"><span class="incision"></span>
  <h2 class="h2">${u.ctaH}</h2><p class="sub">${u.ctaS}</p>
  <div class="row"><a class="btn btn-p" href="tel:${SERIAL}">${u.book}</a><a class="btn btn-g" href="tel:${PHONE}">${u.call}</a><a class="btn btn-g" href="${WA}" target="_blank" rel="noopener">${u.wa}</a></div></div>
  <div class="chambers">${[1,2,3].map(i=>`<div class="glass"><small>${u['ch'+i+'t']}</small><b>${u['ch'+i].split(/[,،]/)[0]}</b><p>${u['ch'+i].split(/[,،]/).slice(1).join(',').trim()}</p></div>`).join('')}</div></div></section>`},
 /* scale a one-line giant word so it never overflows (max share of viewport width) */
 fit(el,ratio){if(!el)return;el.style.fontSize='';const base=parseFloat(getComputedStyle(el).fontSize),max=innerWidth*ratio;if(el.scrollWidth>max)el.style.fontSize=Math.floor(base*max/el.scrollWidth)+'px'}};

/* ---------- MOCK IMAGE (placeholder until real condition photos/illustrations are uploaded in the admin) ---------- */
K.mockImg=(label,seed=0)=>{const h=[176,184,170,190,180][seed%5],t=String(label).replace(/[<&>]/g,'');
 const svg=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h},55%,92%)'/><stop offset='1' stop-color='hsl(${h},48%,72%)'/></linearGradient></defs>
 <rect width='800' height='500' fill='url(#g)'/><circle cx='640' cy='110' r='170' fill='rgba(255,255,255,.28)'/><circle cx='130' cy='430' r='120' fill='rgba(11,110,115,.12)'/>
 <g fill='none' stroke='rgba(11,110,115,.55)' stroke-width='10' stroke-linecap='round'><path d='M330 250h140M400 180v140'/><rect x='300' y='150' width='200' height='200' rx='40'/></g>
 <text x='400' y='420' text-anchor='middle' font-family='Inter,Arial' font-size='34' font-weight='600' fill='rgba(6,47,49,.75)'>${t}</text>
 <text x='400' y='462' text-anchor='middle' font-family='Inter,Arial' font-size='20' fill='rgba(6,47,49,.5)'>MOCK IMAGE · replace from admin</text></svg>`;
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)};

/* ---------- PINNED SHOWCASE ----------
   K.showcase(sectionEl, steps, {chips:[{slug,name,href}]})
   step = {word, cat?, ey, title, body (html), img?{src,alt}, alert?} */
let SC=null;
K.showcase=(el,steps,opt={})=>{const doc=`${ROOT}img/doctor-gloves.webp`;
 el.classList.add('show');el.classList.toggle('hero-mode',!!opt.hero);el.classList.toggle('swap-mode',!!opt.swap);el.style.setProperty('--steps',steps.length);
 const img=s=>s.img?`<div class="sp-img"><img src="${s.img.src}" alt="${K.esc(s.img.alt||'')}" loading="lazy"></div>`:'';
 el.innerHTML=`<div class="show-pin">
  <div class="show-words">${steps.map(s=>`<div class="sw">${s.word}</div>`).join('')}</div>
  ${opt.hero?`<div class="show-hero"><img src="${opt.hero.src}" alt="${K.esc(opt.hero.alt||'')}"></div>`:`<div class="show-doc"><img src="${doc}" alt="Dr. Fahim Foysal Kollol" width="655" height="1069"></div>`}
  ${opt.swap?`<div class="show-gal">${steps.map(s=>s.img?`<div class="g"><img src="${s.img.src}" alt="${K.esc(s.img.alt||'')}"></div>`:'<div class="g"></div>').join('')}</div>`:''}
  <div class="show-top">${opt.crumb?`<div class="crumb">${opt.crumb}</div>`:''}${opt.chips?`<div class="show-chips">${opt.chips.map(c=>`<a href="${c.href}" data-cat="${c.slug}">${c.name}</a>`).join('')}</div>`:''}</div>
  <div class="show-panel">${steps.map(s=>`<div class="sp">${img(s)}<div class="sp-card ${s.alert?'alert':''} ${s.first?'first':''}">${img(s)}${s.ey?`<span class="ey">${s.ey}</span>`:''}<h3>${s.title}</h3>${s.body||''}</div></div>`).join('')}</div>
  ${opt.hero?`<div class="show-hint"><span>${L==='bn'?'নিচে স্ক্রল করুন':'Scroll down to learn more'}</span><b>↓</b></div>`:''}<div class="show-dots">${steps.map(()=>'<i></i>').join('')}</div></div>`;
 const words=[...el.querySelectorAll('.sw')],panes=[...el.querySelectorAll('.sp')],dots=[...el.querySelectorAll('.show-dots i')],chips=[...el.querySelectorAll('.show-chips a')];
 SC={el,steps,words,panes,dots,chips,hero:el.querySelector('.show-hero'),swap:!!opt.swap,docEl:el.querySelector('.show-doc'),gal:[...el.querySelectorAll('.show-gal .g')],hint:el.querySelector('.show-hint'),wbox:el.querySelector('.show-words'),pbox:el.querySelector('.show-panel'),pS:0,last:-1};fitShow();drawShow(true)};
/* each step rests ~60% of its scroll, then glides to the next (readable, never jumpy) */
const rest=x=>{const b=Math.floor(x),f=x-b,t=Math.min(1,Math.max(0,(f-.3)/.4));return b+t*t*(3-2*t)};
function drawShow(force){if(!SC)return;const r=SC.el.getBoundingClientRect(),q=Math.min(1,Math.max(0,-r.top/(SC.el.offsetHeight-innerHeight)));
 SC.pS+=(q-SC.pS)*.16;if(Math.abs(q-SC.pS)<.0003)SC.pS=q;if(!force&&SC.pS===SC.last)return;SC.last=SC.pS;
 const n=SC.steps.length,pos=rest(SC.pS*(n-1)),mob=innerWidth<860,step=innerHeight*(mob?.36:.6),cur=Math.round(pos);
 SC.words.forEach((w,i)=>{const o=i-pos,a=Math.abs(o);w.style.transform=`translate(${mob?'-50%':'0'},calc(-50% + ${o*step}px)) scale(${1-Math.min(a,1)*.1})`;w.style.opacity=Math.max(0,1-a*(SC.hero||SC.swap?1.8:.8))}); /* hero mode: neighbours fully hidden so no word peeks behind the card */
 SC.panes.forEach((p,i)=>{const o=i-pos,a=Math.abs(o),op=Math.max(0,1-a*2.2);p.style.transform=`translateY(${o*70}px)`;p.style.opacity=op;p.style.pointerEvents=op>.6?'auto':'none'});
 SC.dots.forEach((d,i)=>d.classList.toggle('on',i===cur));
 /* condition pages: no doctor; the condition image is absent on the title step, then grows in from the card side and stays pinned */
 /* category pages: doctor on the intro step; first scroll pushes him out to the left while the first condition image grows into his place; images cross-fade per step */
 if(SC.swap){const h=Math.min(1,Math.max(0,pos)),e=h*h*(3-2*h);
  SC.docEl.style.opacity=1-e;SC.docEl.style.transform=mob?`translateX(calc(-50% - ${e*70}vw))`:`translateX(${-e*45}vw)`;
  SC.gal.forEach((g,i)=>{if(!i)return;let op,sc;if(i===1&&pos<1){op=e;sc=.45+.55*e}else{op=Math.max(0,1-Math.abs(pos-i)*2);sc=.9+.1*op}g.style.opacity=op;g.style.transform=`scale(${sc})`})}
 if(SC.hero){const h=Math.min(1,Math.max(0,pos)),e=h*h*(3-2*h),k=1-e;SC.hero.style.opacity=e;
  if(mob){SC.hero.style.transform=`translate(-50%,${k*30}vh) scale(${.45+.55*e})`;SC.wbox.style.transform=SC.pbox.style.transform=''}
  else{/* laptop: title + first card start CENTRED; first scroll slides them right while the image comes in from the left */
   SC.hero.style.transform=`translateX(${-k*45}vw) scale(${.8+.2*e})`;
   SC.wbox.style.transform=`translateX(${-k*24}vw)`;const fc=SC.panes[0].querySelector('.sp-card'),cx=SC.pbox.offsetLeft+fc.offsetLeft+fc.offsetWidth/2;SC.pbox.style.transform=`translateX(${k*(innerWidth/2-cx)}px)`}
  if(SC.hint)SC.hint.style.opacity=Math.max(0,1-pos*4)}
 const cat=SC.steps[cur]&&SC.steps[cur].cat;SC.chips.forEach(c=>{const on=c.dataset.cat===cat;if(on&&!c.classList.contains('on')&&mob){const box=c.parentElement;box.scrollTo({left:c.offsetLeft-box.clientWidth/2+c.offsetWidth/2,behavior:'smooth'})}c.classList.toggle('on',on)})}
function fitShow(){if(!SC)return;
 if(SC.swap){const mob=innerWidth<860;SC.words.forEach((w,i)=>{w.style.removeProperty('--fs');const base=parseFloat(getComputedStyle(w).fontSize),
   target=mob?document.documentElement.clientWidth*.92:SC.panes[i].querySelector('.sp-card').offsetWidth,cap=mob?96:innerHeight*(i?.26:.32);let fs=Math.min(cap,base*target*.965/w.scrollWidth);w.style.setProperty('--fs',fs+'px');fs=Math.min(cap,fs*target*.965/w.scrollWidth);w.style.setProperty('--fs',fs.toFixed(1)+'px') /* .965: glyph overhang of the display face */});return}
const hm=!!SC.hero,max=innerWidth*(innerWidth<860?.94:hm?.44:.72); /* laptop: word runs from 24vw to 96vw (hero mode: right column 52–96vw) */SC.words.forEach(w=>{w.style.removeProperty('--fs');if(innerWidth<860&&!hm)return;
 const base=parseFloat(getComputedStyle(w).fontSize);if(w.scrollWidth>max)w.style.setProperty('--fs',Math.floor(base*max/w.scrollWidth)+'px')})}
/* ---------- STACKING SECTIONS (category + condition pages, below the showcase) ----------
   K.stack([el,...]) → every section except the last sticks when its END reaches the viewport (tall sections stick at
   their bottom, so nothing is covered unread); the next one slides up over it with an aqua glow edge, and the covered
   one eases back (smaller + fainter). The last one is normal flow so the footer never slides under a sticky layer. */
let STK=[];
K.stack=els=>{STK=els.filter(Boolean);STK.forEach((el,i)=>{el.classList.add('stk');el.classList.toggle('stk-up',i>0);el.style.zIndex=10+i})};
function drawStack(){const H=innerHeight;STK.forEach((el,i)=>{const nx=STK[i+1];
 if(!nx){el.style.position='';el.style.transform='';el.style.opacity='';return}
 el.style.position='sticky';el.style.top=Math.min(0,H-el.offsetHeight)+'px';
 const p=Math.min(1,Math.max(0,1-nx.getBoundingClientRect().top/H));
 el.style.transform=p?`scale(${1-.06*p})`:'';el.style.opacity=p?1-.45*p:''})}
(function loop(){drawShow();drawStack();requestAnimationFrame(loop)})();
addEventListener('resize',()=>{fitShow();drawShow(true)});
K.fitShow=fitShow;

/* ---------- chrome: nav, sheet, footer, mobile bar ---------- */
function chrome(){const u=UI[L],cats=D.categories.map(c=>`<a href="${K.catUrl(c.slug)}">${c[L].name}</a>`).join('');
 const page=document.body.dataset.page||'';
 document.getElementById('nav').innerHTML=`<a class="brand" href="${ROOT}index.html"><i>K</i><span>${u.brand}</span></a>
  <nav class="links"><a href="${ROOT}index.html">${u.home}</a><a href="${ROOT}index.html#doctor">${u.about}</a>
   <div class="dd ${page==='ct'?'on':''}"><button type="button">${u.ct}</button><div class="dd-menu"><a class="all" href="${K.hubUrl()}">${u.all}</a>${cats}</div></div>
   <a href="#">${u.blogs}</a><a href="#book">${u.contact}</a></nav>
  <div class="right"><div class="lang"><button data-l="en" class="${L==='en'?'on':''}">EN</button><button data-l="bn" class="${L==='bn'?'on':''}">বাং</button></div>
   <a class="btn btn-p" href="tel:${SERIAL}">${u.book}</a><button class="burger" aria-label="Menu"><span></span></button></div>`;
 document.getElementById('sheet').innerHTML=`<a href="${ROOT}index.html">${u.home}</a><a href="${ROOT}index.html#doctor">${u.about}</a><a href="${K.hubUrl()}">${u.ct}</a>
  ${D.categories.map(c=>`<a class="sub" href="${K.catUrl(c.slug)}">${c[L].name}</a>`).join('')}<a href="#">${u.blogs}</a><a href="#book">${u.contact}</a>
  <a href="tel:${SERIAL}" class="btn btn-p" style="margin-top:6px">${u.book}</a>`;
 document.getElementById('foot').innerHTML=`<div class="wrap"><div class="grid">
  <div><h4>${L==='bn'?'ডাঃ ফাহিম ফয়সাল কল্লোল':'Dr. Fahim Foysal Kollol'}</h4><p>${u.fAbout}</p></div>
  <div><h4>${u.fLinks}</h4><a href="${ROOT}index.html">${u.home}</a><a href="${K.hubUrl()}">${u.ct}</a><a href="#">${u.blogs}</a><a href="#book">${u.contact}</a></div>
  <div><h4>${u.fContact}</h4><a href="tel:${PHONE}">${u.call}: ${PHONE}</a><a href="tel:${SERIAL}">${u.fSerial}: ${SERIAL}</a><a href="${WA}" target="_blank" rel="noopener">${u.wa}</a></div>
  </div><div class="copy">${u.fCopy}</div></div>`;
 document.getElementById('mbar').innerHTML=`<a class="btn btn-g" href="tel:${PHONE}">${u.call}</a><a class="btn btn-g" href="${WA}" target="_blank" rel="noopener">${u.wa}</a><a class="btn btn-p" href="tel:${SERIAL}">${u.book}</a>`;
 document.querySelectorAll('.lang button').forEach(b=>b.onclick=()=>setLang(b.dataset.l));
 document.querySelector('.burger').onclick=()=>document.getElementById('sheet').classList.toggle('open');
 const dd=document.querySelector('.dd');dd.querySelector('button').onclick=()=>dd.classList.toggle('open');
 document.addEventListener('click',e=>{if(!dd.contains(e.target))dd.classList.remove('open')})}

/* ---------- reveal + drift ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');else if(e.boundingClientRect.top>0)e.target.classList.remove('in')}),{threshold:.12});
function observe(){document.querySelectorAll('.rv').forEach((el,i)=>{if(el.closest('.cards'))el.style.transitionDelay=([...el.parentNode.children].indexOf(el)%6)*.06+'s';io.observe(el)})}
/* giant words drift upward while the doctor stays — same motion language as the homepage */
function drift(){document.querySelectorAll('[data-drift]').forEach(el=>{const r=el.parentElement.getBoundingClientRect(),k=+el.dataset.drift||.35;
 el.style.translate=`0 ${Math.min(0,r.top)*k}px`})}
addEventListener('scroll',()=>requestAnimationFrame(drift),{passive:true});

function setLang(l){L=l;try{localStorage.setItem('kollol-lang',l)}catch(e){}document.documentElement.lang=l;document.body.classList.toggle('bn',l==='bn');
 chrome();if(window.renderPage)window.renderPage(l);observe();drift();(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>window.fitPage&&window.fitPage())}
K.setLang=setLang;
addEventListener('resize',()=>window.fitPage&&window.fitPage());
document.addEventListener('DOMContentLoaded',()=>setLang(L));
})();
