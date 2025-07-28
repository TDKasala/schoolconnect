import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/analytics';

const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null; // This component doesn't render anything
};

export default AnalyticsTracker;
