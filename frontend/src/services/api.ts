export type AvailabilityResponse={bookedDates:string[];updatedAt:string;source:string};
// One API origin for both endpoints; an empty value uses the local Vite proxy.
const BASE=(import.meta.env.VITE_API_URL??'').trim().replace(/\/+$/, '');
export async function getAvailability():Promise<AvailabilityResponse>{const r=await fetch(`${BASE}/api/availability`);if(!r.ok)throw new Error('Availability unavailable');return r.json()}
export async function sendEnquiry(payload:Record<string,string>){const r=await fetch(`${BASE}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok)throw new Error(d.message??'Enquiry failed');return d}
