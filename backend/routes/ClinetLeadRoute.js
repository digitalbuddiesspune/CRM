import express from 'express';
import {
  addClientLead,
  getAllLeads,
  getLeadsByEmployee,
  getLeadsByEmployeeQuery,
  updateClientLead,
  deleteClientLead
} from '../controller/ClinetLeadController.js';

const clientRouter = express.Router();

// Add a new client lead
clientRouter.post('/add-client-lead', addClientLead);

// Get all leads
clientRouter.get('/get-all-leads', getAllLeads);

// Get leads by employee name (using route parameter)
clientRouter.get('/get-leads-by-employee/:employeeName', getLeadsByEmployee);

// Get leads by employee name (using query parameter)
clientRouter.get('/get-leads-by-employee-query', getLeadsByEmployeeQuery);

// Update a client lead
clientRouter.put('/update-client-lead/:id', updateClientLead);

// Delete a client lead
clientRouter.delete('/delete-client-lead/:id', deleteClientLead);

export default clientRouter;
