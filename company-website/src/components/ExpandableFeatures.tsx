'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

interface ExpandableFeaturesProps {
  features: string[];
  maxVisible?: number;
  className?: string;
  iconType?: 'check' | 'dot';
}

const ExpandableFeatures: React.FC<ExpandableFeaturesProps> = ({
  features,
  maxVisible = 3,
  className = '',
  iconType = 'dot'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!features || features.length === 0) {
    return null;
  }

  const visibleFeatures = isExpanded ? features : features.slice(0, maxVisible);
  const hasMoreFeatures = features.length > maxVisible;

  return (
    <div className={`space-y-2 ${className}`}>
      <AnimatePresence>
        {visibleFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
          >
            {iconType === 'check' ? (
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
            ) : (
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0"></div>
            )}
            <span>{feature}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMoreFeatures && (
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline mt-2 transition-colors"
        >
          <span>
            {isExpanded 
              ? 'عرض أقل' 
              : `عرض ${features.length - maxVisible} مميزات أخرى`
            }
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 mr-1" />
          ) : (
            <ChevronDown className="w-4 h-4 mr-1" />
          )}
        </motion.button>
      )}
    </div>
  );
};

export default ExpandableFeatures;
