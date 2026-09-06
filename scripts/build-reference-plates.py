"""Build text-cleared reference plates and measured tracks for Hyperframes.
Source gradients, camera motion, borders, squares, and cursor are preserved.
Only source lettering and corner identity are replaced.
"""
import cv2,numpy as np,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/plates';OUT.mkdir(exist_ok=True)
cap=cv2.VideoCapture(str(ROOT/'reference/original.mp4'))
tracks=[]
def clear_rect(f,rect):
 x0,y0,x1,y1=map(int,rect);x0=max(0,x0);x1=min(1920,x1);y0=max(1,y0);y1=min(1079,y1)
 top=f[y0-1:y0,x0:x1].astype(float);bot=f[y1:y1+1,x0:x1].astype(float)
 blend=np.linspace(0,1,y1-y0)[:,None,None];f[y0:y1,x0:x1]=np.uint8(top*(1-blend)+bot*blend)
def bbox(f,rect,limit=205):
 x0,y0,x1,y1=rect;roi=f[y0:y1,x0:x1];m=np.max(roi,axis=2)<limit;ys,xs=np.where(m)
 return [int(xs.min()+x0),int(ys.min()+y0),int(xs.max()+x0+1),int(ys.max()+y0+1)] if len(xs) else None
for i in range(180):
 ok,original=cap.read();assert ok;f=original.copy();tr={'frame':i}
 # Background at the logo is locally uniform; preserve underlying faint grid.
 f[18:104,20:310]=f[108:194,20:310]
 if i<22:
  # Smooth cubic continuation of the gradient behind the original title.
  x0,x1,y0,y1=300,1600,418,692
  a=f[y0,x0:x1].astype(float);b=f[y1,x0:x1].astype(float)
  da=(a-f[y0-30,x0:x1].astype(float))/30;db=(f[y1+30,x0:x1].astype(float)-b)/30
  t=np.linspace(0,1,y1-y0)[:,None,None];h=y1-y0
  fill=(2*t**3-3*t**2+1)*a+(t**3-2*t**2+t)*h*da+(-2*t**3+3*t**2)*b+(t**3-t**2)*h*db
  f[y0:y1,x0:x1]=np.uint8(np.clip(fill,0,255))
 elif 45<=i<72:
  # Recover the input's left border from its darkest vertical edge.
  left=int(np.argmin(original[570,200:1000].mean(1))+200)
  scale=min(1.025,max(.72,(665-(495 if i<53 else 484))/181))
  # Top edge moves gently upward during zoom; text remains inside its outline.
  header=bbox(original,(max(350,left+100),390,1920,472),230)
  tr['promptLeft']=left
  tr['promptScale']=float(np.interp(i,[45,50,53,60,66,71],[.72,.8,.91,1,1.02,1.025]))
  tr['headingY']=float(np.interp(i,[45,50,53,60,66,71],[473,470,462,453,451,451]))
  # Remove complete text rows, keeping both vertical borders intact.
  hx=max(250,left+70);f[392:478,hx:1920]=original[385:386,hx:1920]
  tx=left+30;end=min(1919,left+1200);start=498 if i<50 else 505
  f[start:582,tx:end]=original[583:584,tx:end]
 elif 72<=i<107:
  # Locate left blue border on the flat middle of the input outline.
  row=original[555].astype(int)
  left=int(np.argmax((row[:,0]-row[:,2])[300:1000])+300)
  tr['left']=left
  clear_rect(f,(left+65,442,1919,545))
 elif 134<=i<161:
  col=original[80:350,1850];active=np.where(col.min(1)>249)[0]
  cardtop=int(active[0]+80) if len(active) else 125
  offset=cardtop-125;tr['resultOffset']=offset
  heading=bbox(original,(455,cardtop+35,1200,cardtop+118),225);tr['heading']=heading
  if heading:clear_rect(f,(470,heading[1]-16,1240,heading[3]+16))
  for r in range(3):clear_rect(f,(785,330+offset+r*196,1770,452+offset+r*196))
 elif i>=161:
  clear_rect(f,(825,490,1110,574))
 cv2.imwrite(str(OUT/f'{i:03d}.png'),f,[cv2.IMWRITE_PNG_COMPRESSION,3])
 tracks.append(tr)
(ROOT/'assets/tracks.js').write_text('window.referenceTracks='+json.dumps(tracks,default=int)+';\n')
print('Built 180 measured reference plates')
