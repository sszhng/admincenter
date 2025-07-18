'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useRecommendations, type Recommendation } from '../../contexts/RecommendationsContext';

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState('Active');
  const [recruiterExpanded, setRecruiterExpanded] = useState(false);
  const [jobsExpanded, setJobsExpanded] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const { 
    recommendations, 
    updateRecommendationStatus, 
    setRecommendationAnimating,
    getRecruiterRecommendations,
    getJobsRecommendations,
    getTotalCounts
  } = useRecommendations();

  const recruiterRecommendations = getRecruiterRecommendations();
  const jobsRecommendations = getJobsRecommendations();

  // Helper function to filter recommendations
  const getFilteredRecommendations = (recommendations: Recommendation[], expanded: boolean) => {
    let filtered = recommendations;
    
    if (activeTab === 'Active') {
      filtered = recommendations.filter(rec => rec.status === 'active');
    } else if (activeTab === 'Completed') {
      filtered = recommendations.filter(rec => rec.status === 'completed');
    } else if (activeTab === 'Dismissed') {
      filtered = recommendations.filter(rec => rec.status === 'dismissed');
    }
    
    return expanded ? filtered : filtered.slice(0, 3);
  };

  const visibleRecruiterRecommendations = getFilteredRecommendations(recruiterRecommendations, recruiterExpanded);
  const visibleJobsRecommendations = getFilteredRecommendations(jobsRecommendations, jobsExpanded);

  // Get counts from context
  const {
    totalActive,
    totalCompleted,
    totalDismissed,
    recruiterActive,
    recruiterCompleted,
    recruiterDismissed,
    recruiterTotal,
    jobsActive,
    jobsCompleted,
    jobsDismissed,
    jobsTotal
  } = getTotalCounts();

  // Check if we should show sections based on current tab
  const shouldShowRecruiterSection = () => {
    if (activeTab === 'Active') return recruiterActive > 0;
    if (activeTab === 'Completed') return recruiterCompleted > 0;
    if (activeTab === 'Dismissed') return recruiterDismissed > 0;
    return false;
  };

  const shouldShowJobsSection = () => {
    if (activeTab === 'Active') return jobsActive > 0;
    if (activeTab === 'Completed') return jobsCompleted > 0;
    if (activeTab === 'Dismissed') return jobsDismissed > 0;
    return false;
  };

  const hasAnyRecommendations = () => {
    if (activeTab === 'Active') return totalActive > 0;
    if (activeTab === 'Completed') return totalCompleted > 0;
    if (activeTab === 'Dismissed') return totalDismissed > 0;
    return false;
  };

  // Empty state component
  const EmptyState = () => {
    let title = '';
    let buttonText = '';
    let buttonAction = '';

    if (activeTab === 'Completed') {
      title = 'You have no completed recommendations';
      buttonText = 'View active recommendations';
      buttonAction = 'Active';
    } else if (activeTab === 'Dismissed') {
      title = 'You have no dismissed recommendations';
      buttonText = 'View active recommendations';
      buttonAction = 'Active';
    } else {
      title = 'You have no active recommendations';
      buttonText = '';
      buttonAction = '';
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
          
          {buttonText && (
            <button
              onClick={() => setActiveTab(buttonAction)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    );
  };

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

  // Handle dismiss
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

    // Update status after animation and show toast
    setTimeout(() => {
      updateRecommendationStatus(id, 'completed');
      showToast('Recommendation has been marked as complete.');
    }, 300);
  };

  // Handle move to active (undo dismiss)
  const handleMoveToActive = (id: string) => {
    updateRecommendationStatus(id, 'active');
    showToast('Recommendation has been moved to active.');
  };

  // RecommendationCard component
  const RecommendationCard = ({ 
    recommendation, 
    onDismiss, 
    onComplete,
    onMoveToActive
  }: { 
    recommendation: Recommendation; 
    onDismiss: () => void;
    onComplete: () => void;
    onMoveToActive?: () => void;
  }) => (
    <div 
      className={`transition-all duration-300 ease-out ${
        recommendation.animating === 'dismiss' ? 'transform -translate-x-full opacity-0' :
        recommendation.animating === 'complete' ? 'transform translate-x-full opacity-0' :
        'transform translate-x-0 opacity-100'
      }`}
    >
      <div className="px-6 py-5">
        <div className="relative">
          {/* Top right action - varies by status */}
          {recommendation.status === 'active' && (
            <button 
              onClick={onDismiss}
              className="absolute top-0 right-0 text-dismiss-icon hover:text-dismiss-icon-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {recommendation.status === 'dismissed' && onMoveToActive && (
            <button 
              onClick={onMoveToActive}
              className="absolute top-0 right-0 flex items-center gap-2 text-linkedin-blue hover:underline text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Move to active
            </button>
          )}

          {/* Content */}
          <div className={recommendation.status === 'dismissed' ? 'pr-32' : 'pr-8'}>
            <h3 className="font-semibold text-gray-900 mb-1">{recommendation.title}</h3>
            <p className="text-sm text-secondary mb-4">
              {recommendation.description}
              {' '}
              <a href="#" className="text-linkedin-blue hover:underline font-medium">
                Learn more
              </a>
            </p>

            {/* Action buttons */}
            <div className="flex gap-6">
              {/* Primary CTA - show for both active and completed */}
              {(recommendation.status === 'active' || recommendation.status === 'completed') && (
                <button
                  className={`px-4 h-8 text-sm font-medium rounded-[16px] border transition-colors ${
                    recommendation.primaryButton.variant === 'outline'
                      ? 'border-linkedin-blue text-linkedin-blue hover:bg-blue-50'
                      : 'bg-linkedin-blue text-white border-linkedin-blue hover:bg-linkedin-blue-dark'
                  } flex items-center gap-2`}
                >
                  {recommendation.primaryButton.text}
                  {recommendation.primaryButton.icon && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3" />
                    </svg>
                  )}
                </button>
              )}

              {/* Mark complete button - only show for active, text-only style */}
              {recommendation.status === 'active' && (
                <button 
                  onClick={onComplete}
                  className="px-0 h-8 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center"
                >
                  {recommendation.secondaryButton.text}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
              <h1 className="text-2xl font-semibold text-gray-900">Recommendations</h1>
            </div>
          </div>

          {/* Gray Background Section */}
          <div className="bg-page-canvas min-h-screen">
            <div className="p-8 space-y-6">
              {/* Filter Pills */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4">
                  <div className="flex gap-2">
                    {[
                      { key: 'Active', label: `Active (${totalActive})` },
                      { key: 'Completed', label: `Completed${totalCompleted > 0 ? ` (${totalCompleted})` : ''}` },
                      { key: 'Dismissed', label: `Dismissed${totalDismissed > 0 ? ` (${totalDismissed})` : ''}` }
                    ].map((tab) => {
                      const isSelected = activeTab === tab.key;
                      
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`px-4 h-8 text-sm font-medium rounded-[16px] border transition-colors flex items-center ${
                            isSelected
                              ? 'bg-[#01754f] text-white border-[#01754f]'
                              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* LinkedIn Recruiter Section */}
              {shouldShowRecruiterSection() && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden pt-1">
                  {/* Section Header */}
                  <div className="px-6 border-b border-gray-200 flex flex-col justify-center" style={{ height: '110px' }}>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">Onboard to LinkedIn Recruiter</h2>
                                              <p className="text-sm text-secondary mb-1">Complete basic steps to find and hire quality talent for your company</p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-4 py-1">
                                              <span className="text-sm text-secondary w-6">{recruiterCompleted}/{recruiterTotal}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#01754F] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${recruiterTotal > 0 ? (recruiterCompleted / recruiterTotal) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Cards */}
                  <div className="divide-y divide-gray-200">
                    {visibleRecruiterRecommendations.map((rec) => (
                      <RecommendationCard
                        key={rec.id}
                        recommendation={rec}
                        onDismiss={() => handleDismiss(rec.id)}
                        onComplete={() => handleMarkComplete(rec.id)}
                        onMoveToActive={() => handleMoveToActive(rec.id)}
                      />
                    ))}
                  </div>

                  {/* Show More/Less Footer - White Background, Centered */}
                  {(() => {
                    const filteredCount = activeTab === 'Active' ? recruiterActive : 
                                         activeTab === 'Completed' ? recruiterCompleted : 
                                         recruiterDismissed;
                    return filteredCount > 3 && (
                      <div className="px-6 py-4 bg-white border-t border-gray-200 text-center">
                        <button
                          onClick={() => setRecruiterExpanded(!recruiterExpanded)}
                          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {recruiterExpanded ? 'Show less' : `Show ${filteredCount - 3} more`}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* LinkedIn Jobs Section */}
              {shouldShowJobsSection() && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden pt-1">
                  {/* Section Header */}
                  <div className="px-6 border-b border-gray-200 flex flex-col justify-center" style={{ height: '110px' }}>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">Onboard to LinkedIn Jobs</h2>
                                              <p className="text-sm text-secondary mb-1">Complete basic steps to effectively post and promote your jobs</p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-4 py-1">
                                              <span className="text-sm text-secondary w-6">{jobsCompleted}/{jobsTotal}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#01754F] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${jobsTotal > 0 ? (jobsCompleted / jobsTotal) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Cards */}
                  <div className="divide-y divide-gray-200">
                    {visibleJobsRecommendations.map((rec) => (
                      <RecommendationCard
                        key={rec.id}
                        recommendation={rec}
                        onDismiss={() => handleDismiss(rec.id)}
                        onComplete={() => handleMarkComplete(rec.id)}
                        onMoveToActive={() => handleMoveToActive(rec.id)}
                      />
                    ))}
                  </div>

                  {/* Show More/Less Footer - White Background, Centered */}
                  {(() => {
                    const filteredCount = activeTab === 'Active' ? jobsActive : 
                                         activeTab === 'Completed' ? jobsCompleted : 
                                         jobsDismissed;
                    return filteredCount > 3 && (
                      <div className="px-6 py-4 bg-white border-t border-gray-200 text-center">
                        <button
                          onClick={() => setJobsExpanded(!jobsExpanded)}
                          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {jobsExpanded ? 'Show less' : `Show ${filteredCount - 3} more`}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Show empty state if no recommendations in current tab */}
              {!hasAnyRecommendations() && <EmptyState />}
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      <Toast />
    </div>
  );
} 