"use client";

import { Form, Input, Button, Row, Col } from "antd";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";


const Page = () => {

    const router = useRouter();

  const onFinish = (values) => {
    console.log("Success:", values);
    router.push("/verify-otp");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
            {/* First Name and Last Name side by side */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your first name!",
                    },
                  ]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    { required: true, message: "Please enter your last name!" },
                  ]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>

            {/* Other fields */}
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email address!" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please enter a username!" }]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
                {
                  min: 8,
                  message: "Password must be at least 8 characters long.",
                },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            {/* <Form.Item
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
                    return Promise.reject("Passwords do not match!");
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm password" />
            </Form.Item> */}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="!bg-[#141823] !rounded-full !w-full !py-5 mt-4"
              >
                Sign up now
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
    </div>
  );
};

export default Page;
