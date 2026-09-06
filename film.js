// Frame-indexed reference plates retain the supplied film's exact gradient and UI motion.
// Motion segments run at native 24 fps. Extra time is added as intentional holds between scenes.
// Text replacements remain authored and editable in this Hyperframes composition.
const canvas=document.getElementById('film');let ctx=canvas.getContext('2d');
const titleLayer=document.createElement('canvas');titleLayer.width=1920;titleLayer.height=1080;
const clamp=x=>Math.max(0,Math.min(1,x));
const ready=Promise.all([document.fonts.load('400 100px Switzer'),document.fonts.load('600 100px Switzer')]);
const cache=new Map();
async function plate(frame){if(cache.has(frame))return cache.get(frame);const img=new Image();img.src=`assets/plates/${String(frame).padStart(3,'0')}.png`;await img.decode();cache.set(frame,img);if(cache.size>4)cache.delete(cache.keys().next().value);return img}
function type(s,x,y,size,color='#202020',align='left',weight=400,blur=0,maxWidth){ctx.save();let drawSize=size;ctx.font=`${weight} ${drawSize}px Switzer,Arial`;if(maxWidth){const measured=ctx.measureText(s).width;if(measured>maxWidth){drawSize*=maxWidth/measured;ctx.font=`${weight} ${drawSize}px Switzer,Arial`;}}ctx.textBaseline='alphabetic';ctx.textAlign=align;ctx.fillStyle=color;ctx.filter=blur?`blur(${blur}px)`:'none';ctx.fillText(s,x,y);ctx.restore()}
function gradient(x0,x1,a,b){const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,a);g.addColorStop(1,b);return g}
// The submit-button zoom from source frames 107–133 is intentionally omitted: it contains baked legacy UI copy
// and adds little to the story. The saved time is used as breathing room on the completed task and results.
const pacing=[{a:0,b:21,hold:1},{a:22,b:44,hold:.75},{a:45,b:67,hold:1},{a:68,b:71,hold:0},{a:72,b:106,hold:1.875},{a:134,b:160,hold:3},{a:161,b:179,hold:1}];
function sourceFrameAt(time){let t=clamp(time/15)*15,cursor=0;for(const seg of pacing){const motion=(seg.b-seg.a+1)/24;if(t<cursor+motion)return Math.min(seg.b,seg.a+Math.floor((t-cursor)*24));cursor+=motion;if(t<cursor+seg.hold)return seg.b;cursor+=seg.hold}return 179}
async function drawFrame(time){await ready;const f=sourceFrameAt(time),track=window.referenceTracks[f],img=await plate(f);ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,1920,1080);ctx.drawImage(img,0,0);
 if(f<22){
  const main=ctx;ctx=titleLayer.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,1920,1080);const scale=1+.10*Math.exp(-f/3);ctx.save();ctx.translate(960,550);ctx.scale(scale,scale);const g=ctx.createLinearGradient(-655,0,655,0);const blueAt=clamp(.56+f*.031);g.addColorStop(0,'#010409');g.addColorStop(Math.max(.01,blueAt-.35),'#081628');g.addColorStop(Math.min(.99,blueAt),'#146cb2');g.addColorStop(1,'#184c68');type('ARGUS Engineer',0,74,184,g,'center',600,Math.max(0,7-f*1.5),1370);ctx.restore();if(f<7){ctx.save();ctx.globalCompositeOperation='destination-in';const edge=580+f*185;const mask=ctx.createLinearGradient(edge-180,0,edge+150,0);mask.addColorStop(0,'black');mask.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=mask;ctx.fillRect(0,0,1920,1080);ctx.restore()}ctx=main;ctx.drawImage(titleLayer,0,0);
 }else if(f<45){
  ctx.fillStyle='#0866F5';ctx.fillRect(0,0,1920,1080);const label=f<29?'Design':f<36?'Design —':'Design — autonomously';const blur=f<25?(25-f)*1.8:0;type(label,960,615,142,'#fff','center',400,blur,1500);
 }else if(f<72){
  const scale=track.promptScale,left=track.promptLeft,blur=f>=68?(f-67)*1.5:0,center=left+660*scale;const color=f<64?gradient(left+100+Math.max(0,(f-50)*35),left+1230*scale,'#191c1d','#6caed1'):'#171a1b';ctx.save();ctx.globalAlpha=clamp((f-45)/8);type('Give ARGUS something to engineer',center,track.headingY,47*scale,color,'center',400,blur,980*scale);ctx.restore();ctx.save();ctx.globalAlpha=clamp((f-46)/7);type('Design a 30 m pedestrian bridge',left+43*scale,540,29*scale,'#828282','left',400,blur,900*scale);ctx.restore();
 }else if(f<107){
  const center=track.left+660;const headingBlur=f<76?(76-f)*1.6:0;type('Give ARGUS something to engineer',center,292,52,'#181a1b','center',400,headingBlur,920);const x=track.left+85,target='Design a 30 m pedestrian bridge',n=Math.max(0,Math.floor((f-72)*.95)),s=target.slice(0,n),blur=f<76?(76-f)*2:0;type(s,x,513,58,'#181a1b','left',400,blur);ctx.save();ctx.font='400 58px Switzer';const w=ctx.measureText(s).width;ctx.fillStyle='#40a2d4';ctx.filter=blur?`blur(${blur}px)`:'none';ctx.fillRect(x+w+10,466,7,52);ctx.restore();
 }else if(f<161){
  const y=track.resultOffset,blur=Math.max(0,(138-f)*1.7),h=track.heading;type('ARGUS engineered the bridge',h?h[0]:488,y+214,42,'#7d7d7d','left',400,blur);const rows=[['Structural model complete','Loads, geometry, materials, and constraints resolved.'],['512 designs evaluated','Weight, cost, and deflection optimized together.'],['Independent verification passed','Fresh checks confirm the project bar is met.']];rows.forEach((r,i)=>{type(r[0],807,y+391+i*196,49,'#2b2b2b','left',400,blur,900);type(r[1],807,y+442+i*196,36,'#858585','left',400,blur,940)});
 }else{type('ARGUS Engineer.',966,553,53,'#0d2d48','center',600)}
}
window.addEventListener('hf-seek',event=>{const promise=drawFrame(event.detail.time);event.detail.waitUntil?.(promise)});window.drawFrame=drawFrame;void drawFrame(0);
