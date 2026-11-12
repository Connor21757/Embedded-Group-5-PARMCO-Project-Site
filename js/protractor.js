(function(){
  var NS='http://www.w3.org/2000/svg', C=200, STEP=0.9, ENC=360/4096;
  var svg=document.getElementById('prot'); if(!svg) return;
  function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e;}
  function pt(r,deg){var t=deg*Math.PI/180;return [C+r*Math.sin(t),C-r*Math.cos(t)];}
  el('circle',{cx:C,cy:C,r:178,'class':'ring'}); el('circle',{cx:C,cy:C,r:150,'class':'ring'});
  for(var d=0;d<360;d+=5){
    var big=d%30===0, mid=d%10===0, len=big?16:(mid?10:6), a=pt(178,d), b=pt(178-len,d);
    el('line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],'class':'tick'+(big?' big':(mid?' mid':''))});
    if(big){var n=pt(130,d);var t=el('text',{x:n[0],y:n[1],'class':'num'});t.textContent=d+'\u00b0';}
  }
  var snap=el('line',{x1:C,y1:C,x2:C,y2:C-150,'class':'snap'});
  var g=el('g',{});
  el('path',{d:'M-6,0 L-11,-92 Q0,-112 11,-92 L6,0 Z','class':'blade ref'},g);
  el('path',{d:'M-6,0 L-11,92 Q0,112 11,92 L6,0 Z','class':'blade'},g);
  el('circle',{cx:0,cy:0,r:9,'class':'hub'},g);
  var num=document.getElementById('ang-num'), rng=document.getElementById('ang-rng');
  var o={t:document.getElementById('o-target'),s:document.getElementById('o-snap'),n:document.getElementById('o-steps'),e:document.getElementById('o-err'),c:document.getElementById('o-enc')};
  var angle=0;
  function set(a){
    a=((a%360)+360)%360; angle=a;
    g.setAttribute('transform','translate('+C+','+C+') rotate('+a+')');
    snap.setAttribute('transform','rotate('+(Math.round(a/STEP)*STEP)+' '+C+' '+C+')');
    var steps=Math.round(a/STEP)%400, snapped=steps*STEP, diff=Math.abs(snapped-a); if(diff>180)diff=360-diff;
    var counts=Math.round(snapped/ENC)%4096;
    o.t.textContent=a.toFixed(1)+'\u00b0'; o.s.textContent=snapped.toFixed(1)+'\u00b0';
    o.n.textContent=steps+' of 400'; o.e.textContent=diff.toFixed(1)+'\u00b0'; o.c.textContent=counts+' of 4096';
    num.value=a.toFixed(1); rng.value=a.toFixed(1);
  }
  function fromEvent(ev){var r=svg.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width*400-C,y=(ev.clientY-r.top)/r.height*400-C;
    return Math.atan2(x,-y)*180/Math.PI;}
  var dragging=false, anim=null;
  svg.addEventListener('pointerdown',function(e){dragging=true;if(anim)cancelAnimationFrame(anim);svg.setPointerCapture(e.pointerId);set(fromEvent(e));});
  svg.addEventListener('pointermove',function(e){if(dragging)set(fromEvent(e));});
  svg.addEventListener('pointerup',function(){dragging=false;});
  num.addEventListener('input',function(){var v=parseFloat(num.value);if(!isNaN(v))set(v);});
  rng.addEventListener('input',function(){set(parseFloat(rng.value));});
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){set(137);} else {
    set(0); var t0=null,to=137,dur=1800;
    (function step(ts){ if(t0===null)t0=ts; var p=Math.min(1,(ts-t0)/dur), e=1-Math.pow(1-p,3); set(to*e); if(p<1)anim=requestAnimationFrame(step); })(performance.now());
  }
})();
