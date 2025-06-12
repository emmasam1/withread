"use client";

import { Button } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useApp } from "../context/context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const { API_BASE_URL, setLoading, loading, token } = useApp();
  const [interestsList, setInterestsList] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const router = useRouter();
  console.log(token)

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/interest/interests`);
        setInterestsList(res.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch interests:", error);
        toast.error("Failed to load interests.");
      }
    };

    fetchInterests();
  }, [API_BASE_URL]);

  const toggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if(interestsList.length < 1){
      toast.error("Select an interest")
      return
    }

    setLoading(true);

    try {

      if (!token) {
        toast.error("Authentication token missing. Please log in again.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("Using config for API call:", config);

      await axios.put(
        `${API_BASE_URL}/api/user/interests`,
        { interests: selectedInterests },
        config
      );

      toast.success("Interests saved!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Submit failed:", error?.response?.data || error.message);
      toast.error(
        error?.response?.data?.message || "Failed to save interests."
      );
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

        <div className="flex justify-center items-center flex-col !mt-20">
          <Image
            src="/images/login_logo.png"
            alt="logo"
            width={150}
            height={150}
          />
          <h1 className="font-semibold text-center text-black text-2xl mt-3 mb-5">
            Welcome to Withread!
          </h1>

          <h1 className="font-bold text-3xl text-black">
            What kind of interest do you want <br />
            on your feed?
          </h1>
          <p className="text-gray-500 mt-4">
            Select at least 4 for now. You can add more later.
          </p>

          <div className="flex flex-wrap gap-3 mt-5 max-w-2xl">
            {interestsList.map((interest) => (
              <button
                key={interest._id}
                onClick={() => toggleInterest(interest._id)}
                className={`px-5 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                  selectedInterests.includes(interest._id)
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                {interest.name}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              type="primary"
              onClick={handleSubmit}
              className="mt-10 !bg-[#141823] !rounded-full !px-10 !py-5"
              loading={loading}
            >
              Continue
            </Button>
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
