const phone=document.querySelector('#phone-screen');
if(phone){
 const screens={home:['Your day starts here','Your sleep score, a clearer picture of last night, and a plan for tonight'],mindful:['Rest on purpose','Choose a short nap or take a mindful pause'],coach:['A place to ask','Talk through your sleep patterns with Coach'],wake:['Wake when it matters','Set your latest wake time, plan travel, and work around shifts'],trends:['See the longer view','Explore your sleep archetype and how your nights change over time']};
 const setScreen=name=>{if(!screens[name])return;phone.querySelectorAll('.app-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===name));document.querySelectorAll('[data-screen]').forEach(b=>{const active=b.dataset.screen===name;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false');});document.querySelector('#app-section-title').textContent=screens[name][0];document.querySelector('#app-section-copy').textContent=screens[name][1];phone.dataset.screen=name;phone.querySelector('.phone-content').scrollTop=0;};
 document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>setScreen(b.dataset.screen)));
 const now=new Date(),hour=now.getHours(),phase=hour>=5&&hour<11?'morning':hour>=11&&hour<16?'day':hour>=16&&hour<20?'evening':'night';phone.classList.add('phase-'+phase);phone.classList.remove('phase-morning');
 const greeting=hour>=5&&hour<12?'Good morning':hour>=12&&hour<17?'Good afternoon':'Good evening';document.querySelector('#greeting').textContent=`${greeting}, Alex`;
 const fmt=new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit'});document.querySelector('#phone-time').textContent=fmt.format(now);document.querySelector('#internal-clock').textContent=fmt.format(now);
 const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],offset=(now.getDay()+6)%7;const scores=[82,77,84,81,88,85,86];document.querySelector('.week-scores').innerHTML=Array.from({length:5},(_,i)=>{const d=(offset-4+i+7)%7;return `<span><small>${days[d]}</small><b>${scores[d]}</b></span>`;}).join('');
 const facts=[
  'Great frigatebirds have been recorded sleeping while flying over the ocean',
  'Morning light helps anchor your body clock to the local day',
  'In N2 sleep, EEG can show brief bursts called sleep spindles',
  'Mallards at the edge of a group can keep one eye open while resting',
  'Sleep pressure builds during wakefulness and eases during sleep',
  'Young jumping spiders show movements resembling features of REM sleep',
  'Light at the wrong biological time can shift your internal clock later'
 ];const dayKey=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/86400000);const scenes=['forest-dawn.webp','wild-ocean.webp','sunrise-wide.webp'];phone.style.setProperty('--app-scene',`url('assets/${scenes[((dayKey%scenes.length)+scenes.length)%scenes.length]}')`);document.querySelector('#daily-fact').textContent=facts[((dayKey%facts.length)+facts.length)%facts.length];
 document.querySelectorAll('[data-open-trends]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.openTrends;document.querySelector('#trend-detail-title').textContent={efficiency:'SLEEP EFFICIENCY',duration:'TIME ASLEEP',deep:'DEEP SLEEP',rem:'REM SLEEP'}[key];document.querySelector('#trend-detail').textContent=`Example ${key} trend over the last three months`;setScreen('trends');}));
 document.querySelector('.trend-bars').innerHTML=Array.from({length:28},(_,i)=>`<i style="height:${28+((i*31+11)%53)}%"></i>`).join('');
 document.querySelectorAll('[data-duration]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-duration]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');}));
 document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{const labels={nap:`${document.querySelector('[data-duration].selected').dataset.duration}-minute nap ready`,mindful:'Mindfulness session ready',travel:'Travel planner preview',shift:'Shift planner preview'};b.textContent=labels[b.dataset.action];}));
 const alarmButton=document.querySelector('#alarm-time'),alarmEditor=document.querySelector('#alarm-editor');alarmButton.addEventListener('click',()=>{alarmEditor.hidden=false;alarmEditor.focus();});alarmEditor.addEventListener('change',()=>{const [h,m]=alarmEditor.value.split(':').map(Number);alarmButton.innerHTML=`${h%12||12}:${String(m).padStart(2,'0')} <span>${h<12?'AM':'PM'}</span>`;alarmEditor.hidden=true;});alarmEditor.addEventListener('blur',()=>{alarmEditor.hidden=true;});
 document.querySelector('[data-settings]').addEventListener('click',()=>{setScreen('wake');phone.querySelector('.phone-content').scrollTop=260;});
 document.querySelector('.chat-form').addEventListener('submit',e=>{e.preventDefault();const input=e.currentTarget.querySelector('input'),v=input.value.trim();if(!v)return;const log=document.querySelector('.chat-log');const p=document.createElement('p');p.className='chat-bubble user';p.textContent=v;log.append(p);const answer=document.createElement('p');answer.className='chat-bubble bot';answer.textContent='This preview cannot analyze your actual sleep yet. In the app, Coach will use your sleep data to help you understand your patterns.';log.append(answer);input.value='';log.scrollTop=log.scrollHeight;});
 setScreen('home');
}
