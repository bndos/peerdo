import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, HStack, Img, VStack } from "@chakra-ui/react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaDesktop,
  FaCog,
} from "react-icons/fa";
import { useStyleConfig } from "@chakra-ui/react";

const DisplaySlashIcon = (props) => (
  /* ... existing DisplaySlashIcon component code ... */
  <svg viewBox="0 0 640 512" {...props}>
    <path
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="40"
      d="M576 0H64C28.65 0 0 28.65 0 64v320c0 35.35 28.65 64 64 64h192v48c0 13.25 10.75 24 24 24h192c13.25 0 24-10.75 24-24v-48h192c35.35 0 64-28.65 64-64V64c0-35.35-28.65-64-64-64zM352 472c0 4.418-3.582 8-8 8H296c-4.418 0-8-3.582-8-8v-48h64v48zM608 384c0 17.674-14.326 32-32 32H64c-17.674 0-32-14.326-32-32V64c0-17.674 14.326-32 32-32h512c17.674 0 32 14.326 32 32v320z"
    />
    <line
      x2="-32"
      y2="511"
      x1="639"
      y1="-64"
      stroke="currentColor"
      strokeWidth="64"
      transform="rotate(90, 303.5, 223.5)"
    />
  </svg>
);

const CallControl = (options) => {
  const [audioEnabled, setAudioEnabled] = useState(
    options.audioEnabled || false
  );
  const [videoEnabled, setVideoEnabled] = useState(
    options.videoEnabled || false
  );
  const [shareScreenEnabled, setShareScreenEnabled] = useState(
    options.shareScreenEnabled || false
  );
  const [audioStream, setAudioStream] = useState(options.audioStream || null);
  const [videoStream, setVideoStream] = useState(options.videoStream || null);
  const [shareScreenStream, setShareScreenStream] = useState(
    options.shareScreenStream || null
  );

  const videoRef = useRef(null);
  const shareScreenRef = useRef(null);

  const iconButtonStyle = useStyleConfig("IconButton", { variant: "call" });
  const callControlStyle = useStyleConfig("Box", { variant: "callControl" });

  useEffect(() => {
    if (videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  useEffect(() => {
    if (shareScreenStream && shareScreenRef.current) {
      shareScreenRef.current.srcObject = shareScreenStream;
    }
  }, [shareScreenStream]);

  const toggleStream = async (
    enabled,
    setEnabled,
    stream,
    setStream,
    constraints
  ) => {
    try {
      setEnabled(!enabled);
      if (enabled) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        setStream(null);
      } else {
        const newStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        setStream(newStream);
      }
    } catch (error) {
      setEnabled(false);
      console.error("Error toggling stream", error);
    }
  };

  const handleAudioToggle = async () => {
    toggleStream(audioEnabled, setAudioEnabled, audioStream, setAudioStream, {
      audio: true,
    });
  };

  const handleVideoToggle = async () => {
    toggleStream(videoEnabled, setVideoEnabled, videoStream, setVideoStream, {
      video: true,
    });
  };

  const handleShareScreenToggle = async () => {
    toggleStream(
      shareScreenEnabled,
      setShareScreenEnabled,
      shareScreenStream,
      setShareScreenStream,
      { video: { mediaSource: "screen" } }
    );
  };

  return (
    <Box sx={callControlStyle} p="1" borderRadius="md" m="4">
      <VStack>
        <HStack pt="1" spacing="1" justifyContent="space-evenly">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="10%"
            maxW={{ base: "70%", md: "60%" }}
            maxH={{ base: "70%", md: "60%" }}
            mx="auto" // add mx="auto" to center horizontally
            overflow="hidden"
          >
            {videoEnabled ? (
              <video ref={videoRef} autoPlay />
            ) : (
              <Img src="/images/inattention.png" />
            )}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="10%"
            maxW={{ base: "70%", md: "60%" }}
            maxH={{ base: "70%", md: "60%" }}
            mx="auto" // add mx="auto" to center horizontally
            overflow="hidden"
          >
            {shareScreenEnabled && <video autoPlay ref={shareScreenRef} />}
          </Box>
        </HStack>
        <HStack pt="0" spacing="1" justifyContent="space-evenly">
          <IconButton
            sx={iconButtonStyle}
            aria-label="Toggle audio"
            icon={audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
            onClick={handleAudioToggle}
          />
          <IconButton
            sx={iconButtonStyle}
            aria-label="Toggle video"
            icon={videoEnabled ? <FaVideo /> : <FaVideoSlash />}
            onClick={handleVideoToggle}
          />
          <IconButton
            sx={iconButtonStyle}
            aria-label="Share screen"
            icon={
              shareScreenEnabled ? (
                <FaDesktop />
              ) : (
                <DisplaySlashIcon width="1em" height="1em" />
              )
            }
            onClick={handleShareScreenToggle}
          />
          <IconButton
            sx={iconButtonStyle}
            aria-label="Settings"
            icon={<FaCog />}
          />
        </HStack>
      </VStack>
    </Box>
  );
};

export default CallControl;
