const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const path=require('node:path'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())});
 const url=pathToFileURL(path.join(__dirname,'index.html')).href;
 let screens=0;
 for(const width of [1440,400]) for(const lang of ['en','el']) for(const direction of ['a','b']) for(const state of ['default','loading','empty','error','mixed','overlap','stale']) {
  await page.setViewportSize({width,height:1000});
  await page.goto(`${url}?lang=${lang}&direction=${direction}&state=${state}`);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth)<=width,`overflow ${width}/${lang}/${direction}/${state}`);
  if(state==='mixed') assert(await page.locator('#create').isDisabled());
  screens++;
 }
 await page.goto(url);
 assert.equal(await page.locator('[data-row]:checked').count(),0);
 await page.locator('#notes').fill('Retain this note');
 await page.locator('[data-row="r1"]').check();
 await page.locator('#refresh').click();
 assert.equal(await page.locator('#notes').inputValue(),'Retain this note');
 assert(await page.locator('[data-row="r1"]').isChecked());
 assert.equal(await page.locator('[data-row="r3"]').isChecked(),false);
 await page.goto(`${url}?state=stale`);
 assert(await page.locator('[data-row="r2"]').isChecked());
 await page.locator('#refresh').click();
 assert.equal(await page.locator('[data-row="r2"]:checked').count(),0);
 await page.goto(url);
 await page.setViewportSize({width:1440,height:1000});
 await page.screenshot({path:path.join(__dirname,'desktop.png'),fullPage:true});
 await page.goto(`${url}?lang=el&direction=a`);
 await page.setViewportSize({width:400,height:900});
 await page.screenshot({path:path.join(__dirname,'mobile.png'),fullPage:true});
 assert.deepEqual(errors,[]); assert.deepEqual(requests,[]);
 console.log(JSON.stringify({screens,errors,externalRequests:requests,checks:['empty initial selection','mixed currency blocked','refresh preserves fields and selection','new eligibility unselected','stale selection removed']}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

