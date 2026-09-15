(() => {
  const admin = document.body.dataset.role === 'admin';
  const content = document.getElementById('content');
  const key = 'stackly-demo-' + (admin ? 'admin' : 'user');
  const defaults = { requests: [], name: admin ? 'Alex Morgan' : 'Jordan Lee', company: 'Northstar Manufacturing' };
  let saved;
  try { saved = JSON.parse(localStorage.getItem(key)); } catch {}
  const state = { ...defaults, ...(saved && typeof saved === 'object' ? saved : {}) };
  if (!Array.isArray(state.requests)) state.requests = [];
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = message => { document.getElementById('toast').textContent = message; clearTimeout(toast.timer); toast.timer = setTimeout(() => document.getElementById('toast').textContent = '', 4500); };
  const persist = () => { try { localStorage.setItem(key, JSON.stringify(state)); return true; } catch { toast('Saved for this visit only. Browser storage is unavailable.'); return false; } };
  const projects = [
    ['PRJ-2041', 'Precision drive shafts', 'Northstar Manufacturing', 'CNC Machining', 'In production', '24 Sep 2026', '$12,450'],
    ['PRJ-2040', 'Structural steel frames', 'Vertex Industries', 'Metal Fabrication', 'Completed', '20 Sep 2026', '$8,600'],
    ['PRJ-2039', 'Pump housing prototype', 'Northstar Manufacturing', 'Product Engineering', 'Review', '28 Sep 2026', '$3,200'],
    ['PRJ-2038', 'Conveyor brackets', 'Atlas Engineering', 'Metal Fabrication', 'In production', '26 Sep 2026', '$5,850'],
    ['PRJ-2037', 'Valve assemblies', 'Northstar Manufacturing', 'CNC Machining', 'Completed', '18 Sep 2026', '$7,400']
  ].filter(row => admin || row[2] === 'Northstar Manufacturing');
  const invoices = [['INV-1041','Precision drive shafts','$12,450','Pending'],['INV-1040','Structural steel frames','$8,600','Paid'],['INV-1039','Pump housing prototype','$3,200','Pending'],['INV-1037','Valve assemblies','$7,400','Paid']].filter(row => admin || row[0] !== 'INV-1040');
  const team = [['Alex Morgan','alex@example.com','Administrator','Active'],['Sam Rivera','sam@example.com','Production lead','Active'],['Casey Chen','casey@example.com','Quality engineer','Active'],['Taylor Reed','taylor@example.com','Project manager','Active']];
  const status = text => `<span class="status ${esc(text.toLowerCase().replaceAll(' ','-'))}">${esc(text)}</span>`;
  const table = (headers, rows) => `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${headers.length}" class="empty">No matching records.</td></tr>`}</tbody></table></div>`;
  let view = 'overview';
  let visibleRows = [];
  const heading = (title, description, action = '') => `<div class="page-heading"><div><h1>${title}</h1><p>${description}</p></div>${action}</div>`;
  const projectRows = rows => rows.map(r=>[esc(r[0]),esc(r[1]),...(admin?[esc(r[2])]:[]),esc(r[3]),status(r[4]),esc(r[5])]);
  const projectHeaders = ['Project ID','Project',...(admin?['Client']:[]),'Service','Status','Delivery'];
  function overview(period = 'month') {
    const metrics = admin ? [['Total revenue','$45,231','12.8% above previous month','chart-no-axes-column'],['Active projects','24','6 approaching delivery','cog'],['Quote requests',String(12+state.requests.length),'4 awaiting review','tag'],['Team members','18','Across 4 departments','headset']] : [['Active projects','2','1 currently in production','cog'],['Open requests',String(2+state.requests.length),'Your quotation pipeline','tag'],['Outstanding invoices','$15,650','2 invoices awaiting payment','chart-no-axes-column'],['Completed projects','12','4 delivered this quarter','badge-check']];
    const values = period === 'month' ? [38,52,43,67,49,72,61,90,76,68,87,96] : [30,65,42,78,55,89,70];
    const labels = period === 'month' ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    content.innerHTML = heading(admin?'Dashboard':'My workspace',admin?'A clear view of your manufacturing operations.':'Welcome back. Here is the latest on your projects.',admin?'<button id="export" class="primary">Download report</button>':'<button data-request class="primary">Request a quote</button>') + `<div class="tabs"><button class="active" data-view="overview">Overview</button><button data-view="projects">Projects</button><button data-view="billing">${admin?'Revenue':'Billing'}</button></div><div class="stats">${metrics.map(([label,value,detail,icon])=>`<article class="stat"><div class="stat-label">${label}<img src="assets/icons/${icon}.webp" alt="" width="17" height="17"></div><strong>${value}</strong><small>${detail}</small></article>`).join('')}</div><div class="overview-grid"><section class="panel"><div class="panel-title"><div><h2>${admin?'Revenue overview':'Project activity'}</h2><p>${admin?'Illustrative revenue trend':'Completed production milestones'}</p></div><select id="period" aria-label="Chart period"><option value="month" ${period==='month'?'selected':''}>Monthly</option><option value="week" ${period==='week'?'selected':''}>Weekly</option></select></div><div class="chart" role="img" aria-label="${values.map((v,i)=>labels[i]+': '+v+(admin?' thousand dollars':' milestones')).join(', ')}">${values.map((v,i)=>`<div class="bar-group"><div class="bar" style="height:${v}%" title="${labels[i]}: ${v}"></div><span>${labels[i]}</span></div>`).join('')}</div><p class="chart-caption">${admin?'Revenue in USD thousands':'Milestones completed'} · Sample data</p></section><section class="panel"><div class="panel-title"><div><h2>${admin?'Recent activity':'Project updates'}</h2><p>Latest updates from the production floor.</p></div></div>${[['NS','Drive shaft production started','CNC Machining','Today'],['QA','Quality inspection completed','Valve assemblies','1 day ago'],['PE','Engineering review scheduled','Pump housing prototype','2 days ago'],['RF','Quotation ready for review','Manufacturing services','3 days ago']].map(([initials,t,d,time])=>`<div class="activity-item"><span class="avatar">${initials}</span><div><strong>${t}</strong><p>${d}</p></div><small>${time}</small></div>`).join('')}</section></div><section class="panel"><div class="panel-title"><div><h2>Recent projects</h2><p>Track progress across your manufacturing work.</p></div><button data-view="projects">View all</button></div>${table(projectHeaders,projectRows(projects.slice(0,4)))}</section>`;
    visibleRows = projects;
    document.getElementById('period').addEventListener('change', e => overview(e.target.value));
  }
  function records() {
    const config = view==='projects' ? {title:admin?'All projects':'My projects',headers:projectHeaders,rows:projects,format:projectRows} : view==='billing' ? {title:admin?'Revenue & invoices':'Invoices',headers:['Invoice','Project','Amount','Status'],rows:invoices,format:rows=>rows.map(r=>[...r.slice(0,3).map(esc),status(r[3])])} : view==='team' ? {title:'Team members',headers:['Name','Email','Role','Status'],rows:team,format:rows=>rows.map(r=>[...r.slice(0,3).map(esc),status(r[3])])} : {title:admin?'Quote requests':'My requests',headers:['Request','Project','Service','Status'],rows:[['RFQ-301','Custom mounting plates','Metal Fabrication','Review'],['RFQ-302','Rotor prototype','Product Engineering','Pending'],...state.requests.map((r,i)=>['RFQ-'+(303+i),r.name,r.service,'Pending'])],format:rows=>rows.map(r=>[...r.slice(0,3).map(esc),status(r[3])])};
    content.innerHTML = heading(config.title,'Search and review your demo workspace records.',view==='requests'?'<button data-request class="primary">New request</button>':'<button id="export" class="primary">Export CSV</button>') + `<section class="panel"><div class="toolbar"><input id="search" type="search" placeholder="Search records..." aria-label="Search records"><select id="status-filter" aria-label="Filter by status"><option>All statuses</option>${[...new Set(config.rows.map(r=>r[view==='projects'?4:3]))].map(s=>`<option>${esc(s)}</option>`).join('')}</select></div><p id="result-count" role="status" style="margin-bottom:14px"></p><div id="records"></div></section>`;
    const update = () => { const term=document.getElementById('search').value.toLowerCase();const filter=document.getElementById('status-filter').value;visibleRows=config.rows.filter(r=>r.join(' ').toLowerCase().includes(term)&&(filter==='All statuses'||r[view==='projects'?4:3]===filter));document.getElementById('records').innerHTML=table(config.headers,config.format(visibleRows));document.getElementById('result-count').textContent=visibleRows.length+' records'; };
    document.getElementById('search').addEventListener('input',update);document.getElementById('status-filter').addEventListener('change',update);update();
  }
  function render(next) {
    view = ['overview','projects','requests','billing','settings',...(admin?['team']:[])].includes(next) ? next : 'overview';
    document.querySelectorAll('.sidebar [data-view]').forEach(b=>{if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    document.getElementById('breadcrumb').textContent=view[0].toUpperCase()+view.slice(1);
    if(view==='overview')overview();
    else if(view==='settings') {content.innerHTML=heading('Settings','Personalize this local demo workspace.')+`<section class="panel"><h2>Profile details</h2><form id="settings-form" class="settings-form"><label>Display name<input name="name" value="${esc(state.name)}" required maxlength="80"></label><label>Company<input name="company" value="${esc(state.company)}" required maxlength="100"></label><button class="primary">Save changes</button></form></section>`;document.getElementById('settings-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.target);state.name=data.get('name');state.company=data.get('company');if(persist())toast('Profile saved on this browser.');});}
    else records();
    document.getElementById('sidebar').classList.remove('open');document.querySelector('.mobile-menu').setAttribute('aria-expanded','false');
    document.dispatchEvent(new Event('dashboard:view'));
  }
  document.addEventListener('click',event=>{
    const nav=event.target.closest('[data-view]');if(nav){render(nav.dataset.view);return;}
    if(event.target.closest('[data-request]'))document.getElementById('request-dialog').showModal();
    if(event.target.closest('#export')){const csv=visibleRows.map(r=>r.map(c=>'"'+String(c).replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='stackly-'+view+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Demo report downloaded.');}
  });
  document.getElementById('cancel-request').onclick=()=>document.getElementById('request-dialog').close();
  document.getElementById('request-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.target);state.requests.push({name:data.get('name'),service:data.get('service'),details:data.get('details')});const stored=persist();event.target.reset();document.getElementById('request-dialog').close();render('requests');if(stored)toast('Request saved locally. It has not been sent to Stackly.');});
  document.querySelector('.mobile-menu').onclick=event=>{const open=document.getElementById('sidebar').classList.toggle('open');event.currentTarget.setAttribute('aria-expanded',String(open));};
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.getElementById('sidebar').classList.remove('open');document.querySelector('.mobile-menu').setAttribute('aria-expanded','false');}});
  render('overview');
})();
