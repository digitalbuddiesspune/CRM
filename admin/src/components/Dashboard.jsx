import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddLeadForm from './AddLeadForm';
import EditLeadForm from './EditLeadForm';
import Footer from './Footer';


const Dashboard = ({ apiUrl }) => {
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'list'
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedEmployee]);

  const handleLeadAdded = () => {
    fetchData(); // Refresh data after adding a lead
  };

  const handleLeadUpdated = () => {
    fetchData(); // Refresh data after updating a lead
    setEditingLead(null);
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/delete-client-lead/${leadId}`);
      fetchData(); // Refresh data after deleting
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const leadsRes = await axios.get(`${apiUrl}/get-all-leads`);
      
      // Handle the API response structure: { success, count, data }
      if (leadsRes.data.success && leadsRes.data.data) {
        let filteredLeads = leadsRes.data.data;
        
        // Filter by date if provided
        if (selectedDate) {
          filteredLeads = filteredLeads.filter(lead => lead.date === selectedDate);
        }
        
        // Filter by employee if provided
        if (selectedEmployee) {
          filteredLeads = filteredLeads.filter(lead => lead.generatedBy === selectedEmployee);
        }
        
        setLeads(filteredLeads);
        
        // Get unique employees from leads
        const uniqueEmployees = [...new Set(filteredLeads.map(lead => lead.generatedBy))];
        setEmployees(uniqueEmployees.map((name, index) => ({ id: index + 1, name })));
        
        // Calculate stats
        const totalLeads = filteredLeads.length;
        const leadsByEmployee = uniqueEmployees.map((name, index) => ({
          employeeId: index + 1,
          employeeName: name,
          count: filteredLeads.filter(l => l.generatedBy === name).length
        }));
        
        setStats({
          totalLeads,
          leadsByEmployee
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group leads by date
  const leadsByDate = leads.reduce((acc, lead) => {
    if (!acc[lead.date]) {
      acc[lead.date] = [];
    }
    acc[lead.date].push(lead);
    return acc;
  }, {});

  // Group leads by employee and date
  const leadsByEmployeeAndDate = leads.reduce((acc, lead) => {
    const employeeName = lead.generatedBy || 'Unknown';
    const key = `${employeeName}-${lead.date}`;
    if (!acc[key]) {
      acc[key] = {
        employeeName: employeeName,
        date: lead.date,
        leads: []
      };
    }
    acc[key].leads.push(lead);
    return acc;
  }, {});

  const sortedDates = Object.keys(leadsByDate).sort((a, b) => new Date(b) - new Date(a));

  const getStatusColor = (status) => {
    const colors = {
      'Approved': 'bg-green-100 text-green-800 border-green-300',
      'Rejected': 'bg-red-100 text-red-800 border-red-300',
      'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Pending': 'bg-blue-100 text-blue-800 border-blue-300',
      'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'Cancelled': 'bg-gray-100 text-gray-800 border-gray-300',
      // Legacy statuses for backward compatibility
      'New': 'bg-blue-100 text-blue-800 border-blue-300',
      'Contacted': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Qualified': 'bg-green-100 text-green-800 border-green-300',
      'Converted': 'bg-purple-100 text-purple-800 border-purple-300',
      'Lost': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">CRM Dashboard</h1>
              <p className="mt-2 text-sm text-blue-100 font-medium">Digital Buddiess - Leads Management</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-black hover:cursor-pointer hover:translate-y-[-2px] rounded-md hover:bg-opacity-30 transition-colors font-medium shadow-sm flex items-center space-x-2 border border-white border-opacity-30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Lead</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-100 rounded-lg shadow p-6 border border-gray-200">
              <div className="text-sm font-medium text-gray-600">Total Leads</div>
              <div className="mt-2 text-3xl font-bold text-gray-800">{stats.totalLeads}</div>
            </div>
            {stats.leadsByEmployee.map((emp) => (
              <div key={emp.employeeId} className="bg-gray-100 rounded-lg shadow p-6 border border-gray-200">
                <div className="text-sm font-medium text-gray-600">{emp.employeeName}</div>
                <div className="mt-2 text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">{emp.count}</div>
                <div className="mt-1 text-xs text-gray-500">leads generated</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Employee
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="grouped">Grouped by Date</option>
                <option value="list">List View</option>
              </select>
            </div>
          </div>
          {(selectedDate || selectedEmployee) && (
            <button
              onClick={() => {
                setSelectedDate('');
                setSelectedEmployee('');
              }}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Leads Display */}
        {viewMode === 'grouped' ? (
          <div className="space-y-6">
            {sortedDates.length === 0 ? (
              <div className="bg-gray-50 rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No leads found for the selected filters.</p>
              </div>
            ) : (
              sortedDates.map((date) => {
                const dateLeads = leadsByDate[date];
                const employeeGroups = dateLeads.reduce((acc, lead) => {
                  const employeeName = lead.generatedBy || 'Unknown';
                  if (!acc[employeeName]) {
                    acc[employeeName] = [];
                  }
                  acc[employeeName].push(lead);
                  return acc;
                }, {});

                return (
                  <div key={date} className="bg-gray-50 rounded-lg shadow overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-4">
                      <h2 className="text-xl font-bold text-white">
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h2>
                      <p className="text-blue-100 mt-1">
                        {dateLeads.length} lead{dateLeads.length !== 1 ? 's' : ''} generated
                      </p>
                    </div>

                    <div className="p-6">
                      {Object.entries(employeeGroups).map(([employeeName, empLeads]) => (
                        <div key={employeeName} className="mb-6 last:mb-0">
                          <div className="flex items-center mb-4 pb-2 border-b">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold">
                                {employeeName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{employeeName}</h3>
                              <p className="text-sm text-gray-500">
                                {empLeads.length} lead{empLeads.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {empLeads.map((lead) => (
                              <div
                                key={lead._id || lead.id}
                                className="bg-gray-100 border border-gray-300 rounded-lg p-4 hover:shadow-md transition relative"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900">{lead.clientName || 'N/A'}</h4>
                                  <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(lead.status)}`}>
                                      {lead.status}
                                    </span>
                                    {/* Edit Button */}
                                    <button
                                      onClick={() => setEditingLead(lead)}
                                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                      title="Edit Lead"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    {/* Delete Button */}
                                    <button
                                      onClick={() => handleDeleteLead(lead._id || lead.id)}
                                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                      title="Delete Lead"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <p><span className="font-medium">Business Type:</span> {lead.businessType || 'N/A'}</p>
                                  <p><span className="font-medium">Location:</span> {lead.location || 'N/A'}</p>
                                  <p><span className="font-medium">Date:</span> {lead.date || 'N/A'}</p>
                                  <p><span className="font-medium">Time:</span> {lead.time || 'N/A'}</p>
                                  {lead.nfd && (
                                    <p><span className="font-medium">NFD:</span> {formatDate(lead.nfd)}</p>
                                  )}
                                  {lead.nfdUpdatedDay && (
                                    <p><span className="font-medium">NFD Updated:</span> {formatDate(lead.nfdUpdatedDay)}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NFD
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NFD Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                        No leads found
                      </td>
                    </tr>
                  ) : (
                    leads
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((lead) => (
                        <tr key={lead._id || lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(lead.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {lead.generatedBy || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.clientName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.businessType || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.location || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.time || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.nfd ? formatDate(lead.nfd) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.nfdUpdatedDay ? formatDate(lead.nfdUpdatedDay) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingLead(lead)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit Lead"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead._id || lead.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Lead"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Lead Form Modal */}
      {showAddForm && (
        <AddLeadForm
          apiUrl={apiUrl}
          onClose={() => setShowAddForm(false)}
          onSuccess={handleLeadAdded}
        />
      )}

      {/* Edit Lead Form Modal */}
      {editingLead && (
        <EditLeadForm
          apiUrl={apiUrl}
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onSuccess={handleLeadUpdated}
        />
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;

