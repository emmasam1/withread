"use client";

import { Form, Input, Button, Row, Col } from "antd";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useApp } from "../context/context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Page = () => {
  const { API_BASE_URL, setLoading, loading } = useApp();

  const router = useRouter();

  const onFinish = async (values) => {
    const url = `${API_BASE_URL}/api/auth/signup`;

    setLoading(true);
    try {
      const res = await axios.post(url, values);
      toast.success("Signup successful. Check your email.");
      console.log(res)
      router.push("/verify-otp");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Signup failed. Try again.";
      toast.error(message);
      console.error("Signup error:", message);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_600px] h-screen">
      {/* Left Column */}
      <div className="p-4 bg-white relative">
        <Image
          src="/images/Group.png"
          alt="icon"
          width={100}
          height={100}
          className="absolute top-0 left-0"
        />
        <Image
          src="/images/shape-99.png"
          alt="icon"
          width={100}
          height={100}
          className="absolute bottom-0 right-0"
        />

        <div className="flex justify-center items-center flex-col">
          <div className="flex justify-center">
            <Image
              src="/images/login_logo.png"
              alt="logo"
              width={150}
              height={150}
            />
          </div>
          <h1 className="font-semibold text-center text-black text-2xl mt-3 mb-5">
            Welcome to Withread!
          </h1>

          <Form
            name="register"
            layout="vertical"
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {/* First Name and Last Name */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: "Enter first name!" }]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: "Enter last name!" }]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>

            {/* Email */}
            <Form.Item
              label="Email Address"
              name="email"
              rules={[{ required: true, message: "Enter email address!" }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            {/* Username */}
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Enter a username!" }]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Enter your password!" },
                { min: 6, message: "Password must be 6+ characters." },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item className="!-mt-1">
              <Button
                type="primary"
                loading={loading}
                htmlType="submit"
                className="!bg-[#141823] !rounded-full !w-full !py-5"
              >
                Sign up now
              </Button>
            </Form.Item>

            {/* Google Signup Placeholder */}
            <Form.Item className="!-mt-3">
              <Button
                type="default"
                className="!bg-transparent !border !border-black !rounded-full !w-full !py-5 flex items-center justify-center"
              >
                <Image
                  src="/images/google.png"
                  alt="logo"
                  width={150}
                  height={150}
                  className="mr-2"
                />
              </Button>
            </Form.Item>
          </Form>
          <p className="text-gray-500 text-sm">Already have an account? <Link href='/signin'>Login</Link></p>
        </div>
        <ToastContainer />
      </div>

      {/* Right Column */}
      <div
        className="hidden md:block p-4"
        style={{
          backgroundImage: "url('/images/bg-img.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    </div>
  );
};

export default Page;
