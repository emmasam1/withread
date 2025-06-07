"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const siderWidth = collapsed ? 80 : 200;

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
              icon: <VideoCameraOutlined />,
              label: <Link href="/dashboard/about">About</Link>,
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: <Link href="/dashboard/activity">Activity</Link>,
            },
            {
              key: "4",
              icon: <UploadOutlined />,
              label: <Link href="/dashboard/message">Message</Link>,
            },
            {
              key: "5",
              icon: <UploadOutlined />,
              label: <Link href="/dashboard/communities">Communities</Link>,
            },
            {
              key: "6",
              icon: <UploadOutlined />,
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
      </Sider>

      {/* Main layout shifted right to account for fixed Sider */}
      <div
        className="flex flex-col"
        style={{ marginLeft: siderWidth, height: "100vh" }}
      >
        {/* Fixed Header */}
        <Header
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
        />

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
    </div>
  );
}
