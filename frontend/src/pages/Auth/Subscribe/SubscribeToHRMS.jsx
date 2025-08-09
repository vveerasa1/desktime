import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscribeToHRMS = () => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    // Placeholder for subscription logic
    alert('Subscription process to HRMS initiated.');
    // After subscription, redirect to dashboard or refresh
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Subscribe to TrackME</h2>
      <p>You currently do not have access to TrackME features.</p>
      <p>Please subscribe to gain access.</p>
      <button onClick={handleSubscribe} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
        Subscribe Now
      </button>
    </div>
  );
};

export default SubscribeToHRMS;
