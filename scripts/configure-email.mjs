import {readFile,writeFile,unlink} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const local=await readFile('.env.local','utf8');if(!/^CONVEX_DEPLOYMENT=dev:outstanding-crocodile-717/m.test(local))throw new Error('Unexpected deployment.');
if(!process.env.RESEND_API_KEY||!process.env.RESEND_FROM){console.log('Resend key and sender are not both configured yet.');process.exitCode=1;}
else{const file='.private/email-setup.env';await writeFile(file,`RESEND_API_KEY=${JSON.stringify(process.env.RESEND_API_KEY)}\nRESEND_FROM=${JSON.stringify(process.env.RESEND_FROM)}\n`,{mode:0o600});try{const run=spawnSync(process.execPath,['--use-system-ca','node_modules/convex/bin/main.js','env','set','--from-file',file],{encoding:'utf8'});if(run.status!==0)throw new Error('Email configuration failed; existing settings not overwritten.');console.log('Resend configured on the CareTable dev deployment. No key displayed.');}finally{await unlink(file);}}
