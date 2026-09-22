import {Router} from 'express'; import {availability} from '../controllers/availabilityController.js'; import {contact} from '../controllers/contactController.js';
export const api=Router(); api.get('/availability',availability); api.post('/contact',contact);
