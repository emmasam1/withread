"use client";
import React, { useState } from "react";
import { Button, Select, Input, Modal } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useApp } from "@/app/context/context";
import Image from "next/image";

const Account = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContinue, setIsContinue] = useState(false);
  const [modalTitle, setModalTitle] = useState("Verify To Change Password");
  const [inputPlaceholder, setInputPlaceholder] = useState(
    "Enter your password"
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const { user } = useApp();

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
  };

  const changePassword = () => {
    if (!isContinue) {
      // First click: Switch to Change Password screen
      setModalTitle("Change Your Password");
      setInputPlaceholder("Enter your new password");
      setIsContinue(true);
    } else {
      // Second click: Simulate API call and show success state
      setIsCompleted(true);
      setTimeout(() => {
        // resetModal();
      }, 2000);
    }
  };

  const onDone = () => {
    setIsModalOpen(false);
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
            <Button className="!bg-black !text-white !rounded-full mx-auto w-full hover:!text-white !border-none mt-3" onClick={onDone}>
              Done
            </Button>
          </div>
        ) : (
          <div>
            <div className="space-y-1 mb-4">
              <p className="font-medium text-gray-700">Email Address</p>
              <Input
                placeholder={user?.email || "mhug__01@mail.com"}
                disabled
                className="!rounded-lg !bg-[#F6F6F6] !border-[#0A0E1614] mt-1"
              />
            </div>

            <div className="space-y-1">
              <p className="font-medium text-gray-700">
                {isContinue ? "Enter New Password" : "Re-enter Password"}
              </p>
              <Input.Password
                placeholder={inputPlaceholder}
                className="!rounded-lg !bg-[#F6F6F6] !border-[#0A0E1614]"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </div>

            {!isContinue && (
              <div className="flex justify-end mt-4">
                <span className="text-purple-600 text-sm cursor-pointer hover:underline">
                  Forget Password
                </span>
              </div>
            )}

            <div className="flex justify-end gap-5 mt-6">
              <Button
                type="default"
                className="!rounded-full !px-6 !py-2 !bg-[#F6F6F6] !text-black"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                className="!rounded-full !px-6 !py-2 !bg-black !text-white"
                onClick={changePassword}
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
