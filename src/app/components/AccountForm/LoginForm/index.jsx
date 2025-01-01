"use client";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  useState,
} from "@/dependency";
import { loginHandler } from "@/api";
import { showNotification } from "@/components";
const { Title } = Typography;

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;

    try {
      const res = await loginHandler({ email, password });
      if (res?.token) {
        console.log(res);
        showNotification({
          type: "success",
          message: "Login Successful!",
          description: "Welcome back to the dashboard!",
        });
        localStorage.setItem("token", res.token);
        router.push("/home");
      } else {
        showNotification({
          type: "error",
          message: "Login Failed!",
          description: res?.message || "Invalid credentials provided.",
        });
      }
    } catch (error) {
      showNotification({
        type: "error",
        message: "Error Occurred!",
      });
    } finally {
      setLoading(false);
    }
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
            Login
          </Title>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
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

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </div>
      </Card>
    </div>
  );
}

export default LoginForm;
