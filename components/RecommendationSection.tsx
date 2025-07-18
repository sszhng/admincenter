import React, { useState } from 'react';
import RecommendationCard from './RecommendationCard';

interface RecommendationItem {
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
}

interface RecommendationSectionProps {
  title: string;
  subtitle: string;
  progress: string;
  items: RecommendationItem[];
  showMoreText?: string;
}

export default function RecommendationSection({
  title,
  subtitle,
  progress,
  items,
  showMoreText
}: RecommendationSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [dismissedItems, setDismissedItems] = useState<number[]>([]);

  const handleDismiss = (index: number) => {
    setDismissedItems(prev => [...prev, index]);
  };

  const visibleItems = showAll ? items : items.slice(0, 3);
  const filteredItems = visibleItems.filter((_, index) => !dismissedItems.includes(index));
  const remainingCount = items.length - (showAll ? 0 : Math.min(3, items.length)) - dismissedItems.length;

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-secondary mb-2">{subtitle}</p>
        <div className="text-sm text-gray-500">{progress}</div>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <RecommendationCard
            key={index}
            title={item.title}
            description={item.description}
            primaryButton={item.primaryButton}
            secondaryButton={item.secondaryButton}
            learnMoreLink={item.learnMoreLink}
            onDismiss={() => handleDismiss(index)}
          />
        ))}
      </div>

      {/* Show More Button */}
      {remainingCount > 0 && showMoreText && (
        <button
          onClick={() => setShowAll(true)}
          className="text-blue-600 hover:underline text-sm font-medium mt-4"
        >
          {showMoreText}
        </button>
      )}
    </div>
  );
} 