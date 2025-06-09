"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  UserOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Input,
  Modal,
  Form,
  Checkbox,
  Dropdown,
} from "antd";
import Image from "next/image";
import { useApp } from "../context/context";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({ children }) {
  const { API_BASE_URL, setLoading, loading, setUser, user, setToken } =
    useApp();
  const [collapsed, setCollapsed] = useState(false);
  const dropdownRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const siderWidth = collapsed ? 80 : 200;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

const items = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item
      </a>
    ),
  },
];

  const onFinish = async (values) => {
    const url = `${API_BASE_URL}/api/auth/login`;
    setLoading(true);

    try {
      const res = await axios.post(url, values);
      console.log("Login response:", res);

      const user = res.data.user;
      const token = res.data.token;

      setUser(user);
      setToken(token);

      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token); // ✅ don't stringify if it's already a string

      if (user.interests.length < 1) {
        router.push("/interest");
      } else {
        router.push("/dashboard");
      }

      toast.success("Login successful!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Caught error in login:", error);

      const message =
        error?.response?.data?.message ||
        error.message ||
        "Login failed. Try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Fixed Sider */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={200}
        style={{
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: <Link href="/dashboard">Home</Link>,
            },
            {
              key: "2",
              icon: (
                <Image
                  src="/images/Compass.png"
                  alt=""
                  width={20}
                  height={20}
                />
              ),
              label: <Link href="/dashboard/discover">About</Link>,
            },
            {
              key: "3",
              icon: (
                <Image
                  src="/images/Document.png"
                  alt=""
                  width={20}
                  height={20}
                />
              ),
              label: <Link href="/dashboard/activity">Activity</Link>,
            },
            {
              key: "4",
              icon: (
                <Image src="/images/sms.png" alt="" width={20} height={20} />
              ),
              label: <Link href="/dashboard/message">Message</Link>,
            },
            {
              key: "5",
              icon: (
                <Image src="/images/people.png" alt="" width={20} height={20} />
              ),
              label: <Link href="/dashboard/communities">Communities</Link>,
            },
            {
              key: "6",
              icon: (
                <Image
                  src="/images/setting.png"
                  alt=""
                  width={20}
                  height={20}
                />
              ),
              label: <Link href="/dashboard/settings">Settings</Link>,
            },
          ]}
        />

        <Button
          type="text"
          className="!bg-[#1D222F] !w-[20px] !rounded-tr-none !rounded-br-none hover:!bg-[#F5F5F5] group"
          style={{
            position: "absolute",
            top: "35px",
            right: "0",
          }}
          onClick={() => setCollapsed(!collapsed)}
          icon={
            collapsed ? (
              <RightOutlined className="text-[#F5F5F5] group-hover:text-black" />
            ) : (
              <LeftOutlined className="text-[#F5F5F5] group-hover:text-black" />
            )
          }
        />
        <div className="bg-amber-600 absolute bottom-0">
          <Dropdown menu={{ items }} placement="topRight">
        <Button>topRight</Button>
      </Dropdown>
        </div>
      </Sider>

      {/* Main layout shifted right to account for fixed Sider */}
      <div
        className="flex flex-col"
        style={{ marginLeft: siderWidth, height: "100vh" }}
      >
        {/* Fixed Header */}
        <Header
          className="flex justify-between !items-center !px-5"
          style={{
            position: "fixed",
            top: 0,
            left: siderWidth,
            right: 0,
            zIndex: 99,
            height: 64,
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div>
            <Input
              placeholder="Search anything..."
              className="mt-4 !rounded-full !pr-12"
              suffix={
                <Image
                  src="/images/search-normal.png"
                  alt="search icon"
                  width={20}
                  height={20}
                />
              }
            />
          </div>
          <div className="flex items-center gap-2.5">
            {user ? (
              <Button
                className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-4 !px-4 flex gap-2"
                // onClick={showModal}
              >
                <Image
                  src="/images/add.png"
                  width={20}
                  height={20}
                  alt="icon"
                />
                New Post
              </Button>
            ) : (
              <Button
                className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-4 !px-4 flex gap-2"
                onClick={showModal}
              >
                Login
              </Button>
            )}

            <div className="bg-[#F3F3F4] rounded-full p-2">
              <Image src="/images/sms.png" width={20} height={20} alt="icon" />
            </div>
            <div className="bg-[#F3F3F4] rounded-full p-2">
              <Image
                src="/images/notification-bing.png"
                width={20}
                height={20}
                alt="icon"
              />
            </div>
          </div>
        </Header>

        {/* Scrollable Content */}
        <Content
          className="overflow-y-auto p-6"
          style={{
            marginTop: 64,
            background: "#F6F8FB",
            height: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Content>
      </div>

      <Modal
        // title="Basic Modal"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
        className="!rounded-0"
        width={400}
      >
        <div className="flex justify-center pt-6">
          <Image
            src="/images/login_logo.png"
            alt="logo"
            width={150}
            height={150}
          />
        </div>
        <h1 className="font-semibold text-center text-2xl mt-3 mb-5">
          Welcome Back to Withread!
        </h1>

        <Form
          name="basic"
          layout="vertical" // 👈 This moves labels above the inputs
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email Address Or Username"
            name="email"
            className="!mb-3"
            rules={[
              {
                required: true,
                message: "Please input your email or username!",
              },
            ]}
          >
            <Input placeholder="Enter your email/username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            className="!mb-2"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <div className="flex justify-between items-center">
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Keep me logged in</Checkbox>
            </Form.Item>

            <Link href="#" className="!text-gray-400 -mt-6">
              Forget Password?
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="!bg-[#141823] !rounded-full !w-full !py-5"
            >
              Log in now
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
        <p className="text-center">
          Don’t have an account? <Link href="/signup">Sign Up</Link>
        </p>
      </Modal>

      <ToastContainer />
    </div>
  );
}
