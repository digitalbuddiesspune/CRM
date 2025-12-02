import ClientLead from '../model/ClientLead.js';

// Add a new client lead
export const addClientLead = async (req, res) => {
  try {
    const { clientName, clientNumber, businessType, location, requirement, generatedBy, date, time, status, nfd } = req.body;
    if (!clientName || !businessType || !location || !generatedBy || !date || !time || !status) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: clientName, businessType, location, generatedBy, date, time, status'
      });
    }

    // Create new lead
    const newLead = new ClientLead({
      clientName,
      clientNumber: clientNumber || null,
      businessType,
      location,
      requirement: requirement || null,
      generatedBy,
      date,
      time,
      status,
      nfd: nfd || null,
      nfdUpdatedDay: nfd ? new Date() : null
    });

    // Save to database
    const savedLead = await newLead.save();

    res.status(201).json({
      success: true,
      message: 'Client lead added successfully',
      data: savedLead
    });
  } catch (error) {
    console.error('Error adding client lead:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding client lead',
      error: error.message
    });
  }
};

// Get all client leads
export const getAllLeads = async (req, res) => {
  try {
    const leads = await ClientLead.find().sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('Error retrieving leads:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving leads',
      error: error.message
    });
  }
};

// Get leads by employee name
export const getLeadsByEmployee = async (req, res) => {
  try {
    const { employeeName } = req.params;

    if (!employeeName) {
      return res.status(400).json({
        success: false,
        message: 'Employee name is required'
      });
    }

    // Case-insensitive search for employee name
    const leads = await ClientLead.find({
      generatedBy: { $regex: new RegExp(employeeName, 'i') }
    }).sort({ createdAt: -1 });

    if (leads.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No leads found for employee: ${employeeName}`,
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: leads.length,
      employeeName: employeeName,
      data: leads
    });
  } catch (error) {
    console.error('Error retrieving leads by employee:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving leads by employee',
      error: error.message
    });
  }
};

// Alternative: Get leads by employee name using query parameter
export const getLeadsByEmployeeQuery = async (req, res) => {
  try {
    const { employeeName } = req.query;

    if (!employeeName) {
      return res.status(400).json({
        success: false,
        message: 'Employee name query parameter is required'
      });
    }

    // Case-insensitive search for employee name
    const leads = await ClientLead.find({
      generatedBy: { $regex: new RegExp(employeeName, 'i') }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      employeeName: employeeName,
      data: leads
    });
  } catch (error) {
    console.error('Error retrieving leads by employee:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving leads by employee',
      error: error.message
    });
  }
};

// Update a client lead
export const updateClientLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, clientNumber, businessType, location, requirement, generatedBy, date, time, status, nfd } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Lead ID is required'
      });
    }

    // Build update object
    const updateData = {};
    if (clientName) updateData.clientName = clientName;
    if (clientNumber !== undefined) updateData.clientNumber = clientNumber || null;
    if (businessType) updateData.businessType = businessType;
    if (location) updateData.location = location;
    if (requirement !== undefined) updateData.requirement = requirement || null;
    if (generatedBy) updateData.generatedBy = generatedBy;
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (status) updateData.status = status;
    if (nfd !== undefined) {
      updateData.nfd = nfd || null;
      // Update nfdUpdatedDay only if NFD is being changed
      if (nfd) {
        updateData.nfdUpdatedDay = new Date();
      }
    }

    const updatedLead = await ClientLead.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client lead updated successfully',
      data: updatedLead
    });
  } catch (error) {
    console.error('Error updating client lead:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating client lead',
      error: error.message
    });
  }
};

// Delete a client lead
export const deleteClientLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Lead ID is required'
      });
    }

    const deletedLead = await ClientLead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client lead deleted successfully',
      data: deletedLead
    });
  } catch (error) {
    console.error('Error deleting client lead:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting client lead',
      error: error.message
    });
  }
};

