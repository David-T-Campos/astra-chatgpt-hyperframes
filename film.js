// Frame-indexed reference plates retain the supplied film's exact gradient and UI motion.
// The 180 unique source plates are time-remapped across the full 15-second ARGUS Engineer film once.
// Text replacements remain authored and editable in this Hyperframes composition.
const canvas=document.getElementById('film');let ctx=canvas.getContext('2d');
const titleLayer=document.createElement('canvas');titleLayer.width=1920;titleLayer.height=1080;
const clamp=x=>Math.max(0,Math.min(1,x));
const ready=Promise.all([document.fonts.load('400 100px Switzer'),document.fonts.load('600 100px Switzer')]);
const cache=new Map();
async function plate(frame){if(cache.has(frame))return cache.get(frame);const img=new Image();img.src=`assets/plates/${String(frame).padStart(3,'0')}.png`;await img.decode();cache.set(frame,img);if(cache.size>4)cache.delete(cache.keys().next().value);return img}
function type(s,x,y,size,color='#202020',align='left',weight=400,blur=0,maxWidth){
 ctx.save();
 let drawSize=size;
 ctx.font=`${weight} ${drawSize}px Switzer,Arial`;
 if(maxWidth){const measured=ctx.measureText(s).width;if(measured>maxWidth){drawSize*=maxWidth/measured;ctx.font=`${weight} ${drawSize}px Switzer,Arial`;}}
 ctx.textBaseline='alphabetic';ctx.textAlign=align;ctx.fillStyle=color;ctx.filter=blur?`blur(${blur}px)`:'none';ctx.fillText(s,x,y);ctx.restore();
}
function gradient(x0,x1,a,b){const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,a);g.addColorStop(1,b);return g}
async function drawFrame(time){
 await ready;
 const duration=15;
 const progress=clamp(time/duration);
 const f=Math.min(179,Math.max(0,Math.round(progress*179)));
 const track=window.referenceTracks[f];const img=await plate(f);ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,1920,1080);ctx.drawImage(img,0,0);
 if(f<22){
  const main=ctx;ctx=titleLayer.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,1920,1080);
  const scale=1+.10*Math.exp(-f/3);ctx.save();ctx.translate(960,550);ctx.scale(scale,scale);
  const g=ctx.createLinearGradient(-655,0,655,0);const blueAt=clamp(.56+f*.031);
  g.addColorStop(0,'#010409');g.addColorStop(Math.max(.01,blueAt-.35),'#081628');g.addColorStop(Math.min(.99,blueAt),'#146cb2');g.addColorStop(1,'#184c68');
  type('ARGUS Engineer',0,74,184,g,'center',600,Math.max(0,7-f*1.5),1370);ctx.restore();
  if(f<7){ctx.save();ctx.globalCompositeOperation='destination-in';const edge=580+f*185;const mask=ctx.createLinearGradient(edge-180,0,edge+150,0);mask.addColorStop(0,'black');mask.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=mask;ctx.fillRect(0,0,1920,1080);ctx.restore();}
  ctx=main;ctx.drawImage(titleLayer,0,0);
 }else if(f>=45&&f<72){
  const scale=track.promptScale,left=track.promptLeft,blur=f>=68?(f-67)*1.5:0;
  const center=left+660*scale;
  const color=f<64?gradient(left+100+Math.max(0,(f-50)*35),left+1230*scale,'#191c1d','#6caed1'):'#171a1b';
  ctx.save();ctx.globalAlpha=clamp((f-45)/8);
  type('Your autonomous engineer for the physical world',center,track.headingY,46*scale,color,'center',400,blur);ctx.restore();
  ctx.save();ctx.globalAlpha=clamp((f-46)/7);ctx.font=`${32*scale}px monospace`;ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillStyle='#828282';ctx.filter=blur?`blur(${blur}px)`:'none';ctx.fillText('Design a 30 m pedestrian bridge',left+43*scale,540);ctx.restore();
 }else if(f>=72&&f<107){
  const x=track.left+85;const n=Math.max(0,Math.floor((f-72)*.67));const s='Engineer it with ARGUS'.slice(0,n);
  const blur=f<76?(76-f)*2:0;type(s,x,513,64,'#181a1b','left',400,blur);
  ctx.save();ctx.font='400 64px Switzer';const w=ctx.measureText(s).width;ctx.fillStyle='#40a2d4';ctx.filter=blur?`blur(${blur}px)`:'none';ctx.fillRect(x+w+12,463,7,57);ctx.restore();
 }else if(f>=134&&f<161){
  const y=track.resultOffset,blur=Math.max(0,(138-f)*1.7);const h=track.heading;
  type('Give ARGUS something to engineer',h?h[0]:488,y+214,42,'#7d7d7d','left',400,blur);
  const rows=[['Design against real constraints','Codes, loads, cost, geometry, and safety.'],['Operate engineering tools','Model, simulate, calculate, and iterate.'],['Verify every design','Critique the work until the bar is met.']];
  rows.forEach((r,i)=>{type(r[0],807,y+391+i*196,49,'#2b2b2b','left',400,blur);type(r[1],807,y+442+i*196,37,'#858585','left',400,blur)});
 }else if(f>=161){type('ARGUS Engineer.',966,553,53,'#0d2d48','center',600)}
}
window.addEventListener('hf-seek',event=>{const promise=drawFrame(event.detail.time);event.detail.waitUntil?.(promise)});
window.drawFrame=drawFrame;void drawFrame(0);
