import express from 'express';
import { createProperty, getProperties, getProperty, updateProperty, deleteProperty } from '../controller/property.controller.js';

const router = express.Router();

router.post('/', createProperty);
router.get('/',getProperties);
router.get('/:id', getProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);


export default router;
