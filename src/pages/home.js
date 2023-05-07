import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";

const Home = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get the currently logged in user's email address
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    } else {
      // If there is no logged in user, redirect to login page
      router.push("/login");
    }
  }, [router]);

  return <div>Welcome {userEmail}!</div>;
};

export default Home;
