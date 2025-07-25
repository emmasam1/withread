"use client";
import React, { useState } from "react";
import { Button, Select, Input, Modal } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useApp } from "@/app/context/context";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

const Account = () => {
  const { user, API_BASE_URL, token } = useApp();

  // modal flow state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContinue, setIsContinue] = useState(false); // step indicator
  const [modalTitle, setModalTitle] = useState("Verify To Change Password");
  const [inputPlaceholder, setInputPlaceholder] = useState(
    "Enter your password"
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false); // API submit loading

  // password values
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* ---------------------------------- Modal --------------------------------- */
  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    resetModal();
  };

  const resetModal = () => {
    setIsContinue(false);
    setModalTitle("Verify To Change Password");
    setInputPlaceholder("Enter your password");
    setIsCompleted(false);
    setSubmitting(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  const onDone = () => {
    setIsModalOpen(false);
    resetModal();
  };

  /* ------------------------- Continue / Submit handler ----------------------- */
  const changePassword = async () => {
    // STEP 1 -> move to STEP 2
    if (!isContinue) {
      if (!currentPassword.trim()) {
        toast.error("Please enter your current password.");
        return;
      }
      setModalTitle("Change Your Password");
      setInputPlaceholder("Enter your new password");
      setIsContinue(true);
      return;
    }

    // STEP 2 -> submit to API
    if (!newPassword.trim()) {
      toast.error("Please enter a new password.");
      return;
    }

    // (Optional) basic client rule
    if (newPassword.trim().length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    const email = user?.email;
    if (!email) {
      toast.error("No email found for this account.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        email,
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      };
      const response = await axios.patch(
        `${API_BASE_URL}/api/user/change-password`,
        payload,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      toast.success(response?.data?.message || "Password changed successfully!");
      setIsCompleted(true);
    } catch (err) {
      console.error("Password change error:", err);
      // Attempt to surface backend msg if exists
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to change password.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-3 space-y-8">
      {/* Modal */}
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        closable
        centered
        className="!p-8"
      >
        {isCompleted ? (
          <div className="text-center py-6">
            <Image
              src="/images/check.png"
              alt=""
              height={100}
              width={100}
              className="mx-auto mb-2"
            />
            <p className="font-semibold text-lg">
              New Password Created Successfully!!
            </p>
            <Button
              className="!bg-black !text-white !rounded-full mx-auto w-full hover:!text-white !border-none mt-3"
              onClick={onDone}
            >
              Done
            </Button>
          </div>
        ) : (
          <div>
            {/* Email */}
            <div className="space-y-1 mb-4">
              <p className="font-medium text-gray-700">Email Address</p>
              <Input
                placeholder={user?.email || "mhug__01@mail.com"}
                disabled
                className="!rounded-lg !bg-[#F6F6F6] !border-[#0A0E1614] mt-1"
              />
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <p className="font-medium text-gray-700">
                {isContinue ? "Enter New Password" : "Re-enter Password"}
              </p>
              <Input.Password
                value={isContinue ? newPassword : currentPassword}
                onChange={(e) =>
                  isContinue
                    ? setNewPassword(e.target.value)
                    : setCurrentPassword(e.target.value)
                }
                placeholder={inputPlaceholder}
                className="!rounded-lg !bg-[#F6F6F6] !border-[#0A0E1614]"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </div>

            {/* Forgot password link only in verify step */}
            {!isContinue && (
              <div className="flex justify-end mt-4">
                <span className="text-purple-600 text-sm cursor-pointer hover:underline">
                  Forget Password
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-5 mt-6">
              <Button
                type="default"
                className="!rounded-full !px-6 !py-2 !bg-[#F6F6F6] !text-black"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                className="!rounded-full !px-6 !py-2 !bg-black !text-white"
                onClick={changePassword}
                loading={submitting}
              >
                Continue
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* General Section */}
      <h1 className="font-semibold text-lg">General</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Address */}
        <div className="space-y-1">
          <p className="font-medium text-gray-700">Email Address</p>
          <p className="text-sm text-gray-400">
            Manage your account email address
          </p>
          <Input
            placeholder={user?.email || "Michaelhughe001@gmail.com"}
            className="!rounded-lg !bg-[#F6F6F6] !border-[#0A0E1614] mt-1"
          />
        </div>
        <div></div>

        {/* Gender */}
        <div className="space-y-1">
          <p className="font-medium text-gray-700">Gender</p>
          <Select
            defaultValue="Male"
            className="!rounded-lg !bg-[#F6F6F6] !border-[#0A0E1614] !w-full"
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
          />
        </div>

        {/* Language */}
        <div className="space-y-1">
          <p className="font-medium text-gray-700">Language</p>
          <Select
            defaultValue="English (US)"
            className="!rounded-lg !bg-[#F6F6F6] !border-[#0A0E1614] !w-full"
            options={[
              { value: "English (US)", label: "English (US)" },
              { value: "French", label: "French" },
            ]}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1">
        <p className="font-medium text-gray-700">Password</p>
        <p className="text-sm text-gray-400">Manage your account password</p>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Michael_Hughe"
            className="!rounded-lg !bg-[#F6F6F6] !border-[#0A0E1614] !w-129"
          />
          <span
            className="text-purple-600 text-sm cursor-pointer hover:underline"
            onClick={showModal}
          >
            Verify to Change Password
          </span>
        </div>
      </div>

      {/* Authentication */}
      <h2 className="font-semibold text-lg">Authentication</h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-4">
          <div>
            <p className="font-medium text-gray-700">Google Account</p>
            <p className="text-sm text-gray-400">
              Connect to log in to withread with your google account
            </p>
          </div>
          <Button className="!rounded-full !px-6 !py-4 !bg-black !text-white">
            Connect Now
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-700">Apple Account</p>
            <p className="text-sm text-gray-400">
              Connect to log in to withread with your apple account
            </p>
          </div>
          <Button className="!rounded-full !px-6 !py-4 !bg-black !text-white">
            Connect Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Account;
