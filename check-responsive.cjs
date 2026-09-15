const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require(path.join(process.env.TEMP, 'industrial-responsive-tools/node_modules/playwright')); }
const { chromium } = playwright;
const root = process.cwd();
const files = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const issues = [];
(async () => {
 const server = http.createServer((req,res) => {
  const name = decodeURIComponent(req.url.split('?')[0]);
  const target = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) { res.writeHead(404); res.end(); return; }
  const type = {'.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp'}[path.extname(target)] || 'application/octet-stream';
  res.setHeader('Content-Type',type); res.end(fs.readFileSync(target));
 });
 await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
 const base = 'http://127.0.0.1:' + server.address().port;
 const browser = await chromium.launch({channel:'chrome',headless:true});
 try {
  const page = await browser.newPage({reducedMotion:'reduce'});
  page.on('pageerror', e => issues.push(e.message));
  for (const width of (process.argv.includes('--motion-only') ? [] : [320,390,768,1024,1440,1920])) {
   await page.setViewportSize({width,height:900});
   for (const file of files) {
    await page.goto(base + '/' + file);
    const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => {
     if (el.closest('.table-wrap') || el.tagName === 'SCRIPT' || getComputedStyle(el).display === 'none') return false;
     const r = el.getBoundingClientRect();
     return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) && !el.closest('.auth-art');
    }).map(el => el.tagName + '.' + el.className).slice(0,8));
    if (overflow.length) issues.push(`${file} @${width}: ${overflow.join(', ')}`);
    if (await page.locator('.header-auth').count()) {
     if (!await page.locator('.header-auth a').first().isVisible()) issues.push(`${file} @${width}: hidden account buttons`);
     if (width <= 1000) {
      await page.locator('.menu-toggle').click();
      if (!await page.locator('.navigation').isVisible()) issues.push(`${file}: menu did not open`);
      await page.locator('.navigation a').first().click();
     }
    }
   }
   console.log('Checked 17 pages at ' + width + 'px');
  }
  await page.setViewportSize({width:390,height:844});
  for (const file of ['user-dashboard.html','admin-dashboard.html']) {
   await page.goto(base + '/' + file);
   for (const view of ['projects','requests','billing','settings']) {
    if (!await page.locator('.sidebar [data-view="'+view+'"]').count()) continue;
    await page.locator('.mobile-menu').click();
    await page.locator('.sidebar [data-view="'+view+'"]').click();
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) issues.push(file + ' overflow: ' + view);
   }
  }
  await page.emulateMedia({reducedMotion:'no-preference'});
  for (const width of [390,1440]) {
   await page.setViewportSize({width,height:900});
   await page.goto(base + '/index.html');
   await page.waitForTimeout(1200);
   if (!await page.evaluate(() => window.gsap && window.ScrollTrigger && ScrollTrigger.getAll().length > 0)) issues.push('GSAP not initialized');
   await page.locator('.testimonials').scrollIntoViewIfNeeded();
   await page.waitForTimeout(1200);
   if (await page.locator('.testimonial-card').first().evaluate(el => getComputedStyle(el).opacity) !== '1') issues.push('Reveal incomplete');
   await page.screenshot({path:path.join(process.env.TEMP, 'industrial-'+width+'.png'),fullPage:true});
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.waitForFunction(() => !document.querySelector('.scroll-progress'));
   if (await page.locator('.scroll-progress').count()) issues.push('Reduced motion did not clean up');
   await page.emulateMedia({reducedMotion:'no-preference'});
  }
  await page.route('**/assets/vendor/**',route=>route.abort());
  await page.goto(base + '/about.html');
  await page.waitForTimeout(800);
  if (!await page.locator('h1').isVisible()) issues.push('Fallback heading hidden');
  const noJS = await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await noJS.goto(base + '/index.html');
  if (!await noJS.locator('h1').isVisible() || !await noJS.locator('.header-auth').isVisible()) issues.push('No-JavaScript content hidden');
  await noJS.close();
  console.log(issues.length ? issues.join('\n') : 'PASS: layouts, menus, dashboard views, GSAP reveals, reduced motion, and fallback.');
  if (issues.length) process.exitCode=1;
 } finally { await browser.close(); server.close(); }
})();
