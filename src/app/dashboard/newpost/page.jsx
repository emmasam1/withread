"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useApp } from "../../context/context";
import dynamic from "next/dynamic";
import { Select, Upload, Input, Button } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const { Dragger } = Upload;
const Editor = dynamic(
  () => import("primereact/editor").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

// Utility to strip HTML tags
const stripHtml = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const Page = () => {
  const { API_BASE_URL, loading, user, token, setLoading } = useApp();
  const [activeTab, setActiveTab] = useState("1");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [emojis, setEmojis] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  const tabs = [
    { key: "1", label: "Open Post" },
    { key: "2", label: "Anonymous Post" },
  ];

  const draggerProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file) => {
      setFiles((prev) => [...prev, file]);
      return false;
    },
    onRemove: (file) => {
      setFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    fileList: files,
  };

  const getCategories = async () => {
    const url = `${API_BASE_URL}/api/interest/interests`;
    try {
      const res = await axios.get(url);
      setCategories(res.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleChange = (value) => {
    setSelectedCategoryId(value);
  };

  const addPost = async () => {
  if (!title || !content) {
    toast.warning("Title and content are required.");
    return;
  }

  setLoading(true);

  const formData = new FormData();
  // formData.append("type", activeTab === "1" ? "true" : "false");
  formData.append("title", stripHtml(title));
  formData.append("content", stripHtml(content));
  formData.append("link", link);
  formData.append("emojis", emojis);
  formData.append("categories", JSON.stringify([selectedCategoryId]));
  formData.append("tags", tags);
  formData.append("collaborators", collaborators);

  files.forEach((file) => {
    formData.append("images", file);
  });

  // Debug log
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/post/post-feed`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Success response:", res.data);
    toast.success("Post submitted successfully!");

    // Reset form
    setTitle("");
    setContent("");
    setLink("");
    setEmojis("");
    setSelectedCategoryId("");
    setTags("");
    setCollaborators("");
    setFiles([]);
  } catch (error) {
    console.error("Post submission failed:", error.response?.data || error.message);
    toast.error("Something went wrong while submitting the post.");
  } finally {
    setLoading(false);
  }
};


  // const addPost = async () => {
  //   if (!title || !content) {
  //     toast.warning("Title and content are required.");
  //     return;
  //   }

  //   setLoading(true);
  //   const formData = new FormData();

  //   formData.append("type", activeTab === "1" ? "true" : "false");
  //   formData.append("title", stripHtml(title));
  //   formData.append("content", stripHtml(content));
  //   formData.append("link", link);
  //   formData.append("emojis", emojis);
  //   formData.append("categories", JSON.stringify([selectedCategoryId]));
  //   formData.append("tags", tags);
  //   formData.append("collaborators", collaborators);

  //   files.forEach((file) => {
  //     formData.append("images", file);
  //   });

  //   try {
  //     const res = await axios.post(
  //       `${API_BASE_URL}/api/post/post-feed`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     console.log(res)
  //     toast.success("Post submitted successfully!");


  //     // Debug log
  //     // for (let pair of formData.entries()) {
  //     //   console.log(`${pair[0]}:`, pair[1]);
  //     // }

  //     // Reset form
  //     setTitle("");
  //     setContent("");
  //     setLink("");
  //     setEmojis("");
  //     setSelectedCategoryId("");
  //     setTags("");
  //     setCollaborators("");
  //     setFiles([]);
  //   } catch (error) {
  //     console.error("Post submission failed:", error);
  //     toast.error("Something went wrong while submitting the post.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="p-4">
      <Link href="/dashboard" className="flex items-center gap-1.5 mb-3">
        <Image src="/images/arrow-left.png" alt="icon" width={20} height={15} />
        <p className="text-black text-sm">Main Feed</p>
      </Link>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt="user avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="bg-[#F6F6F6] rounded-full w-12 h-12 flex justify-center items-center">
                <h1 className="font-semibold text-gray-400">{initials}</h1>
              </div>
            )}
            <div>
              <h1 className="font-semibold capitalize text-sm">
                {user?.firstName} {user?.lastName}
              </h1>
            </div>
          </div>

          <div className="relative bg-gray-100 rounded-full w-64 h-10 p-1 flex items-center overflow-hidden">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-1 left-1 h-8 w-[calc(50%-0.25rem)] bg-white rounded-full shadow z-0"
              style={{
                left: activeTab === "1" ? "4px" : "calc(50% + 4px)",
              }}
            />
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 z-10 text-sm font-medium transition-colors ${
                  activeTab === tab.key ? "text-black" : "text-gray-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div>
            <Select
              placeholder="Select Category"
              style={{ width: 200 }}
              value={selectedCategoryId || undefined}
              onChange={handleChange}
              options={categories?.map((cat) => ({
                label: cat.name,
                value: cat._id,
              }))}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Button className="!bg-[#F1F1F2] !text-black !border-0 !rounded-full !py-4 !px-3">
              Invite to Collaborate
            </Button>
            <Image
              src="/images/Frame.png"
              alt="More options"
              width={18}
              height={12}
            />
          </div>
        </div>

        {/* Title */}
        <div className="mb-4 relative">
          <h1 className="font-semibold mb-2 text-sm text-gray-600 absolute top-3">
            Content Title
          </h1>
          <Editor
            value={title}
            onTextChange={(e) => setTitle(e.htmlValue)}
            placeholder="Title...."
            style={{
              height: "50px",
              background: "#F6F6F6",
              borderRadius: "10px",
              border: "none",
            }}
            className="rounded-md !border-0"
          />
        </div>

        {/* Content */}
        <div className="mb-4 relative">
          <h1 className="font-semibold mb-2 text-sm text-gray-600 absolute top-3">
            Content Description
          </h1>
          <Editor
            value={content}
            onTextChange={(e) => setContent(e.htmlValue)}
            placeholder="Share your content...."
            style={{
              height: "200px",
              background: "#F6F6F6",
              borderRadius: "20px",
              border: "none",
            }}
            className="rounded-md !border-0"
          />
        </div>

        {/* File Upload */}
        <div>
          <h1 className="font-semibold mb-2 text-sm text-gray-600">
            Attachments (media, links, code)
          </h1>
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon flex items-center justify-center">
              <Image
                src="/images/upload.png"
                alt="icon"
                width={40}
                height={40}
              />
            </p>
            <p className="ant-upload-text">
              Drag and drop media or click to upload
            </p>
          </Dragger>

          <Input
            placeholder="Links (optional)"
            className="!mt-4 !bg-[#F6F6F6] !py-3"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end my-4 gap-2">
          <Button className="!bg-[#F1F1F2] !text-black !border-0 !rounded-full !py-5 !px-8">
            Save to Drafts
          </Button>
          <Button
            className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-5 !px-8"
            onClick={addPost}
            loading={loading}
          >
            Post Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
