(() => {
  'use strict';

  const header=document.querySelector('.site-header, .topbar');
  const desktopNav=header?.querySelector('nav');
  if(!header || !desktopNav) return;

  const current=(location.pathname.split('/').pop() || 'index.html').toLowerCase();
  desktopNav.querySelectorAll('a[href]').forEach(a=>{
    const href=(a.getAttribute('href')||'').split('#')[0].toLowerCase();
    if(href && href===current) a.setAttribute('aria-current','page');
  });

  const button=document.createElement('button');
  button.type='button';
  button.className='site-menu-toggle';
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-controls','site-mobile-menu');
  button.setAttribute('aria-label','Open site menu');
  button.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span><b>Menu</b>';
  header.appendChild(button);

  const panel=document.createElement('div');
  panel.id='site-mobile-menu';
  panel.className='site-mobile-menu';
  panel.hidden=true;
  panel.setAttribute('aria-label','Mobile navigation');
  const mobileNav=document.createElement('nav');
  mobileNav.setAttribute('aria-label','Mobile navigation');
  [...desktopNav.querySelectorAll('a[href]')].forEach(a=>{
    const clone=a.cloneNode(true);
    clone.removeAttribute('class');
    mobileNav.appendChild(clone);
  });
  panel.appendChild(mobileNav);
  document.body.appendChild(panel);

  let lastFocus=null;
  function openMenu(){
    lastFocus=document.activeElement;
    panel.hidden=false;
    document.body.classList.add('menu-open');
    button.classList.add('is-open');
    button.setAttribute('aria-expanded','true');
    button.setAttribute('aria-label','Close site menu');
    const first=mobileNav.querySelector('a');
    if(first) requestAnimationFrame(()=>first.focus());
  }
  function closeMenu(returnFocus=true){
    if(panel.hidden) return;
    panel.hidden=true;
    document.body.classList.remove('menu-open');
    button.classList.remove('is-open');
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-label','Open site menu');
    if(returnFocus && lastFocus instanceof HTMLElement) lastFocus.focus();
  }
  button.addEventListener('click',()=>panel.hidden?openMenu():closeMenu());
  mobileNav.addEventListener('click',e=>{if(e.target.closest('a')) closeMenu(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden) closeMenu()});
  window.addEventListener('resize',()=>{if(innerWidth>980) closeMenu(false)});
})();