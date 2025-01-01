"use client";
import { useState, useEffect } from "react";
import { List, Card, Layout, Button, Menu } from "@/dependency";
import { fetchjob, fetchAppliedJobs, applyForJob, acceptOffer } from "@/api";
import { useRouter } from "next/navigation";
import { showNotification } from "@/components";

const { Sider, Content, Header } = Layout;

const JobSeekerHome = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [currentView, setCurrentView] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchJobsList();
    fetchAppliedJobsList();
  }, []);

  const fetchJobsList = async () => {
    try {
      const res = await fetchjob();
      setJobs(res);
    } catch (error) {
      console.log("Error fetching jobs:", error);
    }
  };

  const fetchAppliedJobsList = async () => {
    try {
      const res = await fetchAppliedJobs();
      setAppliedJobs(res);
    } catch (error) {
      console.log("Error fetching applied jobs:", error);
    }
  };

  const handleApply = async (job) => {
    try {
      await applyForJob(job.id);
      showNotification({
        type: "success",
        message: "Application Sent!",
        description: `You have successfully applied for ${job.jobname}.`,
      });
      fetchAppliedJobsList(); // Refresh applied jobs list
    } catch (error) {
      console.error("Error applying for the job:", error);
      showNotification({
        type: "error",
        message: "Application Failed",
        description: `Failed to apply for ${job.jobname}.`,
      });
    }
  };

  const handleAcceptOffer = async (job) => {
    console.log("ege", job, job.id);
    try {
      await acceptOffer(job.id, "accept");
      showNotification({
        type: "success",
        message: "Offer Accepted!",
        description: `You have accepted the offer for ${job.jobname}.`,
      });
      fetchAppliedJobsList();
    } catch (error) {
      console.error("Error accepting the offer:", error);
      showNotification({
        type: "error",
        message: "Failed to Accept Offer",
        description: `Failed to accept the offer for ${job.jobname}.`,
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
      key: "applied",
      label: "Applied Jobs",
      onClick: () => {
        setCurrentView("applied");
        setIsMobileMenuOpen(false);
      },
    },
  ];

  return (
    <Layout className="h-screen">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <Button
          type="text"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-800"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800 text-white z-40 p-6">
          <div className="text-center text-2xl font-bold text-white mt-6 mb-6">
            Job Seeker Dashboard
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

      {/* Desktop Sidebar */}
      <Sider width={250} className="bg-gray-800 text-white hidden md:block">
        <div className="text-center text-2xl font-bold text-white mt-6">
          Job Seeker Dashboard
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-md flex justify-between items-center px-4 md:px-6">
          <div className="text-xl font-semibold ml-10">Welcome, Job Seeker</div>
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
            {currentView === "dashboard" ? "Available Jobs" : "Applied Jobs"}
          </h2>

          <List
            grid={{
              xs: 1, // 1 column on mobile
              sm: 2, // 2 columns on small screens
              md: 3, // 3 columns on medium and larger screens
              gutter: 16,
            }}
            dataSource={currentView === "dashboard" ? jobs : appliedJobs?.data}
            renderItem={(job) => (
              <List.Item>
                <Card
                  title={job.jobname || "Unnamed Job"}
                  bordered={false}
                  className="shadow-md w-full"
                  hoverable
                  actions={
                    currentView === "dashboard"
                      ? [
                          <Button
                            type="primary"
                            onClick={() => handleApply(job)}
                            className="w-full"
                          >
                            Apply
                          </Button>,
                        ]
                      : [
                          <Button
                            type="primary"
                            disabled={job.applied_status !== "job_offered"}
                            onClick={() => handleAcceptOffer(job)}
                            className="w-full"
                          >
                            {job.applied_status === "job_offered"
                              ? "Accept Offer"
                              : job.applied_status === "rejected"
                              ? "Rejected"
                              : "Applied"}
                          </Button>,
                        ]
                  }
                >
                  {currentView === "applied" && (
                    <p>
                      <strong>Status:</strong> {job.applied_status}
                    </p>
                  )}
                </Card>
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default JobSeekerHome;
