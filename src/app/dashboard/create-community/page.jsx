"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Select } from "antd";
import Image from "next/image";
import { PlusOutlined } from "@ant-design/icons";
import { useApp } from "@/app/context/context";
import axios from "axios";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Dragger } = Upload;

const Page = () => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]);          // banner / attachments
  const [avatarFile, setAvatarFile] = useState(null);
  const [categories, setCategories] = useState([]);

  const { API_BASE_URL, token, setLoading, loading } = useApp();

  /* ───────────────────────────────── fetch categories */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/interest/interests`);
        setCategories(
          res.data.categories.map((c) => ({ label: c.name, value: c._id }))
        );
      } catch (err) {
        console.error("Category fetch error:", err);
        toast.error("Could not load categories");
      }
    };
    fetchCategories();
  }, [API_BASE_URL]);

  /* ───────────────────────────────── submit */
  const handleSubmit = async (values) => {
    const { communityName, description, rules, categories: catIds } = values;

    const fd = new FormData();
    fd.append("name", communityName);
    fd.append("about", description);
    fd.append("rules", rules || "");
    fd.append("categories", JSON.stringify(catIds));

    // avatar
    if (avatarFile) {
      const realAvatar = avatarFile.originFileObj || avatarFile;
      fd.append("avatar", realAvatar);
    }

    // banner (first file)
    if (files.length > 0) {
      const realBanner = files[0].originFileObj || files[0];
      fd.append("banner", realBanner);
    }

    /* 🔍 log everything */
    console.log("── FormData Preview ──");
    for (const [key, val] of fd.entries()) {
      console.log(key, val);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/community/create-community`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Community created!");
      form.resetFields();
      setAvatarFile(null);
      setFiles([]);
    } catch (err) {
      console.error("Create community error:", err);
      toast.error("Error creating community");
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────────────────────── upload props */
  const avatarProps = {
    listType: "picture-card",
    fileList: avatarFile ? [avatarFile] : [],
    customRequest: ({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0),
    onChange: ({ file }) => {
      const url = URL.createObjectURL(file.originFileObj || file);
      setAvatarFile({ ...file, url });
    },
    onRemove: () => setAvatarFile(null),
    maxCount: 1,
  };

  const draggerProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file) => {
      setFiles((prev) => [...prev, file]);
      return false;
    },
    onRemove: (file) =>
      setFiles((prev) => prev.filter((f) => f.uid !== file.uid)),
    fileList: files,
  };

  const uploadButton = (
    <div className="flex flex-col items-center justify-center text-gray-500">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  /* ───────────────────────────────── UI */
  return (
    <div className="mx-4 bg-white p-6 rounded-md">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* name */}
        <Form.Item
          label={<p className="font-semibold">Community Name</p>}
          name="communityName"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input variant="filled" placeholder="e.g. Tech Builders" />
        </Form.Item>

        {/* about */}
        <Form.Item
          label={<p className="font-semibold">Community Description</p>}
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <TextArea
            variant="filled"
            placeholder="Tell us about your community..."
            style={{ height: 120, resize: "none" }}
          />
        </Form.Item>

        {/* rules */}
        <Form.Item
          label={<p className="font-semibold">Community Rules (Optional)</p>}
          name="rules"
        >
          <TextArea
            variant="filled"
            placeholder="What are the rules?"
            style={{ height: 120, resize: "none" }}
          />
        </Form.Item>

        {/* categories */}
        <Form.Item
          label={<p className="font-semibold">Select Categories</p>}
          name="categories"
          rules={[{ required: true, message: "Pick at least one category" }]}
        >
          <Select
            mode="multiple"
            variant="filled"
            placeholder="Choose categories..."
            options={categories}
          />
        </Form.Item>

        {/* avatar */}
        <Form.Item label={<p className="font-semibold">Community Avatar</p>}>
          <Upload {...avatarProps}>{!avatarFile && uploadButton}</Upload>
        </Form.Item>

        {/* banner / attachments */}
        <Form.Item label={<p className="font-semibold">Banner / Attachments</p>}>
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon flex items-center justify-center">
              <Image src="/images/upload.png" alt="upload" width={40} height={40} />
            </p>
            <p className="ant-upload-text">
              Drag & drop media or click to upload
            </p>
          </Dragger>
        </Form.Item>

        {/* preview thumbnails */}
        {files.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {files.map((file) => {
              const preview = URL.createObjectURL(
                file.originFileObj || file
              );
              return (
                <Image
                  key={file.uid}
                  src={preview}
                  alt="preview"
                  width={150}
                  height={150}
                  className="rounded object-cover"
                  onLoad={() => URL.revokeObjectURL(preview)}
                />
              );
            })}
          </div>
        )}

        {/* submit */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="!bg-black !text-white !rounded-full !px-6 !py-5"
          >
            Create Community
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
