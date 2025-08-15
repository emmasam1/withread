"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Select, Upload, Input, Button } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { useApp } from "@/app/context/context";

const { Dragger } = Upload;
const Editor = dynamic(
  () => import("primereact/editor").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

// Strip HTML tags
const stripHtml = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// Inline DraftIdLoader component using useSearchParams safely
const DraftIdLoader = ({ onLoad }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      onLoad(id);
    }
  }, [id]);

  return null;
};

const Page = () => {
  const {
    API_BASE_URL,
    loading,
    user,
    token,
    setLoading,
    draftLoading,
    setDraftLoading,
  } = useApp();

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
  const [editedPost, setEditedPost] = useState(null);
  const [editedPostId, setEditedPostId] = useState(null);

  const { id: communityId } = useParams();

  const initials = `${user?.firstName?.[0] || ""}${
    user?.lastName?.[0] || ""
  }`.toUpperCase();
  const tabs = [
    { key: "1", label: "Open Post" },
    { key: "2", label: "Anonymous Post" },
  ];

  const draggerProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file) => {
      const preview = {
        uid: file.uid,
        name: file.name,
        status: "done",
        url: URL.createObjectURL(file),
        originFileObj: file,
      };
      setFiles((prev) => [...prev, preview]);
      return false;
    },
    onRemove: (file) => {
      setFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    fileList: files,
    listType: "picture",
  };

  const getCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/interest/interests`);
      setCategories(res.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (!editedPostId) return;

    const fetchDraft = async () => {
      try {
        const url = `${API_BASE_URL}/api/post/${editedPostId}`;
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setEditedPost(data.post);
        } else {
          toast.error("Draft not found");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading draft");
      }
    };

    fetchDraft();
  }, [editedPostId]);

  useEffect(() => {
    if (!editedPost) return;

    setTitle(editedPost.title || "");
    setContent(editedPost.content || "");
    setLink(editedPost.links?.[0] || "");
    setSelectedCategoryId(editedPost.categories?.[0]?._id || "");
    setTags((editedPost.tags || []).join(", "));
    setFiles(
      (editedPost.images || []).map((url, idx) => ({
        uid: `existing-${idx}`,
        name: `image-${idx}`,
        status: "done",
        url,
      }))
    );
    setActiveTab(editedPost.isAnonymous ? "2" : "1");
  }, [editedPost]);

  const handleChange = (value) => {
    setSelectedCategoryId(value);
  };

  const createdCommunityPost = async () => {
    if (!title || !content)
      return toast.warning("Title and content are required.");
    if (!selectedCategoryId) return toast.warning("Select a category.");

    setLoading(true);
    const formData = new FormData();
    formData.append("isAnonymous", activeTab === "2" ? "true" : "false");
    formData.append("title", stripHtml(title));
    formData.append("content", stripHtml(content));
    formData.append("link", link);
    formData.append("emojis", emojis);
    formData.append("categories", JSON.stringify([selectedCategoryId]));
    formData.append("tags", tags);
    formData.append("collaborators", collaborators);
    
      files.forEach((file, index) => {
    if (file.originFileObj) {
      // console.log(`✅ Appending new image [${index}]:`, file.originFileObj.name);
      formData.append("images", file.originFileObj);
    } else if (file.url) {
      console.log(`ℹ️ Existing image (URL only) [${index}]:`, file.url);
      // You can also send existing URLs if backend supports it
    } else {
      console.warn(`⚠️ File [${index}] has no originFileObj or URL:`, file);
    }
  });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/post/community/${communityId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data)
      toast.success(res?.data?.message || "Post created successfully!");
      setTitle("");
      setContent("");
      setLink("");
      setEmojis("");
      setSelectedCategoryId("");
      setTags("");
      setCollaborators("");
      setFiles([]);
    } catch (error) {
      toast.error("Something went wrong while submitting the post.");
    } finally {
      setLoading(false);
    }
  };

  const saveEditedPostToDraft = async () => {
    if (!title || !content)
      return toast.warning("Title and content are required.");
    if (!selectedCategoryId) return toast.warning("Select a category.");

    setDraftLoading(true);
    const formData = new FormData();

    formData.append("isAnonymous", activeTab === "2" ? "true" : "false");
    formData.append("status", "draft");
    formData.append("title", stripHtml(title));
    formData.append("content", stripHtml(content));
    formData.append("link", link);
    formData.append("emojis", emojis);
    formData.append("categories", JSON.stringify([selectedCategoryId]));
    formData.append("tags", tags);
    formData.append("collaborators", collaborators);

    // Separate existing and new images
    const existingImageUrls = [];
    files.forEach((file) => {
      if (file.originFileObj) {
        formData.append("images", file.originFileObj);
      } else if (file.url) {
        existingImageUrls.push(file.url);
      }
    });

    formData.append("existingImages", JSON.stringify(existingImageUrls));

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/post/drafts/${editedPostId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message || "Draft updated successfully!");
      setTitle("");
      setContent("");
      setLink("");
      setEmojis("");
      setSelectedCategoryId("");
      setTags("");
      setCollaborators("");
      setFiles([]);
    } catch (error) {
      toast.error("Failed to update draft.");
      console.error(error);
    } finally {
      setDraftLoading(false);
    }
  };

  const saveToDraft = async () => {
    if (!title || !content)
      return toast.warning("Title and content are required.");
    if (!selectedCategoryId) return toast.warning("Select a category.");

    setDraftLoading(true);
    const formData = new FormData();

    // Add text fields
    formData.append("isAnonymous", activeTab === "2" ? "true" : "false");
    formData.append("status", "draft");
    formData.append("title", stripHtml(title));
    formData.append("content", stripHtml(content));
    formData.append("link", link);
    formData.append("emojis", emojis);
    formData.append("categories", JSON.stringify([selectedCategoryId]));
    formData.append("tags", tags);
    formData.append("collaborators", collaborators);

    // Separate existing and new images
    const existingImageUrls = [];
    files.forEach((file) => {
      if (file.originFileObj) {
        // New file selected by user
        formData.append("images", file.originFileObj);
      } else if (file.url) {
        // Existing image from server
        existingImageUrls.push(file.url);
      }
    });

    // Append existing image URLs as JSON
    formData.append("existingImages", JSON.stringify(existingImageUrls));

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
      toast.success(res.data.message || "Post saved to draft successfully!");
      setTitle("");
      setContent("");
      setLink("");
      setEmojis("");
      setSelectedCategoryId("");
      setTags("");
      setCollaborators("");
      setFiles([]);
    } catch (error) {
      toast.error("Something went wrong while saving the draft.");
    } finally {
      setDraftLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Suspense fallback={null}>
        <DraftIdLoader onLoad={setEditedPostId} />
      </Suspense>
      <Link href="/dashboard/communities" className="flex items-center gap-1.5 mb-3">
        <Image src="/images/arrow-left.png" alt="icon" width={20} height={15} />
        <p className="text-black text-sm">Communities</p>
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
              onChange={(value) => setSelectedCategoryId(value)}
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
          {editedPostId ? (
            <Button
              onClick={saveEditedPostToDraft}
              loading={draftLoading}
              className="!bg-[#F1F1F2] !text-black !border-0 !rounded-full !py-5 !px-8"
            >
              Save to Drafts
            </Button>
          ) : (
            <Button
              onClick={saveToDraft}
              loading={draftLoading}
              className="!bg-[#F1F1F2] !text-black !border-0 !rounded-full !py-5 !px-8"
            >
              Save to Drafts
            </Button>
          )}

          <Button
            className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-5 !px-8"
            onClick={createdCommunityPost}
            loading={loading}
          >
            Post now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
