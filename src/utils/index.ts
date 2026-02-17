// Utility functions for Allowance App

/**
 * Format cents to dollar string
 * 5000 -> "$50.00"
 */
export const formatDollars = (cents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

/**
 * Format timestamp to readable date
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format timestamp to relative time
 * "2 hours ago", "Yesterday", etc.
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  
  return formatDate(timestamp);
};

/**
 * Format card number with masking
 * "4242424242424242" -> "•••• •••• •••• 4242"
 */
export const formatCardNumber = (number: string): string => {
  const cleaned = number.replace(/\s/g, '');
  const lastFour = cleaned.slice(-4);
  return `•••• •••• •••• ${lastFour}`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Generate display name from first name
 */
export const getDisplayName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};
