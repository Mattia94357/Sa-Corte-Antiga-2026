import 'dotenv/config'; import express from 'express'; import cors from 'cors'; import {api} from './routes/index.js';
const app=express(),port=Number(process.env.PORT)||3000;
const frontendOrigins=(process.env.FRONTEND_URL??'http://localhost:5173').split(',').map(origin=>origin.trim().replace(/\/+$/, '')).filter(Boolean);
app.use(cors({origin:frontendOrigins}));app.use(express.json({limit:'50kb'}));app.get('/api/health',(_q,r)=>r.json({status:'ok'}));app.use('/api',api);app.use((_q,r)=>r.status(404).json({message:'Not found'}));app.listen(port,()=>console.log(`Sa Corte Antiga API listening on port ${port}`));
