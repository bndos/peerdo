import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import CallControl from "../../components/call-control";
import { firestore } from "../../lib/firebase";
import { RoomContext } from "../../lib/room-context";
import { P2PContext } from "../../lib/p2p-context";

const Room = () => {
  const router = useRouter();
  const { room } = router.query;
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [roomExists, setRoomExists] = useState(false);

  const { audioEnabled, videoEnabled, audioStream, videoStream } =
    useContext(RoomContext);
  const { pc } = useContext(P2PContext);

  useEffect(() => {
    const getRoomName = async () => {
      try {
        const roomRef = firestore.collection("rooms").doc(room);
        const roomDoc = await roomRef.get();

        if (!roomDoc.exists) {
          setRoomExists(false);
        } else {
          setRoomExists(true);
          setRoomName(roomDoc.data().name);
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }

      setLoading(false);
    };

    getRoomName();
  }, [room]);

  useEffect(() => {
    if (audioEnabled && audioStream && pc) {
      audioStream.getTracks().forEach((track) => {
        pc.addTrack(track, audioStream);
      });
    }

    if (videoEnabled && videoStream && pc) {
      videoStream.getTracks().forEach((track) => {
        pc.addTrack(track, videoStream);
      });
    }
  }, [audioEnabled, videoEnabled, audioStream, videoStream, pc]);

  useEffect(() => {
    return () => {
      if (pc) {
        pc.getSenders().forEach((sender) => {
          sender.track.stop();
          pc.removeTrack(sender);
        });
      }
    };
  }, [pc]);

  const CallControlContainer = (props) => (
    <Box w="250px" borderRadius="10px" p="0">
      <CallControl {...props} />
    </Box>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roomExists) {
    return <h1>404 - Room not found</h1>;
  }

  return (
    <VStack>
      <Text>Room: {roomName}</Text>
      <Box w="100%">
        <HStack justifyContent="center" alignItems="center">
          <CallControlContainer />
        </HStack>
      </Box>
      <Box flex="1" w="100%">
        {/* Add video grid here */}
      </Box>
    </VStack>
  );
};

export default Room;
