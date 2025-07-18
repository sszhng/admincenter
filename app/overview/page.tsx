'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  primaryButton: { text: string; variant: 'outline' | 'primary'; icon?: boolean };
  secondaryButton: { text: string };
  status: 'active' | 'dismissed' | 'completed';
  animating?: 'dismiss' | 'complete' | null;
}

export default function Overview() {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  // Top 2 priority recommendations
  const [priorityRecommendations, setPriorityRecommendations] = useState<Recommendation[]>([
    {
      id: 'overview-1',
      title: 'Assign a license to a new user',
      description: 'Invite new Recruiter users by assigning your first license. Tip: The "Recruiter User" role is commonly used role for job posting and recruiting.',
      primaryButton: { text: 'Add a new user', variant: 'outline' as const },
      secondaryButton: { text: 'Mark complete' },
      status: 'active'
    },
    {
      id: 'overview-2',
      title: 'Share resources to get users started with Recruiter',
      description: 'Share self-guided resources to help your organization learn Recruiter basics.',
      primaryButton: { text: 'Explore resources', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active'
    }
  ]);

  // Show toast notification
  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 5000);
  };

  // Dismiss toast manually
  const dismissToast = () => {
    setToast({ message: '', visible: false });
  };

  // Handle dismiss recommendation
  const handleDismiss = (id: string) => {
    // Start animation
    setPriorityRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, animating: 'dismiss' } : rec)
    );

    // After animation, update status
    setTimeout(() => {
      setPriorityRecommendations(prev => 
        prev.map(rec => rec.id === id ? { ...rec, status: 'dismissed', animating: null } : rec)
      );
    }, 300);
  };

  // Handle mark complete
  const handleMarkComplete = (id: string, title: string) => {
    // Start animation
    setPriorityRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, animating: 'complete' } : rec)
    );

    // After animation, update status and show toast
    setTimeout(() => {
      setPriorityRecommendations(prev => 
        prev.map(rec => rec.id === id ? { ...rec, status: 'completed', animating: null } : rec)
      );
      showToast('Recommendation has been marked as complete.');
    }, 300);
  };

  // Filter active recommendations
  const activeRecommendations = priorityRecommendations.filter(rec => rec.status === 'active');

  // Toast component
  const Toast = () => (
    <div className={`fixed bottom-6 left-6 z-50 transition-all duration-300 ${
      toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className="bg-white text-gray-900 px-4 py-3 rounded-lg shadow-lg border border-gray-200 flex items-center gap-3 max-w-sm">
        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-sm font-medium flex-1">{toast.message}</span>
        <button 
          onClick={dismissToast}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-page-canvas flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1">
          {/* Page Header - White Background */}
          <div className="bg-white">
            <div className="px-8 py-6">
              <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
            </div>
          </div>

          {/* Content - Gray Background */}
          <div className="p-8 space-y-6">
            {/* Priority Recommendations Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recommendations</h2>
              </div>

              {/* Recommendation Cards */}
              <div className="divide-y divide-gray-200">
                {activeRecommendations.map((item) => (
                  <div 
                    key={item.id} 
                    className={`transition-all duration-300 ease-out ${
                      item.animating === 'dismiss' ? 'transform -translate-x-full opacity-0' :
                      item.animating === 'complete' ? 'transform translate-x-full opacity-0' :
                      'transform translate-x-0 opacity-100'
                    }`}
                  >
                    <div className="p-6">
                      <div className="relative">
                        {/* Dismiss button */}
                        <button 
                          onClick={() => handleDismiss(item.id)}
                          className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        {/* Content */}
                        <div className="pr-8">
                          <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {item.description}
                            {' '}
                            <a href="#" className="text-linkedin-blue hover:underline font-medium">
                              Learn more
                            </a>
                          </p>

                          {/* Action buttons */}
                          <div className="flex gap-3">
                            <button
                              className={`px-4 py-2 text-sm font-medium rounded-2xl border transition-colors ${
                                item.primaryButton.variant === 'outline'
                                  ? 'border-linkedin-blue text-linkedin-blue hover:bg-blue-50'
                                  : 'bg-linkedin-blue text-white border-linkedin-blue hover:bg-linkedin-blue-dark'
                              } flex items-center gap-2`}
                            >
                              {item.primaryButton.text}
                              {item.primaryButton.icon && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              )}
                            </button>

                            <button 
                              onClick={() => handleMarkComplete(item.id, item.title)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
                            >
                              {item.secondaryButton.text}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer with "Show all" link - White Background, Centered */}
              {activeRecommendations.length > 0 && (
                <div className="px-6 py-4 bg-white border-t border-gray-200 text-center">
                  <Link 
                    href="/recommendations" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Show all 9 recommendations
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>

            {/* User & License Management Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">User & license management</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-linkedin-blue rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">in</span>
                  </div>
                  <span className="text-linkedin-blue font-medium">Recruiter</span>
                  <span className="text-linkedin-blue">·</span>
                  <span className="text-linkedin-blue font-medium">Flexis Recruiter 1882003</span>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-linkedin-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Have questions? We're here to help</h3>
                  <p className="text-sm text-gray-600">
                    View our{' '}
                    <a href="#" className="text-linkedin-blue hover:underline font-medium">help articles</a>
                    {' '}or{' '}
                    <a href="#" className="text-linkedin-blue hover:underline font-medium">create a case</a>
                    {' '}to answer your questions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      <Toast />
    </div>
  );
} 