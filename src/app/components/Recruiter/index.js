"use client";
import { useState, useEffect } from "react";
import {
  List,
  Card,
  Button,
  Layout,
  Menu,
  Modal,
  Form,
  Input,
  message,
} from "@/dependency";
import { useRouter } from "next/navigation";
import { fetchjob, fetchApplicants, updateJobStatus } from "@/api";
import { showNotification, JobCreateForm, JobCard } from "@/components";
const { Sider, Content, Header } = Layout;

const Recruiter = ({ user }) => {
  const [visible, setVisible] = useState(false);
  const [jobName, setJobName] = useState("");
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetchjob();
      setJobs(res);
    } catch (error) {
      console.log("Error fetching jobs:", error);
    }
  };

  const fetchJobApplicants = async (jobId) => {
    try {
      const res = await fetchApplicants({ jobId });
      setApplicants(res.data);
      setSelectedJob(jobId);
      setCurrentView("applicants");
      setApplicantsModalVisible(true);
    } catch (error) {
      showNotification({
        type: "error",
        message: "",
        description: "No application for this job",
      });
    }
  };

 

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      onClick: () => {
        setCurrentView("dashboard");
        setIsMobileMenuOpen(false);
      },
    },
    {
      key: "create-job",
      label: "Create Job",
      onClick: () => {
        setVisible(true);
        setIsMobileMenuOpen(false);
      },
    },
  ];

  return (
    <Layout className="h-screen">
      <div className="md:hidden absolute top-4 left-4 z-50">
        <Button
          type="text"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-800"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800 text-white z-40 p-6">
          <div className="text-center text-2xl font-bold text-white mt-6 mb-6">
            Recruiter Dashboard
          </div>
          <Menu
            theme="dark"
            mode="inline"
            items={menuItems}
            className="bg-transparent"
          />
          <Button
            type="primary"
            className="w-full mt-4 bg-red-600"
            onClick={() => router.push("/login")}
          >
            Log out
          </Button>
        </div>
      )}
      <Sider width={250} className="bg-gray-800 text-white hidden md:block">
        <div className="text-center text-2xl font-bold text-white mt-6">
          Recruiter Dashboard
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-md flex justify-between items-center px-4 md:px-6">
          <div className="text-xl font-semibold ml-6">Welcome, {user?.user?.name} </div>
          <Button
            type="primary"
            className="bg-blue-600 hidden md:block"
            onClick={() => router.push("/login")}
          >
            Log out
          </Button>
        </Header>

        <Content className="p-4 md:p-6 bg-gray-100">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
            {currentView === "dashboard" ? "Posted Jobs" : "Job Applicants"}
          </h2>

          <JobCard
            jobs={jobs}
            currentView={currentView}
            applicants={applicants}
            fetchJobApplicants={fetchJobApplicants}
            selectedJob={selectedJob}
          />
          <JobCreateForm
            visible={visible}
            setVisible={setVisible}
            jobName={jobName}
            setJobName={setJobName}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Recruiter;
