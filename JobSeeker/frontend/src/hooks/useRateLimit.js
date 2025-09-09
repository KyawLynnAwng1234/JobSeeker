import { useState, useEffect, useCallback } from 'react';

const useRateLimit = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(null);
  const [rateLimitMessage, setRateLimitMessage] = useState('');

  // Countdown effect
  useEffect(() => {
    let interval;
    if (isRateLimited && retryAfter > 0) {
      interval = setInterval(() => {
        setRetryAfter(prev => {
          if (prev <= 1) {
            setIsRateLimited(false);
            setRateLimitMessage('');
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRateLimited, retryAfter]);

  // Function to handle rate limit errors
  const handleRateLimitError = useCallback((error) => {
    if (error.response?.status === 429) {
      const errorData = error.response.data;
      
      // Extract retry-after from headers or response data
      const retryAfterHeader = error.response.headers['retry-after'];
      const retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader) : 60; // Default to 60 seconds
      
      // Set rate limit message
      let message = 'Too many requests. Please try again later.';
      if (errorData?.detail) {
        message = errorData.detail;
      } else if (errorData?.error) {
        message = errorData.error;
      } else if (errorData?.message) {
        message = errorData.message;
      }
      
      setIsRateLimited(true);
      setRetryAfter(retryAfterSeconds);
      setRateLimitMessage(message);
      
      return true; // Indicates this was a rate limit error
    }
    return false; // Not a rate limit error
  }, []);

  // Function to manually clear rate limit state
  const clearRateLimit = useCallback(() => {
    setIsRateLimited(false);
    setRetryAfter(null);
    setRateLimitMessage('');
  }, []);

  // Function to check if an action should be blocked
  const isBlocked = useCallback(() => {
    return isRateLimited && retryAfter > 0;
  }, [isRateLimited, retryAfter]);

  return {
    isRateLimited,
    retryAfter,
    rateLimitMessage,
    handleRateLimitError,
    clearRateLimit,
    isBlocked
  };
};

export default useRateLimit;