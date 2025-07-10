/**
 * Utility functions for handling image URLs, especially LinkedIn URLs
 */

export const isLinkedInUrl = (url: string): boolean => {
  return url.includes('licdn.com') || url.includes('linkedin.com');
};

export const sanitizeLinkedInUrl = (url: string): string => {
  if (!isLinkedInUrl(url)) {
    return url;
  }
  
  // LinkedIn URLs might contain special characters that need encoding
  try {
    // Decode first in case it's already encoded
    const decoded = decodeURIComponent(url);
    // Re-encode to ensure proper formatting
    return encodeURI(decoded);
  } catch (error) {
    console.warn('Error sanitizing LinkedIn URL:', url, error);
    return url;
  }
};

export const getImageFallback = (type: 'logo' | 'cover'): string => {
  switch (type) {
    case 'logo':
      return '/default.png'; // Using the existing default.png
    case 'cover':
      return '/cover_backup_sdaia.png';
    default:
      return '/default.png';
  }
};

export const logImageError = (url: string, alt: string, error?: any) => {
  console.warn(`Image failed to load:`, {
    url,
    alt,
    isLinkedIn: isLinkedInUrl(url),
    error: error?.message || 'Unknown error'
  });
}; 