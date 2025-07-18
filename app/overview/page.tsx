'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useRecommendations, type Recommendation } from '../../contexts/RecommendationsContext';

export default function Overview() {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const { 
    recommendations, 
    updateRecommendationStatus, 
    setRecommendationAnimating,
    getTotalCounts
  } = useRecommendations();

  // Get first 2 active recommendations
  const activeRecommendations = recommendations.filter(rec => rec.status === 'active');
  const priorityRecommendations = activeRecommendations.slice(0, 2);
  const totalCompleted = recommendations.filter(rec => rec.status === 'completed').length;
  const allCompleted = totalCompleted === recommendations.length;

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
    setRecommendationAnimating(id, 'dismiss');

    // Update status after animation
    setTimeout(() => {
      updateRecommendationStatus(id, 'dismissed');
      showToast('Recommendation has been dismissed.');
    }, 300);
  };

  // Handle mark complete
  const handleMarkComplete = (id: string) => {
    // Start animation
    setRecommendationAnimating(id, 'complete');

    // Update status after animation
    setTimeout(() => {
      updateRecommendationStatus(id, 'completed');
      showToast('Recommendation has been marked as complete.');
    }, 300);
  };

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
          className="text-dismiss-icon hover:text-dismiss-icon-hover flex-shrink-0"
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
        
        <main className="flex-1 bg-page-canvas">
          {/* White Content Container */}
          <div className="bg-white">
            <div className="px-8 py-6 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
            </div>
          </div>

          {/* Gray Background Section */}
          <div className="bg-page-canvas min-h-screen">
            <div className="p-8 space-y-6">
              {/* Priority Recommendations Section */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Recommendations</h2>
                </div>

                {/* Show completion message if all done, otherwise show active recommendations */}
                {allCompleted ? (
                  /* Completion Message */
                  <div className="p-8 text-center">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Great job! You&apos;re all set up</h3>
                    <p className="text-sm text-secondary mb-4">
                      You&apos;ve completed all {recommendations.length} recommendations to get your organization started with LinkedIn Talent Solutions.
                    </p>
                    <Link 
                      href="/recommendations" 
                      className="inline-flex items-center gap-2 text-sm font-medium text-linkedin-blue hover:underline"
                    >
                      View all recommendations
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ) : (
                  /* Active Recommendation Cards */
                  <>
                    <div className="divide-y divide-gray-200">
                      {priorityRecommendations.map((item) => (
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
                                className="absolute top-0 right-0 text-dismiss-icon hover:text-dismiss-icon-hover transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>

                              {/* Content */}
                              <div className="pr-8">
                                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-secondary mb-4">
                                  {item.description}
                                  {' '}
                                  <a href="#" className="text-linkedin-blue hover:underline font-medium">
                                    Learn more
                                  </a>
                                </p>

                                {/* Action buttons */}
                                <div className="flex gap-6">
                                  <button
                                    className={`px-4 h-8 text-sm font-medium rounded-[16px] border transition-colors ${
                                      item.primaryButton.variant === 'outline'
                                        ? 'border-linkedin-blue text-linkedin-blue hover:bg-blue-50'
                                        : 'bg-linkedin-blue text-white border-linkedin-blue hover:bg-linkedin-blue-dark'
                                    } flex items-center gap-2`}
                                  >
                                    {item.primaryButton.text}
                                    {item.primaryButton.icon && (
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3" />
                                      </svg>
                                    )}
                                  </button>

                                  <button 
                                    onClick={() => handleMarkComplete(item.id)}
                                    className="px-0 h-8 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
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
                    {priorityRecommendations.length > 0 && (
                      <div className="px-6 py-4 bg-white border-t border-gray-200 text-center">
                        <Link 
                          href="/recommendations" 
                          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          Show all {activeRecommendations.length} recommendations
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </>
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
                    <h3 className="font-semibold text-gray-900 mb-1">Have questions? We&apos;re here to help</h3>
                    <p className="text-sm text-secondary">
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
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      <Toast />
    </div>
  );
} 