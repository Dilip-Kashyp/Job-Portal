import { List, Card, Button } from "@/dependency";

function JobCard({
  currentView,
  jobs,
  applicants,
  fetchJobApplicants,
  selectedJob,
}) {
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

  return (
    <>
      <List
        grid={{
          xs: 1,
          sm: 2,
          md: 3,
          gutter: 16,
        }}
        dataSource={currentView === "dashboard" ? jobs : applicants}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={
                currentView === "dashboard"
                  ? item.title || "Unnamed Job"
                  : item.name || "Unnamed Applicant"
              }
              bordered={false}
              className="shadow-md w-[200px]"
              hoverable
              actions={
                currentView === "dashboard"
                  ? [
                      <Button
                        type="primary"
                        onClick={() => fetchJobApplicants(item.id)}
                        className="w-[150px]"
                      >
                        View Applicants
                      </Button>,
                    ]
                  : [
                      <Button
                        type="primary"
                        disabled={item.applied_status === "accepted"}
                        onClick={() =>
                          handleOfferLetter(item, selectedJob, "job_offered")
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
                          handleOfferLetter(item, selectedJob, "rejected")
                        }
                        className="w-full"
                      >
                        Reject
                      </Button>,
                    ]
              }
            >
              <div className="flex flex-col gap-2">
                <p>
                  <strong>Location :</strong> {item?.location}
                </p>
                <p>
                  <strong>Type :</strong> {item?.type}
                </p>
                <p>
                  <strong>Applicant count:</strong> {item?.applicant}
                </p>
              </div>
              {currentView === "applicants" && (
                <div>
                  <p>
                    <strong>Email:</strong> {item.email}
                  </p>
                  <p>
                    <strong>Status:</strong> {item.applied_status}
                  </p>
                </div>
              )}
            </Card>
          </List.Item>
        )}
      />
    </>
  );
}

export default JobCard;
