import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets-manifest.json'),'utf8'));
for(const [name,expected] of Object.entries(manifest.files)){
 const p=path.resolve(root,name);if(!p.startsWith(root))throw new Error(`Invalid asset path: ${name}`);
 const actual=createHash('sha256').update(fs.readFileSync(p)).digest('hex');if(actual!==expected)throw new Error(`Asset hash mismatch: ${name}`);
}
const font=path.join(root,'assets/Switzer-Variable.woff2');
if(!fs.existsSync(font))throw new Error('Missing font. Run npm run setup -- --accept-font-license after reading the font license.');
const hash=createHash('sha256').update(fs.readFileSync(font)).digest('hex');if(hash!==manifest.font.sha256)throw new Error('Switzer font hash mismatch.');
console.log(`Verified ${Object.keys(manifest.files).length} bundled files and the downloaded font.`);
