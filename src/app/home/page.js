"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/api"; 
import JobSeekerHome from "../components/Jobseeker";
import RecruiterHome from "../components/Recruiter";

const Home = () => {
  const [userType, setUserType] = useState(null); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserType(); 
  }, []);

  const fetchUserType = async () => {
    try {
      const user = await getUserInfo();
      setUserType(user.user.role); 
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user info:", error);
      router.push("/login"); 
    }
  };

  if (loading) return <div>Loading...</div>; 

  return (
    <>
      {userType === "recruiter" && <RecruiterHome />}
      {userType === "applicant" && <JobSeekerHome />}
    </>
  );
};

export default Home;
