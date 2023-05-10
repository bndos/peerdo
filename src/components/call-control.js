import React, { useState, useRef } from "react";
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

const CallControl = () => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [shareScreenEnabled, setShareScreenEnabled] = useState(false);
  const videoRef = useRef(null);
  const shareScreenRef = useRef(null);

  const iconButtonStyle = useStyleConfig("IconButton", { variant: "call" });
  const callControlStyle = useStyleConfig("Box", { variant: "callControl" });

  const handleAudioToggle = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioEnabled(!audioEnabled);
      if (audioEnabled) {
        stream.getAudioTracks()[0].enabled = false;
      } else {
        stream.getAudioTracks()[0].enabled = true;
      }
    } catch (error) {
      console.error("Error getting audio device", error);
    }
  };
  const handleVideoToggle = async () => {
    try {
      setVideoEnabled(!videoEnabled);
      if (videoEnabled) {
        // Stop the screen sharing stream and switch back to the camera stream
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        videoRef.current.srcObject = null;
        console.log("Stopped screen sharing");
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        // Switch to the screen sharing stream
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error sharing screen", error);
    }
  };

  const handleShareScreenToggle = async () => {
    try {
      setShareScreenEnabled(!shareScreenEnabled);
      if (shareScreenEnabled) {
        // Stop the screen sharing stream and switch back to the camera stream
        const stream = shareScreenRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        shareScreenRef.current.srcObject = null;
        console.log("Stopped screen sharing");
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        // Switch to the screen sharing stream
        shareScreenRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error sharing screen", error);
    }
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
