export const GROUPS = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
// Red-cell donor compatibility: each recipient group maps to acceptable donor groups.
export const COMPATIBLE = {
  'O-': ['O-'], 'O+': ['O-', 'O+'], 'A-': ['O-', 'A-'], 'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'], 'B+': ['O-', 'O+', 'B-', 'B+'], 'AB-': ['O-', 'A-', 'B-', 'AB-'], 'AB+': GROUPS,
};

export function isCompatible(donorGroup, recipientGroup) { return Boolean(COMPATIBLE[recipientGroup]?.includes(donorGroup)); }
function mergeSort(items, compare) {
  if(items.length<=1)return items;
  const middle=Math.floor(items.length/2),left=mergeSort(items.slice(0,middle),compare),right=mergeSort(items.slice(middle),compare),merged=[];
  let i=0,j=0;while(i<left.length&&j<right.length)merged.push(compare(left[i],right[j])<=0?left[i++]:right[j++]);
  return merged.concat(left.slice(i),right.slice(j));
}
export function rankDonors(donors, key = 'distance') {
  const value = key === 'id' ? d => d.id.toLowerCase() : key === 'priority' ? d => Number(d.priority) : d => Number(d.distance);
  const compare=(a,b)=>{const av=value(a),bv=value(b);return typeof av==='string'?av.localeCompare(bv):av-bv||a.id.localeCompare(b.id);};
  return mergeSort([...donors],compare);
}
export function findMatches(donors, recipientGroup, count, key = 'distance', diversify = true) {
  const candidates=rankDonors(donors.filter(d=>d.available&&isCompatible(d.bloodGroup,recipientGroup)),key);
  const greedy=candidates.slice(0,count);
  const greedyValid=!diversify||new Set(greedy.map(d=>d.location.toLowerCase())).size===greedy.length;
  if(greedy.length===count&&greedyValid)return{candidates,selected:greedy,strategy:'greedy',explored:0,greedy};
  if(!diversify)return{candidates,selected:greedy,strategy:'greedy',explored:0,greedy};
  let explored=0,selected=null,bestPartial=[];const chosen=[],locations=new Set();
  function search(start){
    explored+=1;if(chosen.length>bestPartial.length)bestPartial=[...chosen];if(chosen.length===count){selected=[...chosen];return true;}
    for(let i=start;i<candidates.length;i+=1){const donor=candidates[i],area=donor.location.toLowerCase();if(locations.has(area))continue;
      locations.add(area);chosen.push(donor);if(search(i+1))return true;chosen.pop();locations.delete(area);}
    return false;
  }
  search(0);return{candidates,selected:selected??bestPartial,strategy:'backtracking',explored,greedy};
}

