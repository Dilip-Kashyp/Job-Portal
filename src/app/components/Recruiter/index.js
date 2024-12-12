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
} from "antd";
import { useRouter } from "next/navigation";
import { fetchjob, createjob, fetchApplicants, updateJobStatus } from "@/api";
import showNotification from "../Notifaction";

const { Sider, Content, Header } = Layout;

const RecruiterHome = () => {
  const [visible, setVisible] = useState(false);
  const [applicantsModalVisible, setApplicantsModalVisible] = useState(false);
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

  const handleJobSubmit = async () => {
    if (!jobName) {
      message.error("Job name is required!");
      return;
    }

    try {
      const res = await createjob({ jobName });
      setJobs(res);
      showNotification({
        type: "success",
        message: "Job Created!",
        description: "Job has been successfully created.",
      });
      fetchJobs();
      setVisible(false);
    } catch (error) {
      console.log("Error creating job");
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

  const handleOfferLetter = async (applicant, jobId, status) => {
    try {
      await updateJobStatus(jobId, status);
      showNotification({
        type: status === "rejected" ? "error" : "success",
        message: status === "rejected" ? "Rejected" : "Sent",
        description:
          status === "rejected"
            ? `${applicant.name} has been rejected.`
            : `Offer letter sent to ${applicant.name} (${applicant.email})`,
      });
      fetchJobApplicants(jobId);
    } catch (err) {
      console.log(err);
      showNotification({
        type: "error",
        message: "",
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
      {/* Mobile Menu Toggle */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <Button 
          type="text" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-800"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </Button>
      </div>

      {/* Mobile Sidebar */}
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

      {/* Desktop Sidebar */}
      <Sider 
        width={250} 
        className="bg-gray-800 text-white hidden md:block"
      >
        <div className="text-center text-2xl font-bold text-white mt-6">
          Recruiter Dashboard
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-md flex justify-between items-center px-4 md:px-6">
          <div className="text-xl font-semibold ml-10">Welcome, Recruiter</div>
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

          <List
            grid={{ 
              xs: 1,   // 1 column on mobile 
              sm: 2,   // 2 columns on small screens
              md: 3,   // 3 columns on medium and larger screens
              gutter: 16 
            }}
            dataSource={currentView === "dashboard" ? jobs : applicants}
            renderItem={(item) => (
              <List.Item>
                <Card
                  title={
                    currentView === "dashboard" 
                      ? (item.jobname || "Unnamed Job") 
                      : (item.name || "Unnamed Applicant")
                  }
                  bordered={false}
                  className="shadow-md w-full"
                  hoverable
                  actions={
                    currentView === "dashboard"
                      ? [
                          <Button
                            type="primary"
                            onClick={() => fetchJobApplicants(item.id)}
                            className="w-full"
                          >
                            View Applicants
                          </Button>,
                        ]
                      : [
                          <Button
                            type="primary"
                            disabled={item.applied_status === "accepted"}
                            onClick={() => 
                              handleOfferLetter(
                                item, 
                                selectedJob, 
                                "job_offered"
                              )
                            }
                            className="w-full"
                          >
                            {item.applied_status === "accepted" 
                              ? "Offer Accepted" 
                              : "Offer Job"}
                          </Button>,
                          <Button
                            type="danger"
                            onClick={() => 
                              handleOfferLetter(
                                item, 
                                selectedJob, 
                                "rejected"
                              )
                            }
                            className="w-full"
                          >
                            Reject
                          </Button>
                        ]
                  }
                >
                  {currentView === "applicants" && (
                    <div>
                      <p><strong>Email:</strong> {item.email}</p>
                      <p><strong>Status:</strong> {item.applied_status}</p>
                    </div>
                  )}
                </Card>
              </List.Item>
            )}
          />

          {/* Job Creation Modal */}
          <Modal
            title="Create New Job"
            open={visible}
            onCancel={() => setVisible(false)}
            onOk={handleJobSubmit}
            okText="Create"
          >
            <Form layout="vertical">
              <Form.Item label="Job Name" required>
                <Input
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder="Enter job title"
                />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default RecruiterHome;