import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {execFileSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
const env={...process.env,HYPERFRAMES_NO_TELEMETRY:'1',PRODUCER_FORCE_SCREENSHOT:'true',PRODUCER_EXPERIMENTAL_FAST_CAPTURE:'false'};
// Prefer an existing Chrome. The CLI can also discover a browser installed by `hyperframes browser ensure`.
if(!env.HYPERFRAMES_BROWSER_PATH&&process.platform==='darwin'&&fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'))env.HYPERFRAMES_BROWSER_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if(env.HYPERFRAMES_BROWSER_PATH)env.PRODUCER_HEADLESS_SHELL_PATH=env.HYPERFRAMES_BROWSER_PATH;
const run=(exe,args)=>execFileSync(exe,args,{cwd:root,env,stdio:'inherit'});
run(process.execPath,['scripts/check.mjs']);run('ffmpeg',['-version']);run('ffprobe',['-version']);
run(process.execPath,['node_modules/hyperframes/bin/hyperframes.mjs','lint','.']);
// Isolated work directory prevents stale frames from a previous render entering this export.
fs.mkdirSync(path.join(root,'output'),{recursive:true});const work=fs.mkdtempSync(path.join(root,'output','render-'));const frames=path.join(work,'frames');
run(process.execPath,['node_modules/hyperframes/bin/hyperframes.mjs','render','.','--fps','24','--format','png-sequence','--quality','high','--workers','1','--low-memory-mode','--frames-cache-dir','off','--no-browser-gpu','--no-best-effort','--output',frames]);
const files=fs.readdirSync(frames).filter(x=>/^frame_\d{6}\.png$/.test(x)).sort();
if(files.length!==360||files[0]!=='frame_000001.png'||files[359]!=='frame_000360.png')throw new Error('Expected precisely 360 rendered frames.');
const partial=path.join(work,'video.mp4');
run('ffmpeg',['-v','error','-y','-framerate','24','-start_number','1','-i',path.join(frames,'frame_%06d.png'),'-i','assets/reference.m4a','-map','0:v:0','-map','1:a:0','-vf','scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p','-c:v','libx264','-crf','16','-preset','medium','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:a','copy','-movflags','+faststart',partial]);
run(process.execPath,['scripts/verify.mjs',partial]);
fs.copyFileSync(partial,path.join(root,'output','chatgpt-blue.mp4'));fs.rmSync(work,{recursive:true,force:true});
console.log('Verified output/chatgpt-blue.mp4');
