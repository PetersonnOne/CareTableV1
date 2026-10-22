import { readFile,writeFile,unlink } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const local=await readFile('.env.local','utf8');
if(!/^CONVEX_DEPLOYMENT=dev:outstanding-crocodile-717/m.test(local))throw new Error('Refusing to configure an unexpected deployment.');
const names=['OPENAI_API_KEY','QLOO_API_KEY'];
const lines=names.map(name=>{const value=process.env[name];if(!value)throw new Error(`${name} is missing.`);return `${name}=${JSON.stringify(value)}`;});
const file='.private/provider-setup.env';await writeFile(file,lines.join('\n'),{mode:0o600});
try{const result=spawnSync(process.execPath,['--use-system-ca','node_modules/convex/bin/main.js','env','set','--from-file',file],{encoding:'utf8'});if(result.status!==0)throw new Error('Provider configuration failed; existing values were not overwritten.');console.log('Provider credentials configured on the CareTable dev deployment. No values displayed.');}finally{await unlink(file);}
