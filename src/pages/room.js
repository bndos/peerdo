import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  useStyleConfig,
} from "@chakra-ui/react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FaCog,
  FaDesktop,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";

import { auth } from "../lib/firebase";

const DisplaySlashIcon = (props) => (
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
      stroke-width="64"
      transform="rotate(90, 303.5, 223.5)"
    />
  </svg>
);

const Room = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [shareScreenEnabled, setShareScreenEnabled] = useState(false);

  useEffect(() => {
    // Get the currently logged in user's email address
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      // If there is no logged in user, redirect to login page
      router.push("/login");
    }
  }, [router]);

  const boxStyle = useStyleConfig("Box", { variant: "call" });
  const iconButtonStyle = useStyleConfig("IconButton", { variant: "call" });

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoEnabled(!videoEnabled);
      if (videoEnabled) {
        stream.getVideoTracks()[0].enabled = false;
      } else {
        stream.getVideoTracks()[0].enabled = true;
      }
    } catch (error) {
      console.error("Error getting video device", error);
    }
  };

  const handleShareScreenToggle = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setShareScreenEnabled(!shareScreenEnabled);
      if (shareScreenEnabled) {
        stream.getVideoTracks()[0].stop();
      } else {
        const sender = peerConnection
          .getSenders()
          .find((s) => s.track.kind === "video");
        sender.replaceTrack(stream.getVideoTracks()[0]);
      }
    } catch (error) {
      console.error("Error sharing screen", error);
    }
  };

  return (
    <div>
      {user ? (
        <Box
          sx={boxStyle}
          position="fixed"
          top="0"
          left="0"
          bottom="0"
          width="300px"
          px="4"
          py="8"
        >
          <Heading mt="10" size="lg" mb="4" textAlign="center">
            New room
          </Heading>
          <Flex flexDirection="column" mb="4">
            <FormControl id="room-name">
              <FormLabel textAlign="center">Room name</FormLabel>
              <Input type="text" placeholder="Enter code" />
            </FormControl>
            <Button variant="custom" width="100%" mt="2">
              Create
            </Button>
          </Flex>
          <HStack spacing="4" justifyContent="space-evenly">
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
        </Box>
      ) : (
        <h1>Please sign in to continue</h1>
      )}
      {/* Other room page content here */}
    </div>
  );
};

export default Room;
