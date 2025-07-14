"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GoArrowLeft } from "react-icons/go";
import { useApp } from "@/app/context/context";
import axios from 'axios'

const page = () => {
  const { API_BASE_URL, loading, setLoading } = useApp();

  useEffect(() => {
    const getTrending = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/api/post/trending?page=1&limit=10`
        );

        // setTrending(sortedPosts);
        console.log(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getTrending();
  }, [API_BASE_URL]);

  return (
    <div className="p-3">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 !text-black text-sm w-20"
      >
        <GoArrowLeft />
        Back
      </Link>
      <div className="bg-white rounded-lg mt-4 p-3">
        <h1 className="font-semibold">Trending Contents</h1>
      </div>
    </div>
  );
};

export default page;
