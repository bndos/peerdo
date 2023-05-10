import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { firestore } from "../../lib/firebase";

const Room = () => {
  const router = useRouter();
  const { room } = router.query;
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [roomExists, setRoomExists] = useState(false);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roomExists) {
    return <h1>404 - Room not found</h1>;
  }

  return (
    <div>
      <h1>Room ID: {room}</h1>
      <h2>Room Name: {roomName}</h2>
    </div>
  );
};

export default Room;
