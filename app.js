(() => {
 'use strict';
 const config=window.DELTALABS||{},reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduced&&'IntersectionObserver' in window){document.body.classList.add('reveal-ready');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('[data-reveal]').forEach(e=>observer.observe(e));}
 const safeUrl=v=>{try{const u=new URL(v);return u.protocol==='https:'?u.href:null;}catch{return null;}};
 const campaign=safeUrl(config.kickstarterUrl)||safeUrl(config.updatesUrl),contact=document.getElementById('contact-dialog'),preorder=document.getElementById('preorder-dialog')||contact;let opener;
 const movies=[...document.querySelectorAll('.cinematic')],visible=new Set();let motionPaused=reduced;
 const syncMotion=()=>{document.body.classList.toggle('motion-paused',motionPaused);movies.forEach(v=>{if(!motionPaused&&!document.hidden&&!document.querySelector('dialog[open]')&&visible.has(v)){v.play().catch(()=>{});}else v.pause();});};
 const openDialog=(d,b)=>{if(!d)return;opener=b;d.showModal();document.body.classList.add('modal-open');syncMotion();};
 document.querySelectorAll('[data-campaign]').forEach(a=>{if(campaign){a.href=campaign;a.target='_blank';a.rel='noopener';a.textContent='PRE-ORDER NOW';}else a.addEventListener('click',e=>{e.preventDefault();openDialog(preorder,a);});});
 const email=typeof config.contactEmail==='string'&&/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.contactEmail)?config.contactEmail:null;
 if(email){document.querySelectorAll('[data-contact]').forEach(a=>{a.href='mailto:'+email;a.textContent=email;a.hidden=false;});document.querySelectorAll('.contact-pending').forEach(p=>p.hidden=true);const p=contact?.querySelector('p');if(p)p.textContent='Product questions, collaborations, and launch inquiries.';}
 Object.entries(config.socials||{}).forEach(([name,value])=>{const href=safeUrl(value);if(href)document.querySelectorAll('.socials').forEach(c=>{const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener';a.textContent=name.toUpperCase();c.append(a);});});
 document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
 const menu=document.querySelector('.menu-toggle'),nav=document.getElementById('navigation');
 const closeMenu=()=>{nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open navigation');};
 menu?.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',expanded);menu.setAttribute('aria-expanded',String(expanded));menu.setAttribute('aria-label',expanded?'Close navigation':'Open navigation');});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
 document.querySelectorAll('[data-contact-open]').forEach(b=>b.addEventListener('click',()=>openDialog(contact,b)));
 const film=document.getElementById('product-film'),filmDialog=document.getElementById('film-dialog');
 document.querySelectorAll('[data-film]').forEach(b=>b.addEventListener('click',()=>{openDialog(filmDialog,b);film.loop=true;film.play().catch(()=>{});}));
 document.querySelectorAll('[data-specs]').forEach(b=>b.addEventListener('click',()=>openDialog(document.getElementById('spec-dialog'),b)));
 document.querySelectorAll('dialog').forEach(d=>{d.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>d.close()));d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});d.addEventListener('close',()=>{if(d===filmDialog)film.pause();document.body.classList.remove('modal-open');opener?.focus();syncMotion();});});
 const motionButton=document.querySelector('.motion-toggle');
 const labelMotion=()=>{if(motionButton){motionButton.textContent=motionButton.hasAttribute('data-icon-motion')?(motionPaused?'▷':'Ⅱ'):(motionPaused?'PLAY MOTION ▷':'PAUSE MOTION Ⅱ');motionButton.setAttribute('aria-pressed',String(motionPaused));motionButton.setAttribute('aria-label',motionPaused?'Play background film':'Pause background film');}};
 motionButton?.addEventListener('click',()=>{motionPaused=!motionPaused;labelMotion();syncMotion();});labelMotion();
 movies.forEach(v=>{v.loop=true;if(reduced){v.removeAttribute('autoplay');v.pause();}});
 if('IntersectionObserver' in window){
  const videoObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)visible.add(e.target);else visible.delete(e.target);});syncMotion();},{threshold:.12});movies.forEach(v=>videoObserver.observe(v));
  if(!reduced){document.body.classList.add('media-ready');const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');reveal.unobserve(e.target);}}),{threshold:.1});document.querySelectorAll('.feature-panel,.material-copy,.wake-copy,.access-copy,.product-intro>h2').forEach(e=>{e.classList.add('reveal-on-scroll');reveal.observe(e);});}
 }else{movies.forEach(v=>visible.add(v));syncMotion();}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)film?.pause();syncMotion();});
 const benefits={
  understand:{title:'A clearer picture of your sleep.',heading:'Go beyond a sleep score.',body:'Sleep-stage estimates from brain and eye signals, with a planned app that helps you understand your patterns.'},
  sound:{title:'Sound, timed to your night.',heading:'Built-in audio. Thoughtful timing.',body:'Built-in stereo speakers, designed for sound cues timed to your sleep stage. One integrated bedtime setup.'},
  wake:{title:'A more intentional morning.',heading:'Start with a gradual sunrise.',body:'Diffused sunrise LEDs and a planned smart alarm bring light, sound, and sleep timing into one morning routine.'}
 };
 const tabs=[...document.querySelectorAll('[data-feature]')];
 function selectTab(tab,focus=false){const data=benefits[tab.dataset.feature];if(!data)return;tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;});document.getElementById('feature-title').textContent=data.title;const panel=document.getElementById('feature-detail');panel.setAttribute('aria-labelledby',tab.id);panel.querySelector('h3').textContent=data.heading;panel.querySelector('p').textContent=data.body;if(focus)tab.focus();}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();selectTab(tabs[next],true);}});});
})();
