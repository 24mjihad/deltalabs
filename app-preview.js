const phone=document.querySelector('#phone-screen');
if(phone){
 const screens={home:['Your day starts here','Your sleep score and a picture of last night'],mindful:['Rest on purpose','A short nap or a quiet moment'],coach:['Coach','A place to talk about your sleep data'],wake:['Wake on your time','Your mask, alarm, and travel plans'],trends:['The longer view','Your sleep archetype and trends over time']};
 const order=['mindful','coach','home','wake','trends'];let selected='home';
 function show(name){if(!screens[name])return;selected=name;phone.querySelectorAll('.app-panel').forEach(panel=>panel.classList.toggle('active',panel.dataset.panel===name));document.querySelectorAll('[data-screen]').forEach(button=>{const active=button.dataset.screen===name;button.classList.toggle('active',active);button.setAttribute('aria-current',active?'page':'false')});document.querySelector('#app-section-title').textContent=screens[name][0];document.querySelector('#app-section-copy').textContent=screens[name][1];document.querySelector('#app-gallery-count').textContent=String(order.indexOf(name)+1).padStart(2,'0')+' / 05';phone.dataset.screen=name;phone.querySelector('.phone-content').scrollTop=0}
 document.querySelectorAll('[data-screen]').forEach(button=>button.addEventListener('click',()=>show(button.dataset.screen)));
 document.querySelector('[data-gallery-prev]').addEventListener('click',()=>show(order[(order.indexOf(selected)+order.length-1)%order.length]));
 document.querySelector('[data-gallery-next]').addEventListener('click',()=>show(order[(order.indexOf(selected)+1)%order.length]));
 const now=new Date(),hour=now.getHours();const phase=hour>=5&&hour<11?'morning':hour>=11&&hour<16?'day':hour>=16&&hour<20?'evening':'night';
 const scenic={morning:'app-alpine-dawn.webp',day:'app-alpine-day.webp',evening:'app-alpine-evening.webp',night:'app-alpine-night.webp'};
 phone.classList.remove('phase-morning');phone.classList.add('phase-'+phase);phone.style.setProperty('--app-scene',`url('assets/${scenic[phase]}')`);
 const greeting=hour>=5&&hour<12?'Good morning':hour>=12&&hour<17?'Good afternoon':'Good evening';document.querySelector('#greeting').textContent=`${greeting}, Alex`;
 const time=new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit'}).format(now);document.querySelector('#phone-time').textContent=time;document.querySelector('#internal-clock').textContent=time;
 const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],scores=[82,77,84,81,88,85,86],offset=(now.getDay()+6)%7;
 document.querySelector('.week-scores').innerHTML=Array.from({length:5},(_,i)=>{const d=(offset-4+i+7)%7;return `<span><small>${days[d]}</small><b>${scores[d]}</b></span>`}).join('');
 const facts=['Great frigatebirds have been recorded sleeping while flying over the ocean','Morning light helps anchor your body clock to the local day','In N2 sleep, EEG can show brief bursts called sleep spindles','Mallards at the edge of a group can keep one eye open while resting','Sleep pressure builds during wakefulness and eases during sleep','Young jumping spiders show movements resembling features of REM sleep','Light at the wrong biological time can shift your internal clock later'];
 const dayKey=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/86400000);document.querySelector('#daily-fact').textContent=facts[dayKey%facts.length];
 const trend=[69,72,70,74,68,71,75,73,78,74,76,72,79,77,73,75,78,80,76,81,79,77,82,80,83,78,84,82];document.querySelector('.trend-bars').innerHTML=trend.map(value=>`<i style="height:${value}%"></i>`).join('');
 show('home');
}
