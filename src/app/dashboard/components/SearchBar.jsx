"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";
import { Input, Drawer, Spin } from "antd";
import Image from "next/image";

/* ✅ Wrapper with Suspense */
export default function SearchBarWrapper() {
  return (
    <Suspense
      fallback={
        <div className="w-72 md:w-96 mt-2">
          <Input
            disabled
            className="!rounded-full"
            placeholder="Loading search..."
          />
        </div>
      }
    >
      <SearchBar />
    </Suspense>
  );
}

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ loading state

  // ✅ Keep state in sync with query string
  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setLoading(true); // show spinner
    router.push(`/dashboard/search?q=${encodeURIComponent(searchTerm.trim())}`);
    // Simulate navigation delay
    setTimeout(() => {
      setLoading(false);
      setDrawerOpen(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const suffixIcon = loading ? (
    <Spin indicator={<LoadingOutlined spin />} size="small" />
  ) : (
    <SearchOutlined onClick={handleSearch} style={{ cursor: "pointer" }} />
  );

  return (
    <>
      {/* ✅ Desktop: full input */}
      <div className="hidden md:block">
        <Input
          placeholder="Search anything..."
          className="mt-2 !rounded-full w-72 md:w-96"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          prefix={
            <Image
              src="/images/search-normal.png"
              alt="search icon"
              width={20}
              height={20}
            />
          }
          suffix={suffixIcon}
        />
      </div>

      {/* ✅ Mobile: only search icon */}
      <div className="md:hidden">
        <SearchOutlined
          onClick={() => setDrawerOpen(true)}
          className="text-xl cursor-pointer !mt-4"
        />
      </div>

      {/* ✅ Drawer for mobile search */}
      <Drawer
        title="Search"
        placement="right"
        closable
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <Input
          placeholder="Search anything..."
          className="!rounded-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          prefix={
            <Image
              src="/images/search-normal.png"
              alt="search icon"
              width={20}
              height={20}
            />
          }
          suffix={suffixIcon}
        />
      </Drawer>
    </>
  );
}
