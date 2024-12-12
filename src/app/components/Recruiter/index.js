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
      console.log("Job created successfully!");
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
      setApplicantsModalVisible(true);
    } catch (error) {
      showNotification({
        type: "error",
        message: "",
        description: "No application for this job",
      });
    }
  };

  const handleViewApplicants = (jobId) => {
    fetchJobApplicants(jobId);
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
      key: "1",
      label: "Dashboard",
    },
    {
      key: "2",
      label: "Create Job",
      onClick: () => setVisible(true),
    },
  ];

  return (
    <Layout className="h-screen">
      <Sider width={250} className="bg-gray-800 text-white">
        <div className="text-center text-2xl font-bold text-white mt-6">
          Recruiter Dashboard
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-md flex justify-between items-center px-6">
          <div className="text-xl font-semibold">Welcome, Recruiter</div>
          <Button
            type="primary"
            className="bg-blue-600"
            onClick={() => router.push("/login")}
          >
            Log out
          </Button>
        </Header>

        <Content className="p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Posted Jobs</h2>

          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={jobs}
            renderItem={(job) => (
              <List.Item>
                <Card
                  title={job.jobname ? job.jobname : "Unnamed Job"}
                  bordered={false}
                  className="shadow-md"
                  hoverable
                  onClick={() => handleViewApplicants(job.id)}
                />
              </List.Item>
            )}
          />

          <Modal
            title="Create New Job"
            visible={visible}
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

          <Modal
            title="Job Applicants"
            visible={applicantsModalVisible}
            onCancel={() => setApplicantsModalVisible(false)}
            width={"50%"}
            footer={[
              <Button
                key="close"
                onClick={() => setApplicantsModalVisible(false)}
              >
                Close
              </Button>,
            ]}
          >
            {applicants.length > 0 ? (
              <List
                bordered
                dataSource={applicants}
                renderItem={(applicant) => (
                  <List.Item>
                    <div>
                      <strong>Name:</strong> {applicant.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {applicant.email}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="primary"
                        disabled={
                          applicant.applied_status === "accepted" ? true : false
                        }
                        onClick={() =>
                          handleOfferLetter(
                            applicant,
                            selectedJob,
                            "job_offered"
                          )
                        }
                      >
                        {applicant.applied_status === "accepted"
                          ? "Offer accepted"
                          : "Offer job"}
                      </Button>
                      <Button
                        type="danger"
                        onClick={() =>
                          handleOfferLetter(applicant, selectedJob, "rejected")
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div>No applicants found.</div>
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default RecruiterHome;
