"use client";
import { Button, Typography, Card } from "antd";
const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100">
      <Card
        className="w-full max-w-4xl shadow-lg"
        style={{
          borderRadius: "15px",
        }}
      >
        <div className="text-center py-8">
          <Title level={1} className="text-blue-600 font-bold">
            Welcome to Our Job Portal
          </Title>
          <Paragraph className="text-gray-700 text-lg mt-4">
            Your one-stop solution for finding your dream job or hiring the best
            talent. Whether you're a Job Seeker or a Recruiter, we are here to
            simplify your journey.
          </Paragraph>
        </div>
      </Card>

      <div className="flex space-x-4 mt-10">
        <Button
          type="primary"
          size="large"
          href="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3"
        >
          Login
        </Button>
        <Button
          size="large"
          href="/register"
          className="bg-white border-blue-500 text-blue-500 hover:bg-blue-50 hover:border-blue-600 font-semibold px-8 py-3"
        >
          Register
        </Button>
      </div>

      <div className="mt-16 text-center">
        <Paragraph className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Job Portal. All Rights Reserved.
        </Paragraph>
      </div>
    </div>
  );
}
