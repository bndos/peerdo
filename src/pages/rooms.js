import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "../lib/firebase";
import CallControl from "../components/call-control";

const Rooms = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleCreateRoom = async () => {
    setLoading(true);

    try {
      const roomRef = await firestore.collection("rooms").add({
        name: roomName,
        createdAt: serverTimestamp(),
      });

      setLoading(false);
      router.push({
        pathname: "/room/[room]",
        query: { room: roomRef.id },
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

          <CallControl />
        </Box>
      ) : (
        <h1>Please sign in to continue</h1>
      )}
      {/* Other room page content here */}
    </div>
  );
};

export default Rooms;
