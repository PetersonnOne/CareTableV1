// Run only against CareTable's selected development deployment, never another app.
import {generateKeyPair,exportPKCS8,exportJWK} from 'jose';
import {readFile,writeFile,mkdir,unlink} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const local=await readFile('.env.local','utf8');
if(!/^CONVEX_DEPLOYMENT=dev:/m.test(local))throw new Error('Select the CareTable cloud dev deployment first.');
const existing=spawnSync(process.execPath,['--use-system-ca','node_modules/convex/bin/main.js','env','get','JWKS'],{encoding:'utf8'});
if(existing.status===0&&existing.stdout.trim()){console.log('Auth signing keys already exist; preserving them.');process.exit(0);}
const pair=await generateKeyPair('RS256',{extractable:true});
const privateKey=(await exportPKCS8(pair.privateKey)).trimEnd().replace(/\n/g,' ');
const jwks=JSON.stringify({keys:[{use:'sig',...await exportJWK(pair.publicKey)}]});
await mkdir('.private',{recursive:true});const file='.private/auth-setup.env';
await writeFile(file,`JWT_PRIVATE_KEY="${privateKey}"\nJWKS=${jwks}\nSITE_URL=http://localhost:4317\n`,{mode:0o600});
const run=spawnSync(process.execPath,['--use-system-ca','node_modules/convex/bin/main.js','env','set','--from-file',file],{encoding:'utf8'});
if(run.status!==0){console.log('Auth setup failed. The private setup file is retained locally; no credential was printed.');process.exitCode=1;}
else{await unlink(file);console.log('Auth signing keys and SITE_URL configured. Private temporary file removed.');}
