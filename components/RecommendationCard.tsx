import React from 'react';

interface RecommendationCardProps {
  title: string;
  description: string;
  primaryButton: {
    text: string;
    variant?: 'primary' | 'outline';
    icon?: boolean;
  };
  secondaryButton?: {
    text: string;
  };
  learnMoreLink?: boolean;
  onDismiss?: () => void;
}

export default function RecommendationCard({
  title,
  description,
  primaryButton,
  secondaryButton,
  learnMoreLink = true,
  onDismiss
}: RecommendationCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 relative">
      {/* Dismiss button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-dismiss-icon hover:text-dismiss-icon-hover"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Content */}
      <div className="pr-8">
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-secondary mb-4">
          {description}
          {learnMoreLink && (
            <span>
              {' '}
              <a href="#" className="text-linkedin-blue hover:underline">
                Learn more
              </a>
            </span>
          )}
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 text-sm font-medium rounded border transition-colors ${
              primaryButton.variant === 'outline'
                ? 'border-linkedin-blue text-linkedin-blue hover:bg-blue-50'
                : 'bg-linkedin-blue text-white border-linkedin-blue hover:bg-linkedin-blue-dark'
            } flex items-center gap-2`}
          >
            {primaryButton.text}
            {primaryButton.icon && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3" />
              </svg>
            )}
          </button>

          {secondaryButton && (
            <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              {secondaryButton.text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 