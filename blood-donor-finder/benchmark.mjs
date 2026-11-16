import { writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { findMatches } from './algorithms.js';

const sizes = [100, 250, 500, 1000, 1500, 2500];
const runs = Number(process.argv[2] || 15);
const queriesPerRun = Number(process.argv[3] || 50);
const groups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
function makeDonors(n) {
  return Array.from({length:n}, (_,i)=>({
    id:`D${String(i+1).padStart(6,'0')}`, name:`Demo ${i+1}`, bloodGroup:groups[i%groups.length],
    location:i<12?'North':`Area ${(i%40)+1}`, distance:i+1, priority:(i%12)+1, available:i%9!==0,
  }));
}
function median(values) { const s=[...values].sort((a,b)=>a-b);return s[Math.floor(s.length/2)]; }
const rows=[];
for (const n of sizes) {
  const donors=makeDonors(n);
  for(let i=0;i<8;i+=1)findMatches(donors,'AB+',4,'distance',true); // warm-up
  const times=[];
  for(let r=0;r<runs;r++) { const start=performance.now();for(let q=0;q<queriesPerRun;q+=1)findMatches(donors,'AB+',4,'distance',true);times.push((performance.now()-start)/queriesPerRun); }
  rows.push({donors:n,median_ms:median(times).toFixed(4),runs,queries_per_run:queriesPerRun,scenario:'AB+ recipient; 4 donors; distance rank; 1 donor/location; first 12 candidates share North'});
}
const csv=['donors,median_ms,runs,queries_per_run,scenario',...rows.map(r=>`${r.donors},${r.median_ms},${r.runs},${r.queries_per_run},"${r.scenario}"`)].join('\n')+'\n';
writeFileSync(new URL('./results/benchmark.csv',import.meta.url),csv);
console.table(rows.map(({donors,median_ms,runs})=>({donors,median_ms,runs})));
console.log('Saved results/benchmark.csv');

