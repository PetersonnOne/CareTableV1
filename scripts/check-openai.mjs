import {readFile} from 'node:fs/promises';
const env=Object.fromEntries((await readFile('.env.local','utf8')).split(/\r?\n/).filter(l=>/^[A-Z_]+=/.test(l)).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1).trim()]}));
if(!env.OPENAI_API_KEY)throw new Error('OPENAI_API_KEY is not configured.');
const response=await fetch(`https://api.openai.com/v1/models/${env.OPENAI_MODEL||'gpt-6-luna'}`,{headers:{Authorization:`Bearer ${env.OPENAI_API_KEY}`},signal:AbortSignal.timeout(20000)});
console.log(JSON.stringify({model:env.OPENAI_MODEL||'gpt-6-luna',status:response.status,accessible:response.ok}));
if(!response.ok)process.exitCode=1;
