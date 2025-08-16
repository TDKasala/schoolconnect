// Simple environment-aware logger for production hardening
// In development, logs pass through to console.
// In production, non-error logs are silenced; errors go to console.error.

const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

const noop = (..._args: any[]) => {};

export const logger = {
  log: isDev ? console.log.bind(console) : noop,
  debug: isDev ? console.debug?.bind(console) || console.log.bind(console) : noop,
  warn: isDev ? console.warn.bind(console) : noop,
  error: console.error.bind(console),
};

export default logger;
