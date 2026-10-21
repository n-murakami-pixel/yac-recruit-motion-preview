(()=>{'use strict';
 const root=document.documentElement,media=matchMedia('(prefers-reduced-motion: reduce)'),motion=document.getElementById('motion');
 let saved=false;try{saved=sessionStorage.getItem('yac-motion-stopped')==='true'}catch{}
 let stopped=media.matches||saved;
 function setMotion(value,persist=false){stopped=media.matches||value;document.body.classList.toggle('motion-off',stopped);motion.setAttribute('aria-pressed',String(stopped));motion.textContent=media.matches?'動きを抑えています':stopped?'動きを再開':'動きを止める';motion.disabled=media.matches;document.dispatchEvent(new Event('yac:motionchange'));if(stopped)document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'));if(persist){saved=value;try{sessionStorage.setItem('yac-motion-stopped',String(value))}catch{}}}
 setMotion(stopped);motion.addEventListener('click',()=>setMotion(!stopped,true));media.addEventListener('change',()=>setMotion(saved));
 const menu=document.querySelector('.menu'),nav=document.getElementById('mobile-nav');
 function close(){nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','メニューを開く')}
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.hidden=!open;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く')});
 nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});
 const dropdown=document.querySelector('.recruit-dropdown'),recruitSummary=dropdown?.querySelector('summary');
 function syncRecruit(){recruitSummary?.setAttribute('aria-expanded',String(dropdown.open))}
 function closeRecruit(){dropdown.open=false;syncRecruit()}
 syncRecruit();dropdown?.addEventListener('toggle',syncRecruit);
 recruitSummary?.addEventListener('click',e=>{e.preventDefault();dropdown.open=!dropdown.open;syncRecruit()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!nav.hidden){close();menu.focus()}if(dropdown?.open){closeRecruit();recruitSummary.focus()}}});
 document.addEventListener('click',e=>{if(dropdown?.open&&!dropdown.contains(e.target))closeRecruit()});
 document.addEventListener('focusin',e=>{if(dropdown?.open&&!dropdown.contains(e.target))closeRecruit()});
 matchMedia('(min-width:701px)').addEventListener('change',e=>{if(e.matches)close()});
 let ticking=false;function progress(){const total=root.scrollHeight-innerHeight;document.querySelector('.progress').style.transform=`scaleX(${total>0?scrollY/total:0})`;ticking=false}
 addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(progress);ticking=true}},{passive:true});addEventListener('resize',progress);progress();
})();

// Keep native details as the no-script fallback; animate only the answer panel.
(()=>{'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),states=[];
 const noMotion=()=>reduced.matches||document.body.classList.contains('motion-off');
 function settle(s){
  s.animation?.cancel();s.animation=null;s.details.open=s.expanded;
  s.panel.style.overflow='';s.panel.inert=!s.expanded;
 }
 document.querySelectorAll('.faq-list details').forEach(details=>{
  const summary=details.querySelector('summary'),panel=details.querySelector('.faq-panel'),content=panel?.querySelector('.faq-content');
  if(!panel||!content)return;
  const s={details,summary,panel,content,expanded:details.open,animation:null};states.push(s);
  details.dataset.expanded=String(s.expanded);summary.setAttribute('aria-expanded',String(s.expanded));panel.inert=!s.expanded;
  summary.addEventListener('click',e=>{
   e.preventDefault();
   const height=details.open?panel.getBoundingClientRect().height:0;
   const opacity=details.open?Number(getComputedStyle(panel).opacity):0;
   s.animation?.cancel();s.animation=null;s.expanded=!s.expanded;
   summary.setAttribute('aria-expanded',String(s.expanded));details.dataset.expanded=String(s.expanded);panel.inert=!s.expanded;
   if(noMotion()||!panel.animate){settle(s);return}
   details.open=true;panel.style.overflow='hidden';
   const full=content.getBoundingClientRect().height,target=s.expanded?full:0;
   const animation=panel.animate([{height:height+'px',opacity},{height:target+'px',opacity:s.expanded?1:0}],{
    duration:Math.max(100,300*Math.min(1,Math.abs(target-height)/Math.max(1,full))),
    easing:'cubic-bezier(.22,.61,.36,1)',fill:'both'
   });
   s.animation=animation;animation.onfinish=()=>{if(s.animation===animation)settle(s)};
  });
 });
 document.addEventListener('yac:motionchange',()=>{if(noMotion())states.forEach(settle)});
 addEventListener('resize',()=>states.filter(s=>s.animation).forEach(settle));
})();
