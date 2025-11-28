import mongoose from "mongoose";

const ClientLeadSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    businessType: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    generatedBy: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,  // or Date (if you want date object)
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "In Progress", "Completed", "Cancelled", "Approved", "Rejected"], // optional
    },
    nfd: {
      type: String, // Next Follow Up Date
      default: null,
    },
    nfdUpdatedDay: {
      type: Date, // Date when NFD was last updated
      default: null,
    },
  },
  { timestamps: true }
);

const ClientLead = mongoose.model("ClientLead", ClientLeadSchema);
export default ClientLead;
