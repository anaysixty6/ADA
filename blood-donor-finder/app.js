import { GROUPS, COMPATIBLE, findMatches } from './algorithms.js';

const seed = [
  ['D101','Asha Demo','O-','North',1.2,1,true], ['D102','Ravi Demo','O+','Central',2.0,2,true],
  ['D103','Mina Demo','A-','East',3.1,3,true], ['D104','Dev Demo','B+','North',.8,1,true],
  ['D105','Tara Demo','AB+','West',4.0,5,false], ['D106','Neel Demo','O-','South',5.4,4,true],
  ['D107','Ira Demo','A+','Central',1.5,2,true], ['D108','Kabir Demo','B-','East',2.8,4,true],
  ['D109','Rhea Demo','AB-','West',6.0,6,false], ['D110','Arun Demo','O+','North',1.1,2,true],
  ['D111','Sana Demo','A-','South',4.2,5,true], ['D112','Veer Demo','B+','Central',3.6,3,true],
  ['D113','Maya Demo','AB+','East',2.2,2,true], ['D114','Om Demo','O-','West',7.1,7,true],
  ['D115','Nia Demo','A+','North',2.4,3,false], ['D116','Ish Demo','B-','South',3.7,2,true],
  ['D117','Zoya Demo','AB-','Central',5.0,6,true], ['D118','Adi Demo','O+','East',1.9,1,true],
  ['D119','Pia Demo','A-','West',4.6,3,true], ['D120','Kian Demo','B+','South',2.5,1,true],
  ['D121','Uma Demo','AB+','North',6.5,7,true], ['D122','Rey Demo','O-','Central',3.3,3,true],
  ['D123','Diya Demo','A+','East',5.2,5,true], ['D124','Avi Demo','B-','West',2.1,2,true],
  ['D125','Noor Demo','AB-','South',8.0,8,true], ['D126','Sam Demo','O+','Central',4.0,4,false],
  ['D127','Leah Demo','A-','North',3.4,4,true], ['D128','Milan Demo','B+','East',4.7,6,true],
  ['D129','Esha Demo','AB+','West',1.6,1,true], ['D130','Ari Demo','O-','South',6.3,5,true],
].map(([id,name,bloodGroup,location,distance,priority,available]) => ({id,name,bloodGroup,location,distance,priority,available}));

const STORE_KEY = 'bloodlink-donors-v1';
let donors = loadDonors();
function loadDonors() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (Array.isArray(saved) && saved.every(d => d.id && d.bloodGroup)) return saved;
  } catch { /* use the bundled fictional sample set */ }
  return structuredClone(seed);
}
function persist() { localStorage.setItem(STORE_KEY, JSON.stringify(donors)); renderStats(); renderRows(); }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2100); }
function setSelectOptions(id) { document.querySelector(`#${id}`).innerHTML = GROUPS.map(g => `<option value="${g}">${g}</option>`).join(''); }

function renderStats() {
  document.querySelector('#stat-total').textContent = donors.length;
  document.querySelector('#stat-available').textContent = donors.filter(d => d.available).length;
}
function renderRows() {
  const q = document.querySelector('#record-filter').value.trim().toLowerCase();
  const visible = donors.filter(d => [d.id,d.name,d.bloodGroup,d.location].some(v => String(v).toLowerCase().includes(q)));
  document.querySelector('#record-count').textContent = `${visible.length} of ${donors.length} records`;
  document.querySelector('#donor-rows').innerHTML = visible.map(d => `<tr>
    <td>${escapeHtml(d.id)}<div class="donor-sub">${escapeHtml(d.name)}</div></td><td><span class="blood-pill">${escapeHtml(d.bloodGroup)}</span></td>
    <td>${escapeHtml(d.location)}</td><td>${Number(d.distance).toFixed(1)} km</td><td>#${d.priority}</td>
    <td><span class="${d.available?'status-pill':''}">${d.available?'Available':'Unavailable'}</span></td>
    <td><button class="table-action" data-action="toggle" data-id="${escapeHtml(d.id)}">${d.available?'Set unavailable':'Set available'}</button><button class="table-action" data-action="edit" data-id="${escapeHtml(d.id)}">Edit</button><button class="table-action" data-action="delete" data-id="${escapeHtml(d.id)}">Delete</button></td>
  </tr>`).join('') || '<tr><td colspan="7">No donor records match that filter.</td></tr>';
}
function resultCard(d, i) { return `<div class="result-row"><span class="rank">${i+1}</span><div><div class="donor-title">${escapeHtml(d.name)}</div><div class="donor-sub">${escapeHtml(d.id)} · ${escapeHtml(d.location)} · ${escapeHtml(d.contact||'Contact not recorded')}</div></div><div class="result-cell"><span class="blood-pill">${escapeHtml(d.bloodGroup)}</span></div><div class="result-cell optional-cell">${Number(d.distance).toFixed(1)} km</div><div class="result-cell optional-cell">Priority #${d.priority}</div><span class="status-pill">Available</span></div>`; }

