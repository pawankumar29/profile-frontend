import React, { useEffect } from 'react';
import { PROFILE_API_BASE, withProfileAuth } from '../../lib/api';
import { getStoredAuthToken, storeAuthSession } from '../../lib/auth';

/**
 * SessionInitializer handles the automatic identification of visitors
 * by calling /api/setUser as soon as the application loads.
 * This ensures that a valid token is available for all protected API calls
 * (like getting admin details for the footer) regardless of which page the user is on.
 */
function SessionInitializer() {
  useEffect(() => {
    const initializeSession = async () => {
      try {
        let token = getStoredAuthToken();

        // If no token exists, identify the visitor
        if (!token) {
          console.log('[SessionInitializer] Initializing guest session...');
          const response = await fetch(`${PROFILE_API_BASE}/api/setUser`, {
            method: 'POST',
            headers: await withProfileAuth({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({}),
          });

          if (!response.ok) {
            throw new Error('Failed to initialize auth session');
          }

          const data = await response.json();
          
          storeAuthSession({
            token: data.token,
            email: data.user?.email,
            name: data.user?.firstName ? `${data.user.firstName} ${data.user.lastName || ''}`.trim() : '',
            phone: data.user?.phone || '',
            country: data.user?.country || '',
          });
          
          console.log('[SessionInitializer] Guest session established.');
          
          // Trigger a storage event to notify other components (like Footer) 
          // that the session is now ready
          window.dispatchEvent(new Event('session-ready'));
        }
      } catch (err) {
        console.error('[SessionInitializer] Authentication initialization failed:', err);
      }
    };

    initializeSession();
  }, []);

  return null; // This component doesn't render anything
}

export default SessionInitializer;
