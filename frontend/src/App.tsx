import {lazy,Suspense} from 'react';
import {Route,Routes} from 'react-router-dom'; import {Layout} from './components/Layout'; import {Home} from './pages/Home';
import {NotFound} from './pages/NotFound';
const Why=lazy(()=>import('./pages/Why').then(module=>({default:module.Why})));
const Gallery=lazy(()=>import('./pages/Gallery').then(module=>({default:module.Gallery})));
const Contact=lazy(()=>import('./pages/Contact').then(module=>({default:module.Contact})));
const GardenHouse=lazy(()=>import('./pages/GardenHouse').then(module=>({default:module.GardenHouse})));
const GardenHouseGallery=lazy(()=>import('./pages/GardenHouseGallery').then(module=>({default:module.GardenHouseGallery})));
export default function App(){return <Suspense fallback={null}><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="why-sa-corte-antiga" element={<Why/>}/><Route path="gallery" element={<Gallery/>}/><Route path="contact" element={<Contact/>}/><Route path="garden-house" element={<GardenHouse/>}/><Route path="garden-house/gallery" element={<GardenHouseGallery/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></Suspense>}
