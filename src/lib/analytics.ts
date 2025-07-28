import ReactGA from 'react-ga4';

// Initialize Google Analytics only in production
const initializeAnalytics = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA_MEASUREMENT_ID) {
    ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
    console.log('Google Analytics initialized');
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA_MEASUREMENT_ID) {
    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: title,
    });
  }
};

// Track custom events
export const trackEvent = (category: string, action: string, label?: string) => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA_MEASUREMENT_ID) {
    ReactGA.event({
      category: category,
      action: action,
      label: label,
    });
  }
};

// Track exceptions
export const trackException = (description: string, fatal = false) => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA_MEASUREMENT_ID) {
    ReactGA.gtag('event', 'exception', {
      description: description,
      fatal: fatal,
    });
  }
};

export default initializeAnalytics;
