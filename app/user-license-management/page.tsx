'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

export default function UserLicenseManagement() {
  const [activeTab, setActiveTab] = useState('Users');

  const users = [
    { id: 1, name: 'John Smith', email: 'john.smith@flexis.com', role: 'Recruiter User', status: 'Active', lastActive: '2 hours ago' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@flexis.com', role: 'Hiring Manager', status: 'Active', lastActive: '1 day ago' },
    { id: 3, name: 'Mike Chen', email: 'mike.chen@flexis.com', role: 'Admin', status: 'Active', lastActive: '3 hours ago' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@flexis.com', role: 'Recruiter User', status: 'Inactive', lastActive: '1 week ago' }
  ];

  return (
    <div className="min-h-screen bg-page-canvas flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1">
          {/* Page Header - White Background */}
          <div className="bg-white">
            <div className="px-8 py-6">
              <h1 className="text-2xl font-semibold text-gray-900">User & license management</h1>
            </div>
          </div>

          {/* Content - Gray Background */}
          <div className="p-8 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4">
                <div className="flex gap-2">
                  {['Users', 'Licenses', 'Groups'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-medium rounded-2xl border transition-colors ${
                        tab === 'Users'
                          ? 'bg-linkedin-blue text-white border-linkedin-blue'
                          : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* User Management Content */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Users</h2>
                  <button className="px-4 py-2 bg-linkedin-blue text-white text-sm font-medium rounded-2xl hover:bg-linkedin-blue-dark transition-colors">
                    Add user
                  </button>
                </div>
              </div>

              {/* User Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button className="text-linkedin-blue hover:text-linkedin-blue font-medium">Edit</button>
                            <button className="text-red-600 hover:text-red-800 font-medium">Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* License Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">License Overview</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-linkedin-blue">25</div>
                  <div className="text-sm text-gray-500">Total Licenses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">18</div>
                  <div className="text-sm text-gray-500">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">7</div>
                  <div className="text-sm text-gray-500">Available</div>
                </div>
              </div>
            </div>

            {/* LinkedIn Products */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">LinkedIn Products</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linkedin-blue rounded flex items-center justify-center">
                      <span className="text-white text-sm font-bold">in</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">LinkedIn Recruiter</div>
                      <div className="text-sm text-gray-500">Professional recruiting solution</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">15 seats</div>
                    <div className="text-xs text-gray-500">12 active</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linkedin-blue rounded flex items-center justify-center">
                      <span className="text-white text-sm font-bold">in</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">LinkedIn Jobs</div>
                      <div className="text-sm text-gray-500">Job posting and promotion</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">10 seats</div>
                    <div className="text-xs text-gray-500">6 active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 