import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAdminUser, setInitialized } from '../../store/slices/userSlice';

function SessionInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeData = async () => {
      try {
        await dispatch(fetchAdminUser()).unwrap();
        dispatch(setInitialized(true));
      } catch (err) {
        console.error('[SessionInitializer] Failed to initialize public data:', err);
        dispatch(setInitialized(true));
      }
    };

    initializeData();
  }, [dispatch]);

  return null;
}

export default SessionInitializer;
