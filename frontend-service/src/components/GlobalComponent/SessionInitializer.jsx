import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PROFILE_API_BASE, withProfileAuth } from '../../lib/api';
import { fetchAdminUser, setInitialized, clearUser } from '../../store/slices/userSlice';

/**
 * SessionInitializer handles the automatic identification of visitors.
 * It uses Level-3 HttpOnly cookies for maximum security.
 */
function SessionInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        console.log('[SessionInitializer] Checking for existing secure session...');
        
        // 1. Try to fetch admin details. If this succeeds, the browser already has a valid auth cookie.
        try {
          await dispatch(fetchAdminUser()).unwrap();
          console.log('[SessionInitializer] Secure session confirmed via cookie.');
          dispatch(setInitialized(true));
          return;
        } catch (err) {
          console.log('[SessionInitializer] No active session or cookie expired. Initializing new...');
          dispatch(clearUser());
        }

        // 2. No session? Initialize as a guest. The browser will receive a Set-Cookie header.
        const response = await fetch(`${PROFILE_API_BASE}/api/setUser`, {
          method: 'POST',
          credentials: 'include', // Important: Ensures the browser accepts and stores the HttpOnly cookie
          headers: await withProfileAuth({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error('Failed to initialize auth session');
        }

        const data = await response.json();
        
        console.log('[SessionInitializer] New secure session established.');
        
        // 3. Confirm readiness and fetch final data
        dispatch(setInitialized(true));
        dispatch(fetchAdminUser());

        // Notify legacy components
        window.dispatchEvent(new Event('session-ready'));
      } catch (err) {
        console.error('[SessionInitializer] Critical Authentication Failure:', err);
      }
    };

    initializeSession();
  }, [dispatch]);

  return null; // This component doesn't render anything
}

export default SessionInitializer;
