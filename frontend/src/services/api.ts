export type BlockedRange = { start: string; end: string };
export type AvailabilityResponse = { blockedRanges: BlockedRange[]; updatedAt: string; source: 'airbnb' };
// One API origin for both endpoints; an empty value uses the local Vite proxy.
const BASE=(import.meta.env.VITE_API_URL??'').trim().replace(/\/+$/, '');
export async function getAvailability():Promise<AvailabilityResponse>{const r=await fetch('/api/availability');if(!r.ok)throw new Error('Availability unavailable');const data:unknown=await r.json();if(!data||typeof data!=='object'||!('source' in data)||data.source!=='airbnb'||!('blockedRanges' in data)||!Array.isArray(data.blockedRanges))throw new Error('Availability unavailable');return data as AvailabilityResponse}
export async function sendEnquiry(payload:Record<string,string>){const r=await fetch(`${BASE}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok)throw new Error(d.message??'Enquiry failed');return d}
