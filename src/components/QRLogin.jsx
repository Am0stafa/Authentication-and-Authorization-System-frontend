import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';

const QRLogin = () => {
  const [showQRReader, setShowQRReader] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ws;
    if (sessionId) {
      // Establish WebSocket connection
      ws = new WebSocket(`ws://localhost:8081?session_id=${sessionId}`);
      ws.onopen = () => {
        console.log('WebSocket connection established');
        // Send an authentication request to the server
        ws.send(JSON.stringify({ action: 'authenticate' }));
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === 'authenticated') {
          console.log('Authentication successful', data);
          // Handle the received tokens here. For example, store them in localStorage or cookies
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          // Navigate to a different route upon successful authentication
          navigate('/'); // Adjust the route as necessary
        } else if (data.status === 'error') {
          console.error('Authentication error:', data.message);
          // Handle authentication error (e.g., show an error message to the user)
        }
      };
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [sessionId, navigate]);

  const handleScan = (data) => {
    if (data) {
      // Assuming the QR code data is a URL with a session_id query parameter
      const url = new URL(data);
      const session_id = url.searchParams.get('session_id');
      if (session_id) {
        setSessionId(session_id);
      } else {
        console.error('Invalid QR code data:', data);
      }
    }
  };

  const handleError = (error) => {
    console.error('Error scanning QR code:', error);
  };

  return (
    <div>
      <button onClick={() => setShowQRReader(!showQRReader)}>
        {showQRReader ? 'Cancel Scan' : 'Scan QR Code to Login'}
      </button>
      {showQRReader && (
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      )}
    </div>
  );
};

export default QRLogin;