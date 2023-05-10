import React, { createContext, useState } from "react";

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [shareScreenEnabled, setShareScreenEnabled] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const [shareScreenStream, setShareScreenStream] = useState(null);

  return (
    <RoomContext.Provider
      value={{
        audioEnabled,
        setAudioEnabled,
        videoEnabled,
        setVideoEnabled,
        shareScreenEnabled,
        setShareScreenEnabled,
        audioStream,
        setAudioStream,
        videoStream,
        setVideoStream,
        shareScreenStream,
        setShareScreenStream,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
