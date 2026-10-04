(() => {
  'use strict';

  const style=document.createElement('style');
  style.id='site-ui-style';
  style.textContent=`
    .site-menu-toggle{display:none;min-width:48px;min-height:44px;border:1px solid currentColor;background:rgba(255,255,255,.62);color:inherit;padding:8px 10px;align-items:center;justify-content:center;gap:3px;cursor:pointer}
    .site-menu-toggle>span{display:block;width:15px;height:1px;background:currentColor;transition:transform .18s,opacity .18s}
    .site-menu-toggle b{font:600 .58rem ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;margin-left:5px}
    .site-menu-toggle.is-open>span:nth-child(1){transform:translate(3px,4px) rotate(45deg)}
    .site-menu-toggle.is-open>span:nth-child(2){opacity:0}
    .site-menu-toggle.is-open>span:nth-child(3){transform:translate(-3px,-4px) rotate(-45deg)}
    .site-mobile-menu[hidden]{display:none!important}
    .site-mobile-menu{position:fixed;z-index:1900;inset:70px 0 0;background:rgba(245,243,238,.985);color:#0c0d10;backdrop-filter:blur(18px);padding:24px;overflow:auto}
    .site-mobile-menu nav{max-width:680px;margin:0 auto;display:flex!important;flex-direction:column}
    .site-mobile-menu a{min-height:56px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(12,13,16,.16);text-decoration:none;font:500 1.08rem/1.3 "Helvetica Neue",Arial,sans-serif;color:#0c0d10}
    .site-mobile-menu a::after{content:"→";font-family:ui-monospace,monospace;color:#536e72}
    .site-mobile-menu a[aria-current="page"]{color:#536e72;font-weight:700}
    .menu-open{overflow:hidden}
    @media(max-width:980px){.site-menu-toggle{display:inline-flex}}
    @media(prefers-reduced-motion:reduce){.site-menu-toggle>span{transition:none}}
  `;
  document.head.appendChild(style);

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
  document.addEventListener('keydown',e=>{
    if(panel.hidden) return;
    if(e.key==='Escape'){ closeMenu(); return; }
    if(e.key==='Tab'){
      const focusable=[...panel.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')];
      if(!focusable.length) return;
      const first=focusable[0], last=focusable[focusable.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  window.addEventListener('resize',()=>{if(innerWidth>980) closeMenu(false)});
})();