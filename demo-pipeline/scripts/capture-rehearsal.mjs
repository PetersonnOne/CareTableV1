// CareTable R0: real browser UI, fictional sample, no paid generation or voice.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const url=process.env.CARETABLE_DEMO_URL||'http://localhost:4318';
if(!['localhost','127.0.0.1'].includes(new URL(url).hostname))throw Error('R0 must use a local app, not production');
async function exists(p){try{await fs.access(p);return true;}catch{return false;}}
let pkg=process.env.PLAYWRIGHT_PACKAGE;
if(!pkg){
 try{pkg=createRequire(import.meta.url).resolve('playwright/package.json');}catch{
  const cache=path.join(process.env.LOCALAPPDATA,'npm-cache','_npx');
  for(const dir of await fs.readdir(cache)){const candidate=path.join(cache,dir,'node_modules','playwright','package.json');if(await exists(candidate)){pkg=candidate;break;}}
 }
}
if(!pkg)throw Error('Set PLAYWRIGHT_PACKAGE to installed Playwright package.json');
const {chromium}=createRequire(pkg)('playwright');
let executable=process.env.CHROMIUM_EXECUTABLE;
if(!executable){
 const cache=path.join(process.env.LOCALAPPDATA,'ms-playwright');
 for(const dir of (await fs.readdir(cache)).filter(d=>/^chromium-\d+$/.test(d)).sort().reverse()){
  const candidate=path.join(cache,dir,'chrome-win64','chrome.exe');if(await exists(candidate)){executable=candidate;break;}
 }
}
if(!executable)throw Error('Set CHROMIUM_EXECUTABLE to installed Chromium');
const take=path.join(root,'work','rehearsals',new Date().toISOString().replace(/[:.]/g,'-'));
await fs.mkdir(take,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:executable});
const context=await browser.newContext({viewport:{width:1280,height:720},recordVideo:{dir:take,size:{width:1280,height:720}},reducedMotion:'reduce'});
const page=await context.newPage();page.setDefaultTimeout(60000);page.setDefaultNavigationTimeout(90000);
const video=page.video(),events=[],errors=[];const started=Date.now();let status='failed';
page.on('pageerror',e=>errors.push(e.message));
await context.addInitScript(()=>{localStorage.setItem('caretable-guest-theme','midnight');window.__micRequests=0;if(navigator.mediaDevices){navigator.mediaDevices.getUserMedia=async()=>{window.__micRequests++;throw Error('Microphone disabled in preview rehearsal');};}});
// Fail closed if a selector change ever attempts provider work.
await context.route('**/api.openai.com/**',route=>route.abort());
await context.route('**/api.qloo.com/**',route=>route.abort());
async function beat(label,locator,hold=3500){
 if(locator)await locator.scrollIntoViewIfNeeded();
 events.push({wallSeconds:(Date.now()-started)/1000,label});
 await page.evaluate(text=>{let el=document.getElementById('rehearsal-label');if(!el){el=document.createElement('div');el.id='rehearsal-label';el.style.cssText='position:fixed;bottom:10px;left:10px;z-index:99999;max-width:85vw;padding:8px 12px;background:#10212b;color:#f7f5ec;border:1px solid #dbb482;border-radius:8px;font:12px Arial;pointer-events:none';document.body.append(el);}el.textContent='REHEARSAL R0 · LOCAL PREVIEW · '+text;},label);
 await page.waitForTimeout(hold);
 console.log(label);
}
try{
 await page.goto(url,{waitUntil:'networkidle'});
 await beat('Care begins with your people',page.locator('.home-hero'),4500);
 await page.getByRole('link',{name:/Find your place at the table/}).click();
 await page.getByRole('button',{name:'Interactive Mode',exact:true}).waitFor();
 await beat('Two ways to plan; voice is not verified',page.locator('.mode-guidance'),4000);
 await page.getByRole('button',{name:'Try a fictional sample',exact:true}).click();
 await page.getByText('Fictional sample loaded.',{exact:false}).waitFor();
 await page.getByRole('button',{name:'User Mode',exact:true}).click();
 await beat('Fictional preferences and exclusions',page.locator('.member-card').first(),5000);
 await page.getByRole('button',{name:'Next: plan your meals'}).click();
 await beat('Review the planning settings',page.locator('#plan-settings'),4500);
 await page.getByRole('checkbox',{name:'I have reviewed every'}).check();
 await page.getByRole('button',{name:'Local preview',exact:true}).click();
 await page.getByRole('heading',{name:'Your 3-day table.',exact:true}).waitFor();
 await beat('Preview meals; no Qloo or OpenAI request',page.locator('.plan-title'),5500);
 const checks=page.getByText('See every check',{exact:true}).first();if(await checks.count()){await checks.click();await beat('Listed checks and honest unknowns',checks,4500);}
 await beat('Feedback request draft, not a live revision',page.locator('#meal-improvements'),3500);
 await page.getByRole('button',{name:'Make it quicker',exact:true}).click();
 await beat('Review the request before applying',page.locator('.chat-request'),4000);
 await beat('Your table in numbers',page.locator('.companion-dashboard'),3500);
 await page.screenshot({path:path.join(take,'review-frame.png')});
 if(errors.length)throw Error('Browser page errors during rehearsal');
 if(await page.evaluate(()=>window.__micRequests)!==0)throw Error('Unexpected microphone attempt');
 await page.getByRole('button',{name:'Reset sample / local draft',exact:true}).click();
 status='captured';
}catch(e){errors.push(e.message);console.error('Rehearsal failed:',e.message);process.exitCode=1;}
finally{
 await context.close();await browser.close();
 const file=await video.path();
 const report={status,take:'R0',silent:true,previewOnly:true,voiceVerified:false,liveIntegrationsVerified:false,rawVideo:path.relative(take,file),eventsTiming:'wall-clock locator only; inspect media PTS before editing',events,errors};
 await fs.writeFile(path.join(take,'capture.json'),JSON.stringify(report,null,2));
 await fs.writeFile(path.join(root,'work','latest-rehearsal.json'),JSON.stringify({take:path.relative(root,take),status},null,2));
 console.log(JSON.stringify({status,take}));
}
