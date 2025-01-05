"use client"
import { Modal, Form, Input, Select, message } from "@/dependency";
import { useState } from "react";
import { showNotification } from "@/components";
import { createjob } from "@/api";

function JobCreateForm({ visible, setVisible }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "",
    salary: 0,
    skills: "",
    experience: 0,
  });

  const handleJobSubmit = async () => {
    if (!formData) {
      message.error("Please mandotry all fields!");
      return;
    }

    try {
      await createjob(formData);
      showNotification({
        type: "success",
        message: "Job Created!",
        description: "Job has been successfully created.",
      });
      setVisible(false);
    } catch (error) {
      console.log("Error creating job");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal
      title="Create New Job"
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleJobSubmit}
      okText="Create"
    >
      <Form layout="vertical">
        <Form.Item label="Job Title" required>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Job Title"
          />
        </Form.Item>
          <Form.Item label="Experience">
          <Input
            type="number"
            value={formData.experience}
            onChange={(e) => handleInputChange("experience", e.target.value)}
            placeholder="Years of Experience"
          />
        </Form.Item>

        <Form.Item label="Office Location">
          <Input
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Office Location"
          />
        </Form.Item>
        <Form.Item label="Job Type">
          <Select
            value={formData.type}
            onChange={(value) => handleInputChange("type", value)}
            placeholder="Job Type"
          >
            <Select.Option value="full-time">Full Time</Select.Option>
            <Select.Option value="internship">Internship</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="remote">Remote</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Salary">
          <Input
            type="number"
            value={formData.salary}
            onChange={(e) => handleInputChange("salary", e.target.value)}
            placeholder="Job Salary"
          />
        </Form.Item>
        <Form.Item label="Skills">
          <Input
            value={formData.skills}
            onChange={(e) => handleInputChange("skills", e.target.value)}
            placeholder="Skills Required"
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Job Description"
            rows={4}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default JobCreateForm;
