(() => {
  'use strict';
  const config = window.DELTALABS || {};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const safeUrl = value => { try { const u = new URL(value); return u.protocol === 'https:' ? u.href : null; } catch { return null; } };
  const campaign = safeUrl(config.kickstarterUrl);
  const updates = safeUrl(config.updatesUrl);
  document.querySelectorAll('[data-campaign]').forEach(a => {
    if (campaign || updates) { a.href = campaign || updates; a.target = '_blank'; a.rel = 'noopener'; a.replaceChildren(document.createTextNode(campaign ? 'View on Kickstarter ' : 'Get launch updates ')); const arrow=document.createElement('span'); arrow.textContent='↗'; a.append(arrow); }
  });
  const status = document.getElementById('launch-status');
  if (status && campaign) status.textContent = 'See campaign details and availability on Kickstarter.';
  else if (status && updates) status.textContent = 'Sign up through our external updates page.';
  const email = typeof config.contactEmail === 'string' && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.contactEmail) ? config.contactEmail : null;
  if (email) {
    document.querySelectorAll('[data-contact]').forEach(a => { a.href='mailto:'+email; a.textContent=email+' ↗'; a.hidden=false; });
    document.querySelectorAll('.contact-pending').forEach(p=>p.hidden=true);
  }
  const labels = { instagram: 'Instagram', youtube: 'YouTube', linkedin: 'LinkedIn', x: 'X' };
  document.querySelectorAll('.socials').forEach(container => Object.entries(config.socials || {}).forEach(([key,value])=>{
    const href=safeUrl(value); if(!href) return;
    const a=document.createElement('a'); a.href=href; a.target='_blank'; a.rel='noopener'; a.textContent=(labels[key]||key)+' ↗'; container.append(a);
  }));
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const menu=document.querySelector('.menu-toggle'); const nav=document.getElementById('navigation');
  const closeMenu=()=>{nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open navigation');};
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  document.querySelectorAll('.back-top').forEach(b=>b.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced?'instant':'smooth'})));
  if ('IntersectionObserver' in window) {
    if(!reduced) document.documentElement.classList.add('js-motion');
    const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target);}}),{threshold:.08});
    document.querySelectorAll('.reveal,.mission-symbol').forEach(e=>reveal.observe(e));
  }
  let scheduled=false;
  const steps=[...document.querySelectorAll('.feature-step')]; const feature=document.getElementById('feature-image'); let current=-1;
  // Preload tiny compressed stills; scroll changes never initiate video seeking or large downloads.
  steps.forEach(s=>{const img=new Image();img.src='assets/'+s.dataset.image+'.webp';});
  function updateScroll(){
    const total=document.documentElement.scrollHeight-window.innerHeight;
    const progress=document.querySelector('.reading-progress'); if(progress)progress.style.width=(total>0?window.scrollY/total*100:0)+'%';
    if(feature && steps.length){
      const target=window.innerHeight*(window.innerWidth<=760?.62:.5);
      let best=0,distance=Infinity;
      steps.forEach((s,i)=>{const r=s.getBoundingClientRect();const d=Math.abs(r.top+r.height/2-target);if(d<distance){distance=d;best=i;}});
      if(best!==current){current=best;feature.src='assets/'+steps[best].dataset.image+'.webp';feature.alt=steps[best].dataset.alt;document.getElementById('feature-counter').textContent=String(best+1).padStart(2,'0')+' / 04';document.querySelector('.story-progress span').style.width=((best+1)*25)+'%';}
    }
    scheduled=false;
  }
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}},{passive:true});window.addEventListener('resize',updateScroll);updateScroll();
  const hero=document.getElementById('hero-video');
  if(hero&&!reduced)hero.play().catch(()=>{});
  const film=document.getElementById('product-film');const dialog=document.getElementById('film-dialog'); let opener;
  document.querySelectorAll('[data-film]').forEach(b=>b.addEventListener('click',()=>{opener=b;dialog.showModal();document.body.classList.add('modal-open');film.play().catch(()=>{});}));
  document.querySelector('.close-film')?.addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog?.addEventListener('close',()=>{film.pause();document.body.classList.remove('modal-open');opener?.focus();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){hero?.pause();film?.pause();}});
})();
