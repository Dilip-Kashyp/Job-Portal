"use client";
import { useRouter } from "next/navigation";
import { registerHandler } from "@/api";
import { Form, Input, Button, Select, Typography, Card } from "@/dependency";
import { showNotification } from "@/components";
const { Title } = Typography;
const { Option } = Select;

function RegisterForm() {
  const router = useRouter();
  const onFinish = async (values) => {
    await registerHandler(values)
      .then(() => {
        showNotification({
          type: "success",
          message: "Register Successful!",
          description: "Redirecting to login page!",
        });
        router.push("/login");
      })
      .catch((error) => {
        showNotification({
          type: "error",
          message: "Login Failed!",
        });
        console.error(error);
      });
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <Card
        className="w-full max-w-md shadow-xl"
        style={{
          borderRadius: "10px",
        }}
      >
        <div className="text-center mb-6">
          <Title level={2} className="text-gray-700">
            Register
          </Title>
        </div>

        <Form
          name="register"
          initialValues={{ remember: true }}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input your name!" },
              { min: 3, message: "Name must be at least 3 characters!" },
            ]}
          >
            <Input size="large" placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input size="large" placeholder="Enter your email" />
          </Form.Item>

          {/* Role Field */}
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select your role!" }]}
          >
            <Select size="large" placeholder="Select your role">
              <Option value="applicant">Job Seeker</Option>
              <Option value="recruiter">Recruiter</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Confirm your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="bg-blue-500 hover:bg-blue-600"
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </div>
      </Card>
    </div>
  );
}
export default RegisterForm;
