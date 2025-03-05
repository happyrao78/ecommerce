import express from 'express';
import { 
    addAttribute, 
    listAttributes, 
    singleAttribute, 
    updateAttribute, 
    deleteAttribute,
    addAttributeValue,
    removeAttributeValue ,
    editAttributeValue
} from '../controllers/attribute.controller.js';
import adminAuth from '../middleware/adminAuth.js';

const attributeRouter = express.Router();

// Attribute routes
attributeRouter.post('/add',  addAttribute);
attributeRouter.get('/list',  listAttributes);
attributeRouter.post('/single', singleAttribute);
attributeRouter.put('/update', updateAttribute);
attributeRouter.delete('/delete', deleteAttribute);

// Attribute value routes
attributeRouter.post('/value/add', addAttributeValue);
attributeRouter.delete('/value/remove', removeAttributeValue);
attributeRouter.put('/value/edit', editAttributeValue);

export default attributeRouter;