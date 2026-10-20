/* A decorative logo journey; the real, accessible header stays in the document. */
(()=>{'use strict';
const logo=document.querySelector('header .brand img');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!logo||!Element.prototype.animate||reduced.matches||document.body.classList.contains('motion-off'))return;
const requestedAt=performance.now();
let layer,skip,flight,timer,started=false,finished=false;
const cleanups=[],motions=[];
function listen(target,type,fn,options){target.addEventListener(type,fn,options);cleanups.push(()=>target.removeEventListener(type,fn,options));}
function finish(stopPhoto=true){if(finished)return;finished=true;clearTimeout(timer);document.body.classList.remove('logo-intro-active');if(stopPhoto)document.body.classList.remove('logo-photo-reveal');flight?.cancel();motions.forEach(m=>m.cancel());layer?.remove();skip?.remove();cleanups.forEach(fn=>fn());}
function run(){
 if(started||finished||reduced.matches||document.body.classList.contains('motion-off')||performance.now()-requestedAt>1200||window.scrollY>20)return;
 started=true;clearTimeout(timer);
 try{
  const destination=logo.getBoundingClientRect();
  if(!logo.naturalWidth||destination.width<=0||destination.height<=0)return;
  const width=Math.min(window.innerWidth*.84,1024,logo.naturalWidth);
  const height=width*logo.naturalHeight/logo.naturalWidth;
  const cx=window.innerWidth/2,cy=window.innerHeight*.46;
  const pose=(scale,x=cx-width*scale/2,y=cy-height*scale/2)=>`translate3d(${x}px,${y}px,0) scale(${scale})`;
  layer=document.createElement('div');layer.className='logo-intro-layer';layer.setAttribute('aria-hidden','true');
  const top=document.createElement('div');top.className='logo-intro-panel logo-intro-panel-top';
  const bottom=document.createElement('div');bottom.className='logo-intro-panel logo-intro-panel-bottom';
  const cut=document.createElement('div');cut.className='logo-intro-cut';
  const track=document.createElement('span');track.className='logo-intro-cut-track';cut.append(track);
  const image=logo.cloneNode(false);image.className='logo-intro-image';image.alt='';image.removeAttribute('id');image.removeAttribute('loading');image.style.width=width+'px';image.style.height=height+'px';image.style.transform=pose(.72);
  layer.append(top,bottom,cut,image);
  skip=document.createElement('button');skip.type='button';skip.className='logo-intro-skip';skip.textContent='アニメーションをスキップ ↗';
  document.body.append(layer,skip);document.body.classList.add('logo-intro-active');document.body.classList.add('logo-photo-reveal');
  // The last transform lands on the actual responsive header image rectangle.
  flight=image.animate([
   {transform:pose(.72),opacity:0,offset:0,easing:'cubic-bezier(.22,1,.36,1)'},
   {transform:pose(1),opacity:1,offset:.25},
   {transform:pose(1),opacity:1,offset:.52,easing:'cubic-bezier(.76,0,.24,1)'},
   {transform:pose(destination.width/width,destination.left,destination.top),opacity:1,offset:1}
  ],{duration:3000,fill:'forwards'});
  const options={duration:3000,fill:'forwards'};
  motions.push(top.animate([{transform:'translateY(0)',offset:0},{transform:'translateY(0)',offset:.52,easing:'cubic-bezier(.76,0,.24,1)'},{transform:'translateY(-101%)',offset:1}],options));
  motions.push(bottom.animate([{transform:'translateY(0)',offset:0},{transform:'translateY(0)',offset:.52,easing:'cubic-bezier(.76,0,.24,1)'},{transform:'translateY(101%)',offset:1}],options));
  motions.push(track.animate([{transform:'scaleX(0)',offset:0},{transform:'scaleX(0)',offset:.24,easing:'cubic-bezier(.65,0,.35,1)'},{transform:'scaleX(1)',offset:.51},{transform:'scaleX(1)',offset:1}],options));
  motions.push(cut.animate([{opacity:1,offset:0},{opacity:1,offset:.52},{opacity:0,offset:.60},{opacity:0,offset:1}],options));
  flight.onfinish=()=>finish(false);timer=setTimeout(()=>finish(false),3600);
  listen(skip,'click',()=>{finish();document.getElementById('motion')?.focus();});
  listen(document,'keydown',e=>{if(e.key==='Tab'||e.key==='Escape')finish();},true);
  listen(document,'focusin',e=>{if(e.target!==skip)finish();});
  listen(window,'resize',finish);listen(window,'scroll',finish,{passive:true});
  listen(reduced,'change',finish);listen(document,'visibilitychange',()=>{if(document.hidden)finish();});
  const motion=document.getElementById('motion');if(motion)listen(motion,'click',finish);
 }catch(error){finish();}
}
if(logo.complete)run();else{listen(logo,'load',run,{once:true});listen(logo,'error',finish,{once:true});timer=setTimeout(finish,1200);}
})();
