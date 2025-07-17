"use client";
import React, { useState } from "react";
import { useApp } from "@/app/context/context";
import { Button, Input, Upload } from "antd";
import Image from "next/image";

const { TextArea } = Input;
const { Dragger } = Upload;

const Profile = () => {
  const { user } = useApp();
  const [files, setFiles] = useState([]);
  const [link, setLink] = useState("");

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
      return false; // Prevent auto upload
    },
    onRemove: (file) => {
      setFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    },
    fileList: files,
    listType: "picture",
  };

  const handleDeletePicture = () => {
    // Logic to delete profile picture
    console.log("Profile picture deleted");
  };

  const handleChangePicture = () => {
    // Logic to trigger file upload for profile picture
    console.log("Change picture clicked");
  };

  return (
    <div className="p-3 rounded-lg space-y-8">
      {/* Profile Picture Section */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="rounded-full h-24 w-24 overflow-hidden">
            {user?.avatar ? (
              <Image
                src={user?.avatar}
                alt="Profile"
                height={100}
                width={100}
                className="rounded-full h-full w-full object-cover"
              />
            ) : (
              <Image
                src="/images/avatar.jpg"
                alt="Default Avatar"
                height={100}
                width={100}
                className="rounded-full h-full w-full object-cover"
              />
            )}
          </div>
          <div>
            <h1 className="font-semibold">Profile Picture</h1>
            <span className="text-[#333333B2] text-xs">
              PNG, JPEG under 10MB
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleChangePicture}
            className="!border-none !rounded-full !px-6 !py-4 !bg-black !text-white"
          >
            Change Picture
          </Button>
          <Button
            onClick={handleDeletePicture}
            className="!border-none !rounded-full !px-6 !py-4 !bg-[#F1F1F2] !text-black"
          >
            Delete Picture
          </Button>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="font-medium text-gray-700">First Name</p>
          <Input
            placeholder="Enter your first name"
            defaultValue={user?.firstName || ""}
            className="!rounded-lg !bg-[#F6F6F6] !border-[#0A0E1614]"
          />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-gray-700">Last Name</p>
          <Input
            placeholder="Enter your last name"
            defaultValue={user?.lastName || ""}
            className="!rounded-lg !bg-[#F6F6F6] !border-[#0A0E1614]"
          />
        </div>
      </div>

      {/* About Me */}
      <div>
        <p className="font-medium text-gray-700">About Me</p>
        <p className="text-sm text-gray-400">A short bio about yourself</p>
        <TextArea
          rows={4}
          placeholder="Write something about yourself..."
          className="!bg-[#F6F6F6] resize-none !border-[#0A0E1614]"
        />
      </div>

      {/* Attachments */}
      <div>
        <h1 className="font-semibold mb-2 text-sm text-gray-600">
         Upload a Profile Banner Picture
        </h1>
        <Dragger {...draggerProps} className="!bg-[#FAFAFA] !border-[#EAEAEA]">
          <p className="ant-upload-drag-icon flex items-center justify-center">
            <Image src="/images/upload.png" alt="Upload" width={40} height={40} />
          </p>
          <p className="ant-upload-text">
            Drag and drop media or click to upload
          </p>
        </Dragger>
      </div>
    </div>
  );
};

export default Profile;
