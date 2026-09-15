const fs = require('node:fs');
const path = require('node:path');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let links = 0;
const issues = [];
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if (new Set(ids).size !== ids.length) issues.push(`${file}: duplicate IDs`);
  if ((html.match(/<h1[ >]/g)||[]).length !== 1) issues.push(`${file}: expected one h1`);
  for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url=m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const [target,hash] = url.split('#');
    const resolved=target ? target.replace(/^\//,'').split('?')[0] : file;
    links++;
    if(!fs.existsSync(resolved)) issues.push(`${file}: missing ${url}`);
    else if(hash && resolved.endsWith('.html')) {
      const text=fs.readFileSync(resolved,'utf8');
      if(!text.includes(`id="${hash}"`)) issues.push(`${file}: missing anchor ${url}`);
    }
  }
}
for(const m of fs.readFileSync('assets/pages.css','utf8').matchAll(/url\('([^']+)'\)/g)) {
  if(!fs.existsSync(path.join('assets',m[1]))) issues.push(`Missing CSS asset ${m[1]}`);
}
console.log(`Checked ${files.length} pages and ${links} local links/assets.`);
if(issues.length){console.error(issues.join('\n'));process.exitCode=1;}else console.log('All local links, assets, anchors, and page headings passed.');
