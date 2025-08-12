"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LeftOutlined,
  RightOutlined,
  MenuOutlined,
  CloseOutlined,
  RightCircleOutlined,
  SearchOutlined,
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
  Spin,
  Empty,
} from "antd";
import Image from "next/image";
import { useApp } from "../context/context";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({ children }) {
  const { API_BASE_URL, setLoading, loading, setUser, user, setToken } =
    useApp();
  const router = useRouter();
  const pathname = usePathname();

  // ---------------- Search state ----------------
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced live search (300ms)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    // clear previous timer
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      doSearch(searchQuery.trim());
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const doSearch = async (q) => {
    try {
      setSearchLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/post/search`, {
        query: q,
      });
      // Normalize response
      const payload = res?.data;
      const results = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
        ? payload.results
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
      setSearchResults(results);
      setShowResults(true);
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Search failed. Try again.");
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setSearchLoading(false);
    }
  };

  // Hide results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------- Theme token ----------------
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // -------------- Layout / user state --------------
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // load user from sessionStorage on mount
 // Load user from sessionStorage once on mount
useEffect(() => {
  if (typeof window !== "undefined") {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
  }
  // We only need this on mount, so no dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// Detect mobile screen size
useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  handleResize(); // Check immediately on mount
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

// Close mobile drawer when route changes
useEffect(() => {
  if (isMobile) {
    setMobileOpen(false);
  }
}, [pathname, isMobile]);

// Prevent body scroll when mobile drawer is open
useEffect(() => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }
}, [mobileOpen]);


  const siderWidth = collapsed ? 80 : 200;

  const initials = `${user?.firstName?.[0] || ""}${
    user?.lastName?.[0] || ""
  }`.toUpperCase();

  const showModal = () => setIsModalOpen(true);
  const handleModalCancel = () => setIsModalOpen(false);

  const Logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("selectedCommunity");
    setMobileOpen(false);
    router.push("/dashboard");
  };

  const createPost = () => {
    if (!user) {
      router.push("/signin");
    } else {
      router.push("/dashboard/newpost");
    }
  };

  // login handler
  const onFinish = async (values) => {
    const url = `${API_BASE_URL}/api/auth/login`;
    setLoading(true);
    try {
      const res = await axios.post(url, values);
      const u = res.data.user;
      const token = res.data.token;
      setUser(u);
      setToken(token);
      sessionStorage.setItem("user", JSON.stringify(u));
      sessionStorage.setItem("token", token);
      if (!u.interests || u.interests.length < 1) {
        router.push("/interest");
      } else {
        router.push("/dashboard");
      }
      toast.success("Login successful!");
      setIsModalOpen(false);
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || "Login failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Menu items (full navigation)
  const menuItems = [
    {
      key: "1",
      icon: <Image src="/images/Home.png" alt="" width={20} height={20} />,
      label: (
        <Link
          href="/dashboard"
          className="!text-[#D9D9D9]"
          onClick={() => isMobile && setMobileOpen(false)}
        >
          Home
        </Link>
      ),
    },
    {
      key: "2",
      icon: <Image src="/images/Compass.png" alt="" width={20} height={20} />,
      label: (
        <Link
          href="/dashboard/discover"
          className="!text-[#D9D9D9]"
          onClick={() => isMobile && setMobileOpen(false)}
        >
          Discover
        </Link>
      ),
    },
    {
      key: "3",
      icon: <Image src="/images/Document.png" alt="" width={20} height={20} />,
      label: (
        <Link
          href="/dashboard/activity"
          className="!text-[#D9D9D9]"
          onClick={() => isMobile && setMobileOpen(false)}
        >
          Activity
        </Link>
      ),
    },
    {
      key: "4",
      icon: <Image src="/images/sms_menu.png" alt="" width={20} height={20} />,
      label: (
        <Link
          href="/dashboard/message"
          className="!text-[#D9D9D9]"
          onClick={() => isMobile && setMobileOpen(false)}
        >
          Message
        </Link>
      ),
    },
    {
      key: "5",
      icon: <Image src="/images/people.png" alt="" width={20} height={20} />,
      label: (
        <Link
          href="/dashboard/communities"
          className="!text-[#D9D9D9]"
          onClick={() => isMobile && setMobileOpen(false)}
        >
          Communities
        </Link>
      ),
    },
    {
      key: "6",
      icon: <Image src="/images/setting.png" alt="" width={20} height={20} />,
      label: (
        <Link
          href="/dashboard/settings"
          className="!text-[#D9D9D9]"
          onClick={() => isMobile && setMobileOpen(false)}
        >
          Settings
        </Link>
      ),
    },
  ];

  const dropdownItems = [
    {
      key: "1",
      label: (
        <a href="/dashboard/profile" className="flex items-center gap-3">
          <Image src="/images/profile.png" alt="icon" width={17} height={10} />{" "}
          Profile
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a className="flex items-center gap-3">
          <Image src="/images/User_menu.png" alt="icon" width={17} height={10} />
          Account Settings
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a className="flex items-center gap-3">
          <Image src="/images/Headphones.png" alt="icon" width={17} height={10} />
          Help Support
        </a>
      ),
    },
    {
      key: "4",
      label: (
        <a
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            Logout();
            if (isMobile) setMobileOpen(false);
          }}
        >
          <Image src="/images/logout.png" alt="icon" width={17} height={10} />
          Sign Out
        </a>
      ),
    },
  ];

  // Handle clicking a search result
  const handleResultClick = (result) => {
    const id = result?._id || result?.id || result?.postId;
    if (id) {
      router.push(`/post/${id}`);
    } else if (result?.slug) {
      router.push(`/post/${result.slug}`);
    } else {
      console.warn("Search result has no id or slug:", result);
    }
    setShowResults(false);
    if (isMobile) setMobileOpen(false);
  };

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Mobile overlay (only when drawer open) */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[250] bg-black/40"
          aria-hidden
        />
      )}

      {/* Sider */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={200}
        style={{
          position: "fixed",
          height: "100vh",
          left: isMobile ? (mobileOpen ? 0 : -200) : 0,
          top: 0,
          bottom: 0,
          zIndex: 300,
          background: "#0A0E16",
          transition: "left 0.25s ease-in-out",
        }}
      >
        {/* Close icon inside sider for mobile */}
        {isMobile && mobileOpen && (
          <div style={{ position: "absolute", right: 10, top: 12, zIndex: 310 }}>
            <Button
              type="text"
              onClick={() => setMobileOpen(false)}
              icon={<CloseOutlined style={{ color: "#fff", fontSize: 20 }} />}
            />
          </div>
        )}

        {/* Logo */}
        <div className="flex items-center justify-center pt-3">
          {collapsed && !isMobile ? (
            <Image
              src="/images/small_icon.png"
              alt="icon"
              width={50}
              height={50}
              className="my-3"
            />
          ) : (
            <Image
              src="/images/large_icon.png"
              alt="icon"
              width={150}
              height={100}
              className="my-3"
            />
          )}
        </div>

        {/* Navigation menu */}
        <div className="mt-5">
          <Menu
            theme="#0A0E16"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={menuItems}
          />
        </div>

        {/* Collapse toggle for desktop only */}
        {!isMobile && (
          <Button
            type="text"
            className="!bg-[#1D222F] !w-[20px] !rounded-tr-none !rounded-br-none hover:!bg-[#F5F5F5] group"
            style={{
              position: "absolute",
              top: "77px",
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
        )}

        {/* User dropdown at bottom */}
        {user ? (
          <div className="absolute bottom-5 px-4 w-full">
            <Dropdown menu={{ items: dropdownItems }} placement="topLeft" trigger={["click"]}>
              <div className="flex items-center gap-2 cursor-pointer">
                {user?.avatar ? (
                  <div className="rounded-full w-12 h-12 overflow-hidden">
                    <Image
                      src={user?.avatar}
                      alt="user image"
                      width={45}
                      height={45}
                      className="rounded-full h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                    <h1 className="font-semibold text-gray-400">{initials}</h1>
                  </div>
                )}
                <div>
                  <h1 className={`${collapsed ? "hidden" : "block"} font-semibold`}>
                    {user?.firstName}
                  </h1>
                </div>
                <RightCircleOutlined
                  className={`${collapsed ? "hidden" : "block relative -right-5 text-[#D9D9D9]"}`}
                />
              </div>
            </Dropdown>
          </div>
        ) : null}
      </Sider>

      {/* Main layout shifted right to account for fixed Sider (desktop only) */}
      <div
        className="flex flex-col"
        style={{ marginLeft: isMobile ? 0 : siderWidth, height: "100vh" }}
      >
        {/* Fixed Header */}
        <Header
          className="flex justify-between items-center !px-5"
          style={{
            position: "fixed",
            top: 0,
            left: isMobile ? 0 : siderWidth,
            right: 0,
            zIndex: 299,
            height: 64,
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className="flex items-center gap-3 px-4">
            {/* Hamburger on mobile */}
            {isMobile && (
              <Button
                type="text"
                className="!mt-2"
                onClick={() => setMobileOpen((v) => !v)}
                icon={mobileOpen ? <CloseOutlined style={{ fontSize: 20 }} /> : <MenuOutlined style={{ fontSize: 20 }} />}
              />
            )}

            {/* Search box */}
            <div ref={searchRef} className="relative">
              <form onSubmit={(e) => { e.preventDefault(); doSearch(searchQuery.trim()); }}>
                <Input
                  placeholder="Search anything..."
                  className="mt-2 !rounded-full w-72 md:w-96"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchResults.length) setShowResults(true); }}
                  prefix={<Image src="/images/search-normal.png" alt="search icon" width={20} height={20} />}
                  suffix={
                    searchLoading
                      ? <Spin size="small" />
                      : <SearchOutlined onClick={() => doSearch(searchQuery.trim())} style={{ cursor: "pointer" }} />
                  }
                  onPressEnter={(e) => { e.preventDefault(); doSearch(searchQuery.trim()); }}
                />
              </form>

              {/* results dropdown */}
              {showResults && (
                <div
                  className="absolute left-0 mt-2 z-40 bg-white border rounded shadow-lg w-[28rem] max-w-full"
                  role="listbox"
                >
                  {searchLoading ? (
                    <div className="p-4 flex justify-center">
                      <Spin />
                    </div>
                  ) : searchResults && searchResults.length > 0 ? (
                    <div className="divide-y">
                      {searchResults.map((r, idx) => (
                        <button
                          key={idx}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex gap-3 items-start"
                          onClick={() => handleResultClick(r)}
                        >
                          {/* Optional thumbnail */}
                          {r.thumbnail ? (
                            // Use standard <img> for external thumbnail urls
                            // Next/Image not used here to simplify arbitrary remote urls
                            <img src={r.thumbnail} alt="" className="h-10 w-12 object-cover rounded" />
                          ) : (
                            <div className="h-10 w-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                              post
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-sm">{r.title || r.name || "Untitled"}</div>
                            <div className="text-xs text-gray-500 truncate">{r.excerpt || r.summary || r.description || ""}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4">
                      <Empty description="No results" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2.5 !items-center px-4">
            {pathname === "/dashboard/communities" ? (
              <Link href="/dashboard/create-community">
                <Button className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-4 !px-4 flex gap-2">
                  <Image src="/images/add.png" width={20} height={20} alt="icon" />
                  Create a Community
                </Button>
              </Link>
            ) : (
              <Button
                className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-4 !px-4 flex gap-2"
                onClick={createPost}
              >
                <Image src="/images/add.png" width={20} height={20} alt="icon" />
                New Post
              </Button>
            )}

            {!user ? (
              <Button
                className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-4 !px-4 flex gap-2"
                onClick={showModal}
              >
                Login
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-[#F3F3F4] rounded-full p-2">
                  <Image src="/images/sms.png" width={20} height={20} alt="icon" />
                </div>
                <div className="bg-[#F3F3F4] rounded-full p-2">
                  <Image src="/images/notification-bing.png" width={20} height={20} alt="icon" />
                </div>
              </div>
            )}
          </div>
        </Header>

        {/* Scrollable Content */}
        <Content
          className="overflow-y-auto p-3 !px-0"
          style={{
            marginTop: 64,
            background: "#F6F8FB",
            height: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Content>
      </div>

      {/* Login Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={false}
        className="!rounded-0"
        width={400}
      >
        <div className="flex justify-center pt-6">
          <Image src="/images/login_logo.png" alt="logo" width={150} height={150} />
        </div>
        <h1 className="font-semibold text-center text-2xl mt-3 mb-5">Welcome Back to Withread!</h1>

        <Form
          name="basic"
          layout="vertical"
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
              <Image src="/images/google.png" alt="logo" width={20} height={20} className="mr-2" />
              Continue with Google
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