document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(t => { t.classList.toggle('active',t===button);t.setAttribute('aria-selected',String(t===button)); });
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('hidden',p.id !== `panel-${button.dataset.tab}`));
}));
setSelectOptions('required-group'); setSelectOptions('donor-group');
document.querySelector('#record-filter').addEventListener('input', renderRows);
document.querySelector('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  const group = document.querySelector('#required-group').value;
  const count = Math.max(1,Math.min(10,Number(document.querySelector('#needed-count').value)||1));
  const key = document.querySelector('#rank-by').value;
  const diversify = document.querySelector('#diversify').checked;
  const start = performance.now();
  const result = findMatches(donors,group,count,key,diversify);
  const elapsed = performance.now() - start;
  document.querySelector('#search-summary').textContent = `${result.candidates.length} compatible available donor${result.candidates.length===1?'':'s'} for ${group} · ${elapsed.toFixed(3)} ms`;
  const list = document.querySelector('#results');
  if (!result.selected.length) {
    list.className='results-empty'; list.innerHTML='<div class="empty-icon">⌕</div><h3>No compatible available donors found</h3><p>Try another blood group or add more demo records.</p>';
  } else {
    list.className='result-list'; list.innerHTML=result.selected.map(resultCard).join('');
    if (result.selected.length < count) list.insertAdjacentHTML('beforeend',`<div class="algorithm-note">Only <b>${result.selected.length}</b> of ${count} requested donors could be selected under the current constraints.</div>`);
  }
  const note = document.querySelector('#algorithm-note'); note.classList.remove('hidden');
  note.innerHTML = result.strategy === 'backtracking'
    ? `<b>Backtracking fallback used.</b> The top-ranked greedy set repeated a location. The search explored ${result.explored} states and found a location-diverse set of ${result.selected.length}. Candidate ordering stayed ${key === 'distance' ? 'closest-first' : key === 'priority' ? 'priority-first' : 'ID-first'}.`
    : `<b>Greedy selection used.</b> The first ${result.selected.length} ranked eligible donors ${result.selected.length===count?'satisfied':'were the best available'} selection. ${diversify?'Each selected donor is from a different location.':'Location diversity was turned off.'}`;
});

function resetForm() {
  document.querySelector('#donor-form').reset(); document.querySelector('#edit-id').value='';
  document.querySelector('#donor-distance').value='1'; document.querySelector('#donor-priority').value='1';
  document.querySelector('#save-donor').textContent='Add donor'; document.querySelector('#cancel-edit').classList.add('hidden');
}
document.querySelector('#donor-form').addEventListener('submit',event=>{
  event.preventDefault();
  const editing = document.querySelector('#edit-id').value;
  const id = document.querySelector('#donor-id').value.trim().toUpperCase();
  if (donors.some(d=>d.id.toLowerCase()===id.toLowerCase()&&d.id!==editing)) { toast('That donor ID already exists.');return; }
  const donor={id,name:document.querySelector('#donor-name').value.trim(),bloodGroup:document.querySelector('#donor-group').value,
    contact:document.querySelector('#donor-contact').value.trim(),
    location:document.querySelector('#donor-location').value.trim(),distance:Number(document.querySelector('#donor-distance').value),
    priority:Number(document.querySelector('#donor-priority').value),available:document.querySelector('#donor-available').checked};
  if(editing){donors=donors.map(d=>d.id===editing?donor:d);toast('Donor record updated.');}else{donors.push(donor);toast('Donor added to this browser.');}
  persist();resetForm();
});
document.querySelector('#cancel-edit').addEventListener('click',resetForm);
document.querySelector('#donor-rows').addEventListener('click',event=>{
  const button=event.target.closest('button[data-action]'); if(!button)return;
  const donor=donors.find(d=>d.id===button.dataset.id);if(!donor)return;
  if(button.dataset.action==='toggle'){donor.available=!donor.available;persist();toast('Availability updated.');}
  if(button.dataset.action==='delete'){donors=donors.filter(d=>d.id!==donor.id);persist();toast('Record removed.');}
  if(button.dataset.action==='edit'){
    document.querySelector('[data-tab="records"]').click();document.querySelector('#edit-id').value=donor.id;
    document.querySelector('#donor-id').value=donor.id;document.querySelector('#donor-name').value=donor.name;
    document.querySelector('#donor-contact').value=donor.contact||'';
    document.querySelector('#donor-group').value=donor.bloodGroup;document.querySelector('#donor-location').value=donor.location;
    document.querySelector('#donor-distance').value=donor.distance;document.querySelector('#donor-priority').value=donor.priority;
    document.querySelector('#donor-available').checked=donor.available;document.querySelector('#save-donor').textContent='Save changes';document.querySelector('#cancel-edit').classList.remove('hidden');
  }
});
document.querySelector('#reset-demo').addEventListener('click',()=>{donors=structuredClone(seed);persist();toast('Sample records restored.');});
document.querySelector('#export-csv').addEventListener('click',()=>{
  const header=['id','name','contact','blood_group','location','distance_km','priority','available'];
  const csv=[header.join(','),...donors.map(d=>[d.id,d.name,d.contact||'',d.bloodGroup,d.location,d.distance,d.priority,d.available].map(v=>`"${String(v).replaceAll('"','""')}"`).join(','))].join('\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));const a=document.createElement('a');a.href=url;a.download='bloodlink-demo-donors.csv';a.click();URL.revokeObjectURL(url);
});
document.querySelector('#compat-table').innerHTML=GROUPS.map(group=>`<span><b>${group}</b>← ${COMPATIBLE[group].join(', ')}</span>`).join('');
renderStats();renderRows();

