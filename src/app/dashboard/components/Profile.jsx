"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/app/context/context";
import { Button, Input, Upload, Modal, message, Skeleton } from "antd";
import Image from "next/image";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const { TextArea } = Input;
const { Dragger } = Upload;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Profile = () => {
  const { API_BASE_URL, token, loading, setLoading } = useApp();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [bannerFiles, setBannerFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });
  const [updateProfile, setUpdateProfile] = useState(false);

  // Banner Upload config
  const draggerProps = {
    multiple: false,
    beforeUpload: (file) => {
      const newFile = {
        uid: file.uid,
        name: file.name,
        status: "done",
        url: URL.createObjectURL(file),
        originFileObj: file,
      };
      setBannerFiles([newFile]);
      return false; // prevent auto upload
    },
    onRemove: () => setBannerFiles([]),
    fileList: bannerFiles,
    listType: "picture",
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || "");
    setPreviewOpen(true);
  };

  const handleAvatarChange = ({ fileList: newList }) => {
    setFileList(newList);
  };

  const uploadAvatar = async () => {
    if (fileList.length === 0) {
      message.error("Please select an avatar first!");
      return;
    }
    const file = fileList[0]?.originFileObj;
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setAvatarUploading(true);
      const res = await axios.patch(`${API_BASE_URL}/api/user/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message);
      setUserDetails((prev) => ({
        ...prev,
        user: { ...prev.user, avatar: res.data.avatar },
      }));
      setFileList([]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      message.error("Avatar upload failed");
    } finally {
      setAvatarUploading(false);
    }
  };

  const getUserProfile = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(res.data);
      setProfileForm({
        firstName: res.data?.user?.firstName || "",
        lastName: res.data?.user?.lastName || "",
        bio: res.data?.user?.bio || "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setUpdateProfile(true);
      const formData = new FormData();
      formData.append("firstName", profileForm.firstName);
      formData.append("lastName", profileForm.lastName);
      formData.append("bio", profileForm.bio);
      if (bannerFiles.length > 0) {
        formData.append("banner", bannerFiles[0].originFileObj);
      }

      const res = await axios.patch(`${API_BASE_URL}/api/user/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      getUserProfile();
    } catch (err) {
      console.error(err);
      toast.error(err || "Profile update failed");
    } finally {
      setUpdateProfile(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [token]);

  return (
    <div className="p-3 rounded-lg space-y-8">
      <ToastContainer />
      {loading ? (
        // 🔹 Skeleton Loader
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton.Avatar active size={96} shape="circle" />
            <div className="flex flex-col gap-2">
              <Skeleton.Input active size="small" style={{ width: 120 }} />
              <Skeleton.Input active size="small" style={{ width: 180 }} />
            </div>
          </div>
          <Skeleton.Input active size="default" block />
          <Skeleton.Input active size="default" block />
          <Skeleton paragraph={{ rows: 4 }} active />
          <Skeleton.Input active size="large" block />
        </div>
      ) : (
        <>
          {/* Profile Picture */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="rounded-full h-24 w-24 overflow-hidden">
                {avatarUploading ? (
                  <Skeleton.Avatar active size={96} shape="circle" />
                ) : (
                  <Image
                    src={userDetails?.user?.avatar || "/images/avatar.jpg"}
                    alt="Profile"
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
            <Button
              onClick={() => setIsModalOpen(true)}
              className="!border-none !rounded-full !px-6 !py-4 !bg-black !text-white"
            >
              Change Picture
            </Button>
          </div>

          {/* Change Picture Modal */}
          <Modal
            title="Change Picture"
            open={isModalOpen}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false}
              onPreview={handlePreview}
              onChange={handleAvatarChange}
              accept=".png,.jpg,.jpeg"
              maxCount={1}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Select</div>
                </div>
              )}
            </Upload>
            {fileList.length > 0 && (
              <div className="flex justify-center mt-3">
                <Button
                  type="primary"
                  onClick={uploadAvatar}
                  loading={avatarUploading}
                  className="!border-none !rounded-full !px-6 !py-4 !bg-black !text-white"
                >
                  Upload Avatar
                </Button>
              </div>
            )}
          </Modal>

          {/* Preview Modal */}
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
          >
            <img alt="preview" style={{ width: "100%" }} src={previewImage} />
          </Modal>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="font-medium text-gray-700">First Name</p>
              <Input
                value={profileForm.firstName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, firstName: e.target.value })
                }
                className="!rounded-lg !bg-[#F6F6F6] !border-[#0A0E1614]"
              />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-700">Last Name</p>
              <Input
                value={profileForm.lastName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, lastName: e.target.value })
                }
                className="!rounded-lg !bg-[#F6F6F6] !border-[#0A0E1614]"
              />
            </div>
          </div>

          {/* About Me */}
          <div>
            <p className="font-medium text-gray-700">About Me</p>
            <TextArea
              rows={4}
              value={profileForm.bio}
              onChange={(e) =>
                setProfileForm({ ...profileForm, bio: e.target.value })
              }
              className="!bg-[#F6F6F6] resize-none !border-[#0A0E1614]"
            />
          </div>

          {/* Profile Banner Upload */}
          <div>
            <h1 className="font-semibold mb-2 text-sm text-gray-600">
              Upload a Profile Banner Picture
            </h1>
            <Dragger {...draggerProps} className="!bg-[#FAFAFA] !border-[#EAEAEA]">
              <p className="ant-upload-drag-icon flex items-center justify-center">
                <Image src="/images/upload.png" alt="Upload" width={40} height={40} />
              </p>
              <p className="ant-upload-text">
                Drag and drop media or click to select
              </p>
            </Dragger>
          </div>

          {/* Update Profile Button */}
          <div>
            <Button
              onClick={handleProfileUpdate}
              loading={updateProfile}
              className="!border-none !rounded-full !px-6 !py-4 !bg-black !text-white"
            >
              Update Profile
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
