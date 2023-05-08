import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Img,
  Input,
  useStyleConfig,
} from "@chakra-ui/react";

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  FaCog,
  FaDesktop,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";

import { serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "../lib/firebase";

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
      strokeWidth="64"
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
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const shareScreenRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        console.log("No user found", user);
        router.push("/login");
      }
    });

    return () => unsubscribe();
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

  const handleCreateRoom = async () => {
    setLoading(true);

    try {
      const roomRef = await firestore.collection("rooms").add({
        name: roomName,
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      router.push({
        pathname: "/[roomId]",
        query: { roomId: roomRef.id },
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
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
              <Input
                type="text"
                placeholder="Enter room name"
                onChange={handleRoomNameChange}
                value={roomName}
              />
            </FormControl>
            <Button
              variant="custom"
              width="100%"
              mt="2"
              onClick={handleCreateRoom}
              isLoading={loading}
            >
              Create
            </Button>
          </Flex>

          <HStack pt="2" spacing="4" justifyContent="space-evenly">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="10%"
              maxW={{ base: "50%", md: "40%" }}
              maxH={{ base: "50%", md: "40%" }}
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
              maxW={{ base: "50%", md: "40%" }}
              maxH={{ base: "50%", md: "40%" }}
              mx="auto" // add mx="auto" to center horizontally
              overflow="hidden"
            >
              {shareScreenEnabled && <video autoPlay ref={shareScreenRef} />}
            </Box>
          </HStack>

          <HStack pt="2" spacing="4" justifyContent="space-evenly">
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
