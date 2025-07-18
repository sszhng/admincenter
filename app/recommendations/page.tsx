'use client';

import React, { useState, useEffect } from 'react';
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

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState('Active');
  const [recruiterExpanded, setRecruiterExpanded] = useState(false);
  const [jobsExpanded, setJobsExpanded] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  // All LinkedIn Recruiter recommendations (4 total)
  const [recruiterRecommendations, setRecruiterRecommendations] = useState<Recommendation[]>([
    {
      id: 'recruiter-1',
      title: 'Assign a license to a new user',
      description: 'Invite new Recruiter users by assigning your first license. Tip: The "Recruiter User" role is commonly used role for job posting and recruiting.',
      primaryButton: { text: 'Add a new user', variant: 'outline' as const },
      secondaryButton: { text: 'Mark complete' },
      status: 'active'
    },
    {
      id: 'recruiter-2',
      title: 'Share resources to get users started with Recruiter',
      description: 'Share self-guided resources to help your organization learn Recruiter basics.',
      primaryButton: { text: 'Explore resources', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active'
    },
    {
      id: 'recruiter-3',
      title: 'Explore all hiring integrations',
      description: 'Save up to 3.5 hours a week for your users by integrating Recruiter with your ATS, CRM, and more.',
      primaryButton: { text: 'Find integrations', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active'
    },
    {
      id: 'recruiter-4',
      title: 'Sign up for the Recruiter admin webinar',
      description: 'Join an interactive, live webinar to learn about admin capabilities, and how to set your team up for success.',
      primaryButton: { text: 'Sign up', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active'
    }
  ]);

  // All LinkedIn Jobs recommendations (5 total)
  const [jobsRecommendations, setJobsRecommendations] = useState<Recommendation[]>([
    {
      id: 'jobs-1',
      title: 'Learn how to start posting jobs',
      description: 'Review learning resources to help your organization learn the basics of Jobs.',
      primaryButton: { text: 'Explore resources', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active'
    },
    {
      id: 'jobs-2',
      title: 'Add a job source to Recruiter',
      description: 'Connect your ATS or other job sources to ensure 100% utilization of your job slots and save time by automating job posting on LinkedIn, if you have an eligible source.',
      primaryButton: { text: 'Add job source', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active'
    },
    {
      id: 'jobs-3',
      title: 'Set up applicant source tracking code',
      description: 'Track candidates from click to application completion on your applicant tracking system (ATS), if you added a job source.',
      primaryButton: { text: 'Set up tracking', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active'
    },
    {
      id: 'jobs-4',
      title: 'Allocate job slots to users',
      description: 'Allocate job slots to Recruiter seats, if you added a job source.',
      primaryButton: { text: 'Activate job slots', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active'
    },
    {
      id: 'jobs-5',
      title: 'Set up promotions',
      description: 'Explore and manage job promotion settings for all users, such as promotion and exclusion rules if you added a job source.',
      primaryButton: { text: 'Manage settings', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active'
    }
  ]);

  // Filter recommendations based on active tab and expansion state
  const getFilteredRecommendations = (recommendations: Recommendation[], expanded: boolean) => {
    let filtered = recommendations;
    
    if (activeTab === 'Active (9)') {
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

  // Calculate counts for progress bars
  const recruiterActive = recruiterRecommendations.filter(rec => rec.status === 'active').length;
  const recruiterCompleted = recruiterRecommendations.filter(rec => rec.status === 'completed').length;
  const recruiterTotal = recruiterRecommendations.filter(rec => rec.status !== 'dismissed').length;

  const jobsActive = jobsRecommendations.filter(rec => rec.status === 'active').length;
  const jobsCompleted = jobsRecommendations.filter(rec => rec.status === 'completed').length;
  const jobsTotal = jobsRecommendations.filter(rec => rec.status !== 'dismissed').length;

  // Calculate total active recommendations for tab
  const totalActive = recruiterActive + jobsActive;

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
  const handleDismiss = (id: string, type: 'recruiter' | 'jobs') => {
    const updateRecommendations = type === 'recruiter' ? setRecruiterRecommendations : setJobsRecommendations;
    
    // Start animation
    updateRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, animating: 'dismiss' } : rec)
    );

    // After animation, update status
    setTimeout(() => {
      updateRecommendations(prev => 
        prev.map(rec => rec.id === id ? { ...rec, status: 'dismissed', animating: null } : rec)
      );
    }, 300);
  };

  // Handle mark complete
  const handleMarkComplete = (id: string, type: 'recruiter' | 'jobs', title: string) => {
    const updateRecommendations = type === 'recruiter' ? setRecruiterRecommendations : setJobsRecommendations;
    
    // Start animation
    updateRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, animating: 'complete' } : rec)
    );

    // After animation, update status and show toast
    setTimeout(() => {
      updateRecommendations(prev => 
        prev.map(rec => rec.id === id ? { ...rec, status: 'completed', animating: null } : rec)
      );
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
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  const RecommendationCard = ({ rec, type, onDismiss, onComplete }: { 
    rec: Recommendation, 
    type: 'recruiter' | 'jobs',
    onDismiss: () => void,
    onComplete: () => void 
  }) => (
    <div className="p-6">
      <div className="relative">
        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="pr-8">
          <h3 className="font-semibold text-gray-900 mb-2">{rec.title}</h3>
          <p className="text-sm text-gray-600 mb-4">
            {rec.description}
            {' '}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Learn more
            </a>
          </p>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-2xl border transition-colors ${
                rec.primaryButton.variant === 'outline'
                  ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              } flex items-center gap-2`}
            >
              {rec.primaryButton.text}
              {rec.primaryButton.icon && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              )}
            </button>

            <button 
              onClick={onComplete}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              {rec.secondaryButton.text}
            </button>
          </div>
        </div>
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
              <h1 className="text-2xl font-semibold text-gray-900">Recommendations</h1>
            </div>
          </div>

          {/* Content - Gray Background */}
          <div className="p-8 space-y-6">
            {/* Filter Pills */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4">
                <div className="flex gap-2">
                  {[`Active (${totalActive})`, 'Completed', 'Dismissed'].map((tab) => {
                    const tabKey = tab.startsWith('Active') ? 'Active' : tab;
                    const isSelected = activeTab === tabKey;
                    
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tabKey)}
                        className={`px-4 py-1 text-sm font-medium rounded-2xl border transition-colors ${
                          isSelected
                            ? 'bg-[#01754f] text-white border-[#01754f]'
                            : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* LinkedIn Recruiter Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Onboard to LinkedIn Recruiter</h2>
                    <p className="text-sm text-gray-600">Complete basic steps to find and hire quality talent for your company</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-4 py-1">
                    <span className="text-sm text-gray-600 w-6">{recruiterCompleted}/{recruiterTotal}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-linkedin-blue h-2 rounded-full transition-all duration-500"
                        style={{ width: `${recruiterTotal > 0 ? (recruiterCompleted / recruiterTotal) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="divide-y divide-gray-200">
                {visibleRecruiterRecommendations.map((rec) => (
                  <div 
                    key={rec.id} 
                    className={`transition-all duration-300 ease-out ${
                      rec.animating === 'dismiss' ? 'transform -translate-x-full opacity-0' :
                      rec.animating === 'complete' ? 'transform translate-x-full opacity-0' :
                      'transform translate-x-0 opacity-100'
                    }`}
                  >
                    <RecommendationCard
                      rec={rec}
                      type="recruiter"
                      onDismiss={() => handleDismiss(rec.id, 'recruiter')}
                      onComplete={() => handleMarkComplete(rec.id, 'recruiter', rec.title)}
                    />
                  </div>
                ))}
              </div>

              {/* Show More/Less Footer - White Background, Centered */}
              {activeTab === 'Active' && recruiterActive > 3 && (
                <div className="px-6 py-4 bg-white border-t border-gray-200 text-center">
                  <button
                    onClick={() => setRecruiterExpanded(!recruiterExpanded)}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {recruiterExpanded ? 'Show less' : `Show ${recruiterActive - 3} more`}
                  </button>
                </div>
              )}
            </div>

            {/* LinkedIn Jobs Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Onboard to LinkedIn Jobs</h2>
                    <p className="text-sm text-gray-600">Complete basic steps to post and promote jobs for your company</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-4 py-1">
                    <span className="text-sm text-gray-600 w-6">{jobsCompleted}/{jobsTotal}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-linkedin-blue h-2 rounded-full transition-all duration-500"
                        style={{ width: `${jobsTotal > 0 ? (jobsCompleted / jobsTotal) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="divide-y divide-gray-200">
                {visibleJobsRecommendations.map((rec) => (
                  <div 
                    key={rec.id} 
                    className={`transition-all duration-300 ease-out ${
                      rec.animating === 'dismiss' ? 'transform -translate-x-full opacity-0' :
                      rec.animating === 'complete' ? 'transform translate-x-full opacity-0' :
                      'transform translate-x-0 opacity-100'
                    }`}
                  >
                    <RecommendationCard
                      rec={rec}
                      type="jobs"
                      onDismiss={() => handleDismiss(rec.id, 'jobs')}
                      onComplete={() => handleMarkComplete(rec.id, 'jobs', rec.title)}
                    />
                  </div>
                ))}
              </div>

              {/* Show More/Less Footer - White Background, Centered */}
              {activeTab === 'Active' && jobsActive > 3 && (
                <div className="px-6 py-4 bg-white border-t border-gray-200 text-center">
                  <button
                    onClick={() => setJobsExpanded(!jobsExpanded)}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {jobsExpanded ? 'Show less' : `Show ${jobsActive - 3} more`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      <Toast />
    </div>
  );
} 