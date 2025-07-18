'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  primaryButton: { text: string; variant: 'outline' | 'primary'; icon?: boolean };
  secondaryButton: { text: string };
  status: 'active' | 'dismissed' | 'completed';
  animating?: 'dismiss' | 'complete' | null;
  category: 'recruiter' | 'jobs';
}

interface RecommendationsContextType {
  recommendations: Recommendation[];
  updateRecommendationStatus: (id: string, status: 'active' | 'dismissed' | 'completed') => void;
  setRecommendationAnimating: (id: string, animating: 'dismiss' | 'complete' | null) => void;
  getRecruiterRecommendations: () => Recommendation[];
  getJobsRecommendations: () => Recommendation[];
  getTotalCounts: () => {
    totalActive: number;
    totalCompleted: number;
    totalDismissed: number;
    recruiterActive: number;
    recruiterCompleted: number;
    recruiterDismissed: number;
    recruiterTotal: number;
    jobsActive: number;
    jobsCompleted: number;
    jobsDismissed: number;
    jobsTotal: number;
  };
}

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

export function useRecommendations() {
  const context = useContext(RecommendationsContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
}

interface RecommendationsProviderProps {
  children: ReactNode;
}

export function RecommendationsProvider({ children }: RecommendationsProviderProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    // Recruiter recommendations
    {
      id: 'recruiter-1',
      title: 'Assign a license to a new user',
      description: 'Invite new Recruiter users by assigning your first license. Tip: The "Recruiter User" role is commonly used role for job posting and recruiting.',
      primaryButton: { text: 'Add a new user', variant: 'outline' as const },
      secondaryButton: { text: 'Mark complete' },
      status: 'active',
      category: 'recruiter'
    },
    {
      id: 'recruiter-2',
      title: 'Share resources to get users started with Recruiter',
      description: 'Share self-guided resources to help your organization learn Recruiter basics.',
      primaryButton: { text: 'Explore resources', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active',
      category: 'recruiter'
    },
    {
      id: 'recruiter-3',
      title: 'Explore all hiring integrations',
      description: 'Save up to 3.5 hours a week for your users by integrating Recruiter with your ATS, CRM, and more.',
      primaryButton: { text: 'Find integrations', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active',
      category: 'recruiter'
    },
    {
      id: 'recruiter-4',
      title: 'Sign up for the Recruiter admin webinar',
      description: 'Join an interactive, live webinar to learn about admin capabilities, and how to set your team up for success.',
      primaryButton: { text: 'Sign up', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active',
      category: 'recruiter'
    },
    // Jobs recommendations
    {
      id: 'jobs-1',
      title: 'Learn how to start posting jobs',
      description: 'Review learning resources to help your organization learn the basics of Jobs.',
      primaryButton: { text: 'Explore resources', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active',
      category: 'jobs'
    },
    {
      id: 'jobs-2',
      title: 'Add a job source to Recruiter',
      description: 'Connect your ATS or other job sources to ensure 100% utilization of your job slots and save time by automating job posting on LinkedIn, if you have an eligible source.',
      primaryButton: { text: 'Add job source', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active',
      category: 'jobs'
    },
    {
      id: 'jobs-3',
      title: 'Set up applicant source tracking code',
      description: 'Track candidates from click to application completion on your applicant tracking system (ATS), if you added a job source.',
      primaryButton: { text: 'Set up tracking', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active',
      category: 'jobs'
    },
    {
      id: 'jobs-4',
      title: 'Allocate job slots to users',
      description: 'Allocate job slots to Recruiter seats, if you added a job source.',
      primaryButton: { text: 'Activate job slots', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active',
      category: 'jobs'
    },
    {
      id: 'jobs-5',
      title: 'Set up promotions',
      description: 'Explore and manage job promotion settings for all users, such as promotion and exclusion rules if you added a job source.',
      primaryButton: { text: 'Manage settings', variant: 'outline' as const, icon: true },
      secondaryButton: { text: 'Mark complete' },
      status: 'active',
      category: 'jobs'
    }
  ]);

  const updateRecommendationStatus = (id: string, status: 'active' | 'dismissed' | 'completed') => {
    setRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, status, animating: null } : rec)
    );
  };

  const setRecommendationAnimating = (id: string, animating: 'dismiss' | 'complete' | null) => {
    setRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, animating } : rec)
    );
  };

  const getRecruiterRecommendations = () => {
    return recommendations.filter(rec => rec.category === 'recruiter');
  };

  const getJobsRecommendations = () => {
    return recommendations.filter(rec => rec.category === 'jobs');
  };

  const getTotalCounts = () => {
    const recruiterRecs = getRecruiterRecommendations();
    const jobsRecs = getJobsRecommendations();

    const recruiterActive = recruiterRecs.filter(rec => rec.status === 'active').length;
    const recruiterCompleted = recruiterRecs.filter(rec => rec.status === 'completed').length;
    const recruiterDismissed = recruiterRecs.filter(rec => rec.status === 'dismissed').length;
    const recruiterTotal = recruiterRecs.filter(rec => rec.status !== 'dismissed').length;

    const jobsActive = jobsRecs.filter(rec => rec.status === 'active').length;
    const jobsCompleted = jobsRecs.filter(rec => rec.status === 'completed').length;
    const jobsDismissed = jobsRecs.filter(rec => rec.status === 'dismissed').length;
    const jobsTotal = jobsRecs.filter(rec => rec.status !== 'dismissed').length;

    return {
      totalActive: recruiterActive + jobsActive,
      totalCompleted: recruiterCompleted + jobsCompleted,
      totalDismissed: recruiterDismissed + jobsDismissed,
      recruiterActive,
      recruiterCompleted,
      recruiterDismissed,
      recruiterTotal,
      jobsActive,
      jobsCompleted,
      jobsDismissed,
      jobsTotal
    };
  };

  return (
    <RecommendationsContext.Provider 
      value={{
        recommendations,
        updateRecommendationStatus,
        setRecommendationAnimating,
        getRecruiterRecommendations,
        getJobsRecommendations,
        getTotalCounts
      }}
    >
      {children}
    </RecommendationsContext.Provider>
  );
} 