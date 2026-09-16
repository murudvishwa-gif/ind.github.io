const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
let chromium;
try { ({chromium} = require('playwright')); } catch { ({chromium} = require(path.join(process.env.TEMP,'industrial-responsive-tools/node_modules/playwright'))); }
(async () => {
 const server = http.createServer((req,res) => {
  const file=path.join(process.cwd(),req.url.split('?')[0]);
  if(!fs.existsSync(file)) {res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp'})[path.extname(file)] || 'text/plain');res.end(fs.readFileSync(file));
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage({reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/signup.html');
  await page.locator('[type=submit]').click();assert(page.url().endsWith('signup.html'));
  for(const [name,value] of Object.entries({'first-name':'Vishwa','last-name':'Kumar',email:'vishwa@example.com',password:'Example123!',confirm:'Mismatch123!'})) await page.locator(`[name="${name}"]`).fill(value);
  await page.locator('[name=terms]').check();await page.locator('[type=submit]').click();assert(page.url().endsWith('signup.html'));
  await page.locator('[name=confirm]').fill('Example123!');await page.locator('[type=submit]').click();await page.waitForURL('**/login.html');
  for(const role of ['user','admin']) {
   await page.goto(base+'/login.html');await page.locator('[name=email]').fill('vishwa@example.com');await page.locator('[name=password]').fill('Example123!');await page.locator(`[name=role][value=${role}]`).check();await page.locator('[type=submit]').click();await page.waitForURL(`**/${role}-dashboard.html`);
   assert.equal(await page.locator('.profile-identity').isVisible(),false);
   await page.locator('.profile-toggle').click();
   assert.match(await page.locator('.profile-identity').innerText(),/Vishwa Kumar\nvishwa@example.com/);
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('.profile-identity').isVisible(),false);
   const views=await page.locator('.sidebar [data-view]').evaluateAll(els=>els.map(e=>e.dataset.view));
   for(const view of views) {await page.locator(`.sidebar [data-view=${view}]`).click();assert.equal(await page.locator('.dashboard-extras .panel').count(),2);}
   await page.locator('.sidebar [data-view=overview]').click();await page.locator('#content button').first().click();await page.waitForURL('**/404.html');
  }
  for(const file of ['login.html','signup.html']) {await page.goto(base+'/'+file);await page.locator('[data-provider]').first().click();await page.waitForURL('**/404.html');}
  await page.goto(base+'/blogs.html');await page.locator('form[data-form=newsletter] input[type=email]').fill('vishwa@example.com');await page.locator('form[data-form=newsletter] button').click();await page.waitForURL('**/404.html');
  await page.goto(base+'/contact.html');
  await page.locator('form[data-form=contact]').evaluate(form=> {for(const input of form.querySelectorAll('input,textarea,select')) {if(input.type==='email') input.value='vishwa@example.com';else if(input.type==='tel') input.value='9876543210';else if(input.type==='checkbox') input.checked=true;else if(input.tagName==='SELECT') input.selectedIndex=1;else input.value='Manufacturing project details';} });
  await page.locator('form[data-form=contact] button[type=submit]').click();await page.waitForURL('**/404.html');
  await page.goto(base+'/about.html');await page.locator('.portrait').first().scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('.portrait')].every(e=>e.complete && e.naturalWidth>0));
  assert(await page.locator('.portrait').evaluateAll(els=>els.every(e=>e.naturalWidth>=e.clientWidth && e.naturalHeight>=e.clientHeight)));
  console.log('Team portraits load at their native 160px size without upscaling.');
  await page.goto(base+'/index.html');await page.evaluate(()=>scrollTo(0,1500));assert.equal(await page.locator('.header').evaluate(el=>el.getBoundingClientRect().top),0);
  await page.locator('.why-choose').screenshot({path:path.join(process.env.TEMP,'stackly-why.png')});
  assert.deepEqual(errors,[]);console.log('PASS: validation, signup, both login roles, profile display, all dashboard views, action redirects, newsletter, inquiry and sticky header.');
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
