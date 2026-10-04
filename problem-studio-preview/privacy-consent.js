(() => {
  'use strict';
  const optional=[...document.querySelectorAll('script[type="text/plain"][data-consent]')];
  if(!optional.length) return;

  const key='lps_privacy_preferences_v1';
  const categories=[...new Set(optional.map(s=>s.dataset.consent).filter(Boolean))];
  const saved=(()=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}})();

  function activate(prefs){
    optional.forEach(source=>{
      const cat=source.dataset.consent;
      if(!prefs?.[cat] || source.dataset.activated==='true') return;
      const script=document.createElement('script');
      [...source.attributes].forEach(a=>{
        if(!['type','data-consent','data-activated'].includes(a.name)) script.setAttribute(a.name,a.value);
      });
      script.textContent=source.textContent;
      source.dataset.activated='true';
      source.after(script);
    });
  }

  function save(prefs){
    localStorage.setItem(key,JSON.stringify(prefs));
    activate(prefs);
  }

  function build(){
    const wrap=document.createElement('div');
    wrap.className='consent-banner';
    wrap.setAttribute('role','dialog');
    wrap.setAttribute('aria-modal','true');
    wrap.setAttribute('aria-labelledby','consent-title');
    wrap.innerHTML=`
      <div class="consent-panel">
        <div>
          <div class="micro">Privacy choices</div>
          <h2 id="consent-title">Choose optional tracking</h2>
          <p>Essential site functions always run. Optional analytics or marketing tools stay off unless you allow them. You can change this later.</p>
        </div>
        <div class="consent-actions">
          <button type="button" data-choice="essential">Essential only</button>
          <button type="button" class="primary" data-choice="all">Allow optional</button>
          <a href="cookies.html">Cookie details</a>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    const first=wrap.querySelector('button');
    first?.focus();
    wrap.addEventListener('click',e=>{
      const choice=e.target.closest('[data-choice]')?.dataset.choice;
      if(!choice) return;
      const prefs={};
      categories.forEach(c=>prefs[c]=choice==='all');
      save(prefs);
      wrap.remove();
      addManageButton();
    });
  }

  function addManageButton(){
    if(document.querySelector('.privacy-choice-button')) return;
    const b=document.createElement('button');
    b.type='button';
    b.className='privacy-choice-button';
    b.textContent='Privacy choices';
    b.addEventListener('click',()=>{
      try{localStorage.removeItem(key)}catch(e){}
      b.remove();
      build();
    });
    document.body.appendChild(b);
  }

  const style=document.createElement('style');
  style.textContent=`
    .consent-banner{position:fixed;z-index:2000;inset:auto 16px 16px 16px;display:flex;justify-content:center}
    .consent-panel{width:min(920px,100%);background:#f5f3ee;color:#0c0d10;border:1px solid rgba(12,13,16,.3);box-shadow:0 22px 70px rgba(12,13,16,.18);padding:20px;display:grid;grid-template-columns:1fr auto;gap:24px;align-items:end}
    .consent-panel h2{font-size:1.4rem;margin:4px 0 7px}.consent-panel p{margin:0;max-width:58ch}
    .consent-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.consent-actions button,.consent-actions a,.privacy-choice-button{min-height:44px;padding:10px 13px;border:1px solid #0c0d10;background:transparent;color:#0c0d10;font:600 .65rem ui-monospace,monospace;text-transform:uppercase;letter-spacing:.06em;text-decoration:none;cursor:pointer}
    .consent-actions .primary{background:#0c0d10;color:#f5f3ee}.privacy-choice-button{position:fixed;right:12px;bottom:12px;z-index:1500;background:#f5f3ee}
    @media(max-width:720px){.consent-panel{grid-template-columns:1fr}.consent-actions{align-items:stretch;flex-direction:column}.consent-actions>*{width:100%;justify-content:center;text-align:center}}
  `;
  document.head.appendChild(style);

  if(saved){ activate(saved); addManageButton(); } else { build(); }
})();