import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const hash=file=>execFileSync('ffmpeg',['-v','error','-i',file,'-map','0:v:0','-f','hash','-hash','sha256','-'],{cwd:root,encoding:'utf8'}).trim();
const expected=hash('examples/chatgpt-blue.mp4'),actual=hash('output/chatgpt-blue.mp4');
console.log(JSON.stringify({expected,actual,decodedFramesMatch:expected===actual},null,2));
if(expected!==actual){console.error('Decoded frames differ. See README for browser/platform rasterization limits or check whether the composition was edited.');process.exitCode=1}
