import type {Request,Response} from 'express'; import {getSampleAvailability} from '../services/availabilityService.js';
export function availability(_req:Request,res:Response){res.json(getSampleAvailability())}
