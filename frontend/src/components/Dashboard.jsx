import React, { useState, useEffect } from "react";
import axios from "axios";
import EditLeadForm from "./EditLeadForm";
import logoImage from "../assets/width_800.webp";
import Footer from "./Footer";

const Dashboard = ({ apiUrl }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/get-all-leads`);

      // Handle the API response structure: { success, count, data }
      if (response.data.success && response.data.data) {
        // Map the API data to match the dashboard structure
         const mappedLeads = response.data.data.map((lead) => ({
           id: lead._id || lead.id,
           companyName: lead.clientName || "N/A", // Business Name
           contactName: lead.clientName || "N/A", // Client Name (same as clientName for now)
           clientName: lead.clientName || "N/A", // Preserve original clientName
           clientNumber: lead.clientNumber || null,
           businessType: lead.businessType || "N/A",
           location: lead.location || "N/A",
           requirement: lead.requirement || null,
           employeeName: lead.generatedBy || "N/A", // Map generatedBy to employeeName
           status: lead.status || "N/A",
           date: lead.date || new Date().toISOString().split("T")[0],
           time: lead.time || "",
           createdAt: lead.createdAt,
           nfd: lead.nfd || null,
           nfdUpdatedDay: lead.nfdUpdatedDay || null,
         }));

        setLeads(mappedLeads);
        setError(null);
      } else {
        setLeads([]);
        setError("No leads data received from server");
      }
    } catch (err) {
      setError(
        "Failed to fetch leads. Please make sure the backend server is running."
      );
      console.error("Error fetching leads:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique employees for filter
  const uniqueEmployees = [...new Set(leads.map((lead) => lead.employeeName))];

  // Get unique statuses for filter
  const uniqueStatuses = [...new Set(leads.map((lead) => lead.status))];

  // Get unique locations for filter
  const uniqueLocations = [
    ...new Set(leads.map((lead) => lead.location).filter(Boolean)),
  ];

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesEmployee =
      !filterEmployee || lead.employeeName === filterEmployee;
    const matchesStatus = !filterStatus || lead.status === filterStatus;
    const matchesLocation = !filterLocation || lead.location === filterLocation;
    return matchesEmployee && matchesStatus && matchesLocation;
  });

  const getStatusColor = (status) => {
  const colors = {
    Pending: "bg-blue-100 text-blue-800 border-blue-300",
    "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-300",
    Completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Cancelled: "bg-red-100 text-red-800 border-red-300",
    Approved: "bg-green-100 text-green-800 border-green-300",
    Rejected: "bg-rose-100 text-rose-800 border-rose-300",
    "Not Interested": "bg-gray-100 text-gray-800 border-gray-300",
    "Follow Up": "bg-indigo-100 text-indigo-800 border-indigo-300",
    Busy: "bg-amber-100 text-amber-800 border-amber-300",
    "Call Later": "bg-orange-100 text-orange-800 border-orange-300",
    "Meeting Scheduled": "bg-purple-100 text-purple-800 border-purple-300",
    "Not Answering": "bg-slate-100 text-slate-800 border-slate-300",

    // Legacy statuses (if still in DB)
    New: "bg-blue-100 text-blue-800 border-blue-300",
    Contacted: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Qualified: "bg-green-100 text-green-800 border-green-300",
    Converted: "bg-purple-100 text-purple-800 border-purple-300",
  };

  return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
};

  const getEmployeeAvatarColor = (employeeName) => {
    const colors = [
      "bg-slate-600",
      "bg-blue-600",
      "bg-indigo-600",
      "bg-slate-700",
      "bg-blue-700",
      "bg-indigo-700",
    ];
    const index = uniqueEmployees.indexOf(employeeName);
    return colors[index % colors.length];
  };

  const handleLeadUpdated = () => {
    fetchLeads(); // Refresh data after updating a lead
    setEditingLead(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // SVG Icons
  const ChartIcon = () => (
    <svg
      className="w-6 h-6 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );

  const FilterIcon = () => (
    <svg
      className="w-5 h-5 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  );

  const UserIcon = () => (
    <svg
      className="w-5 h-5 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  const LocationIcon = () => (
    <svg
      className="w-4 h-4 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const BuildingIcon = () => (
    <svg
      className="w-4 h-4 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-slate-600 mb-4"></div>
          <div className="text-lg font-medium text-slate-600">
            Loading leads...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-white border border-red-200 rounded-lg p-6 max-w-md shadow-sm">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <img
              src={logoImage}
              alt="Digital Buddies Logo"
              className="h-10 sm:h-12 w-auto object-contain flex-shrink-0"
            />

            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">
                Leads Dashboard
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-blue-100">
                View and manage leads generated by your team
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-100 rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Leads
                </p>
                <p className="text-3xl font-semibold text-gray-800">
                  {leads.length}
                </p>
              </div>
              <div className="p-3 bg-gray-200 rounded-lg">
                <ChartIcon color="red" fill="red" />
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Filtered Leads
                </p>
                <p className="text-3xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {filteredLeads.length}
                </p>
              </div>
              <div className="p-3 bg-gray-200 rounded-lg">
                <FilterIcon />
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Active Employees
                </p>
                <p className="text-3xl font-semibold text-gray-800">
                  {uniqueEmployees.length}
                </p>
              </div>
              <div className="p-3 bg-gray-200 rounded-lg">
                <UserIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center mb-4">
            <FilterIcon color="text-purple-600" />
            <h2 className="ml-2 text-base sm:text-lg font-semibold text-slate-900">
              Filters
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Employee
              </label>
              <select
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-700 bg-white"
              >
                <option value="">All Employees</option>
                {uniqueEmployees.map((emp) => (
                  <option key={emp} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-700 bg-white"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-700 bg-white"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(filterEmployee || filterStatus || filterLocation) && (
            <button
              onClick={() => {
                setFilterEmployee("");
                setFilterStatus("");
                setFilterLocation("");
              }}
              className="mt-4 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-300 rounded-md hover:bg-slate-200 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Leads Table */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-white">
              Leads Overview
            </h2>
          </div>
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Business & Client
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Client Number
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Business Type
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Location
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Requirement
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                    Time
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Generated By
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    NFD
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    NFD Updated
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-50 divide-y divide-gray-200">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="px-3 sm:px-6 py-12 text-center">
                      <p className="text-gray-500 text-sm">
                        No leads found matching the selected filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLeads
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((lead, index) => (
                      <tr
                        key={lead.id}
                        className={`hover:bg-gray-100 transition-colors ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                        }`}
                      >
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                              {lead.companyName || lead.clientName || "N/A"}
                            </div>
                            <div className="text-xs text-slate-600">
                              {lead.contactName || lead.clientName || "N/A"}
                            </div>
                            <div className="sm:hidden text-xs text-slate-500 mt-2 space-y-1">
                              <div>Number: {lead.clientNumber || "N/A"}</div>
                              <div>Type: {lead.businessType || "N/A"}</div>
                              <div>Location: {lead.location || "N/A"}</div>
                              <div>Requirement: {lead.requirement || "N/A"}</div>
                              <div>Employee: {lead.employeeName || "N/A"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="text-xs sm:text-sm text-slate-700">
                            {lead.clientNumber || "N/A"}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-xs sm:text-sm text-slate-700">
                            {lead.businessType || "N/A"}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="flex items-center">
                            <LocationIcon />
                            <span className="ml-2 text-xs sm:text-sm text-slate-600">
                              {lead.location || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="text-xs sm:text-sm text-slate-700">
                            {lead.requirement || "N/A"}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-slate-700">
                            {lead.date
                              ? (() => {
                                  try {
                                    const dateObj = new Date(lead.date);
                                    if (!isNaN(dateObj.getTime())) {
                                      return dateObj.toLocaleDateString(
                                        "en-US",
                                        {
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        }
                                      );
                                    }
                                    return lead.date;
                                  } catch {
                                    return lead.date;
                                  }
                                })()
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="text-xs sm:text-sm text-slate-700">
                            {lead.time || "N/A"}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="flex items-center">
                            <div
                              className={`w-6 h-6 sm:w-8 sm:h-8 ${getEmployeeAvatarColor(
                                lead.employeeName
                              )} rounded-full flex items-center justify-center mr-2 sm:mr-3`}
                            >
                              <span className="text-white text-xs font-semibold">
                                {lead.employeeName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-slate-900">
                              {lead.employeeName}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span
                            className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md border ${getStatusColor(
                              lead.status
                            )}`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="text-xs sm:text-sm text-slate-700">
                            {lead.nfd ? formatDate(lead.nfd) : "N/A"}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="text-xs sm:text-sm text-slate-700">
                            {lead.nfdUpdatedDay
                              ? formatDate(lead.nfdUpdatedDay)
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <button
                            onClick={() => setEditingLead(lead)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Lead"
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Lead Form Modal */}
      {editingLead && (
        <EditLeadForm
          apiUrl={apiUrl}
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onSuccess={handleLeadUpdated}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
