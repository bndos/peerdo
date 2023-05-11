import React, { createContext, useState, useEffect } from "react";

export const P2PContext = createContext();

export const P2PProvider = ({ children }) => {
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const servers = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
        {
          urls: "turn:global.turn.twilio.com:3478?transport=udp",
          username: "your_twilio_account_sid",
          credential: "your_twilio_auth_token",
        },
        {
          urls: "turn:global.turn.twilio.com:3478?transport=tcp",
          username: "your_twilio_account_sid",
          credential: "your_twilio_auth_token",
        },
      ],
      iceCandidatePoolSize: 10,
    };

    const peerConnection = new RTCPeerConnection(servers);

    setPeerConnection(peerConnection);

    return () => {
      peerConnection.close();
    };
  }, []);

  return (
    <P2PContext.Provider value={{ peerConnection }}>
      {children}
    </P2PContext.Provider>
  );
};
