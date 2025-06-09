"use client";

import { Input, Button } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../context/context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Page = () => {
  const [otp, setOtp] = useState("");
  const { API_BASE_URL, setLoading, loading } = useApp();
  const router = useRouter();

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits.");
      return;
    }

    const url = `${API_BASE_URL}/api/auth/verify-email`;

    setLoading(true);
    try {
      const res = await axios.post(url, { code: otp });
      toast.success(res.data.message || "Email verified successfully");
      router.push("/signin");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Verification failed. Try again.";
      toast.error(message);
      console.error("Verify error:", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_600px]">
      {/* Left Column */}
      <div className="p-4 bg-white h-screen relative overflow-y-auto">
        <Image
          src="/images/Group.png"
          alt="icon"
          width={100}
          height={100}
          className="absolute top-0 left-0"
        />
        <Image
          src="/images/shape-99.png"
          alt="icon"
          width={100}
          height={100}
          className="absolute bottom-0 right-0"
        />

        <div className="flex justify-center items-center flex-col h-full">
          <div className="flex justify-center">
            <Image
              src="/images/login_logo.png"
              alt="logo"
              width={150}
              height={150}
            />
          </div>
          <h1 className="font-semibold text-center text-black text-2xl mt-3 mb-5">
            Welcome to Withread!
          </h1>

          <div className="w-full max-w-sm flex flex-col items-center">
            <h1 className="font-bold text-md text-center text-black mb-3">
              Check your email for the OTP
            </h1>

            <Input.OTP
              length={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              inputType="numeric"
              className="!mb-5"
              autoFocus
            />

            <div className="flex justify-center">
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading}
                className="!bg-[#141823] !rounded-full !px-10 mt-5 !py-5 w-full"
              >
                Verify
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div
        className="hidden md:block p-4 h-screen"
        style={{
          backgroundImage: "url('/images/bg-img.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <ToastContainer />
    </div>
  );
};

export default Page;
