import { apiClient } from "../../utils/apiClient";

export async function loginHandler({ email, password }) {
  const response = await apiClient({
    url: "/user/login",
    method: "POST",
    body: { email, password },
  });

  return response;
}

export async function registerHandler({ email, password, role, name }) {
  const response = await apiClient({
    url: "/user/register",
    method: "POST",
    body: { email, password, role, name },
  });
  return response;
}

export async function getUserInfo() {
  const response = await apiClient({
    url: "/user/profile",
    method: "POST",
  });
  return response;
}

export async function fetchjob() {
  const response = await apiClient({
    url: "/job/list-job",
    method: "POST",
  });
  return response;
}

export async function createjob({ jobName }) {
  const response = await apiClient({
    url: "/job/create-job",
    method: "POST",
    body: { jobName },
  });
  return response;
}
export async function fetchApplicants({ jobId }) {
  const response = await apiClient({
    url: "/job/get-applicants",
    method: "POST",
    body: { jobId },
  });
  return response;
}

export async function applyForJob(jobId) {
  const response = await apiClient({
    url: "/job/apply-job",
    method: "POST",
    body: { jobId },
  });
  return response;
}
export async function fetchAppliedJobs() {
  const response = await apiClient({
    url: "/job/applied-job",
    method: "POST",
  });
  return response;
}

export async function updateJobStatus(jobId, status) {
  console.log(jobId, status)
  const response = await apiClient({
    url: "/job/update-job-status",
    method: "POST",
    body : {jobId, status}
  });
  return response;
}

export async function acceptOffer(jobId, action) {
  console.log(jobId, action)
  const response = await apiClient({
    url: "/job/accept-offer",
    method: "POST",
    body : {jobId, action}
  });
  return response;
}
