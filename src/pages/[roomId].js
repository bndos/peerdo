import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { firestore } from "../lib/firebase";

const RoomId = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const [roomIdName, setRoomIdName] = useState("");

  useEffect(() => {
    const getRoomIdName = async () => {
      try {
        const roomRef = firestore.collection("rooms").doc(roomId);
        const roomDoc = await roomRef.get();

        if (!roomDoc.exists) {
          console.log("No such document!");
        } else {
          setRoomIdName(roomDoc.data().name);
        }
      } catch (error) {
        console.log("Error getting document:", error);
      }
    };

    getRoomIdName();
  }, [roomId]);

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      <h2>Room Name: {roomIdName}</h2>
    </div>
  );
};

export default RoomId;
