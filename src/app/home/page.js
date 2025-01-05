"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/api"; 
import { SideBar, Jobseeker, Recruiter } from "@/components";


const Home = () => {
  const [userType, setUserType] = useState(null); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserType(); 
  }, []);

  const fetchUserType = async () => {
    try {
      const user = await getUserInfo();
      setUserType(user.user.role); 
      setLoading(false);
      setUser(user);
    } catch (error) {
      console.error("Error fetching user info:", error);
      router.push("/login"); 
    }
  };

  if (loading) return <div>Loading...</div>; 

  return (
    <>
      {userType === "recruiter" && <Recruiter user={user} />}
      {userType === "applicant" && <Jobseeker user={user} />}
    </>
  );
};

export default Home;
