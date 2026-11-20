(() => {
 'use strict';
 const config=window.DELTALABS||{},reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const safeUrl=v=>{try{const u=new URL(v);return u.protocol==='https:'?u.href:null;}catch{return null;}};
 const campaign=safeUrl(config.kickstarterUrl)||safeUrl(config.updatesUrl),contact=document.getElementById('contact-dialog');let opener;
 const openDialog=(d,b)=>{if(!d)return;opener=b;d.showModal();document.body.classList.add('modal-open');};
 document.querySelectorAll('[data-campaign]').forEach(a=>{if(campaign){a.href=campaign;a.target='_blank';a.rel='noopener';a.textContent=config.kickstarterUrl?'VIEW ON KICKSTARTER':'LAUNCH UPDATES';}else a.addEventListener('click',e=>{e.preventDefault();openDialog(contact,a);});});
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
 document.querySelectorAll('[data-film]').forEach(b=>b.addEventListener('click',()=>{openDialog(filmDialog,b);film.play().catch(()=>{});}));
 document.querySelectorAll('[data-specs]').forEach(b=>b.addEventListener('click',()=>openDialog(document.getElementById('spec-dialog'),b)));
 document.querySelectorAll('dialog').forEach(d=>{d.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>d.close()));d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});d.addEventListener('close',()=>{if(d===filmDialog)film.pause();document.body.classList.remove('modal-open');opener?.focus();});});
 const hero=document.getElementById('hero-video');if(hero){if(reduced){hero.removeAttribute('autoplay');hero.pause();}else hero.play().catch(()=>{});document.querySelector('.replay')?.addEventListener('click',()=>{hero.currentTime=0;hero.play().catch(()=>{});});}
 if('IntersectionObserver' in window){if(!reduced)document.documentElement.classList.add('ready');const scenes=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view');}),{threshold:.15});document.querySelectorAll('.scene,.science-teaser,.launch').forEach(e=>scenes.observe(e));const movies=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&!reduced)e.target.play().catch(()=>{});else e.target.pause();}),{threshold:.15});document.querySelectorAll('.ambient-video').forEach(v=>movies.observe(v));}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)document.querySelectorAll('video').forEach(v=>v.pause());else if(!reduced)document.querySelectorAll('.ambient-video').forEach(v=>{const r=v.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)v.play().catch(()=>{});});});
})();
