import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const font=new URL('assets/Switzer-Variable.woff2',root);
const source='https://cdn.fontshare.com/wf/HJHZ26OECMTXRH7JXPFC7EVIHDSLT2RA/LJRNLR7WCPF3PY3SZ7B2LHNUTQMFNCHL/4MCJYGQDIOOXHWSIIB2OYNDBEALJSOGN.woff2';
const expected='d1bf801ffb1a6096def70a7c532255722ad87d948b13a8a586e342f7091f8ee4';
const hash=b=>createHash('sha256').update(b).digest('hex');
let current;try{current=await fs.readFile(font)}catch(error){if(error.code!=='ENOENT')throw error}
if(current&&hash(current)===expected){console.log('Switzer font verified.');process.exit(0)}
if(!process.argv.includes('--accept-font-license'))throw new Error('Read https://www.fontshare.com/licenses/itf-ffl then run: npm run setup -- --accept-font-license. Alternatively download Switzer Variable from Fontshare and place the WOFF2 in assets/Switzer-Variable.woff2.');
const response=await fetch(source,{signal:AbortSignal.timeout(60000)});
if(!response.ok)throw new Error(`Font download failed: HTTP ${response.status}`);
const bytes=Buffer.from(await response.arrayBuffer());
if(hash(bytes)!==expected)throw new Error('Font hash changed. Refusing a silent font substitution.');
await fs.writeFile(font,bytes);console.log('Downloaded and verified Switzer from Fontshare.');
