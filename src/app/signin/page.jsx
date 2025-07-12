"use client";

import { Form, Input, Button } from "antd";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useApp } from "../context/context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Page = () => {
  const { API_BASE_URL, setLoading, loading, setUser, setToken } = useApp();
  const router = useRouter();

  const onFinish = async (values) => {
    const url = `${API_BASE_URL}/api/auth/login`;
    setLoading(true);

    try {
      const res = await axios.post(url, values);
      const user = res.data.user;
      const token = res.data.token;

      toast.success("Login successful!");

      setUser(user);
      setToken(token);

      console.log(res)

      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);

      if (user.interests.length < 1) {
        router.push("/interest");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Login failed. Try again.";
      toast.error(message);
      console.error("Login error:", message);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Validation Failed:", errorInfo);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_600px]">
      {/* Left Column */}
      <div className="p-4 bg-white h-screen relative overflow-y-auto">
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

        <div className="flex justify-center items-center flex-col p-10">
          <div className="flex justify-center">
            <Image
              src="/images/login_logo.png"
              alt="logo"
              width={150}
              height={150}
            />
          </div>
          <h1 className="font-semibold text-center text-black text-2xl mt-3 mb-5">
            Welcome Back to Withread!
          </h1>

          <div className="w-full max-w-[400px]">
            <Form
              name="login"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              // autoComplete="off"
              className="w-full"
            >
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email address!",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email!",
                  },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long.",
                  },
                ]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="!bg-[#141823] !rounded-full !w-full !py-5 mt-4"
                >
                  Sign in
                </Button>
              </Form.Item>

              <Form.Item>
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
          </div>
        <p className="text-gray-500 text-sm">Don't have an account? <Link href='/signup'>Sign Up</Link></p>
        </div>
      </div>

      {/* Right Column */}
      <div
        className="hidden md:block p-4 h-screen"
        style={{
          backgroundImage: "url('/images/bg-img.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <ToastContainer />
    </div>
  );
};

export default Page;
