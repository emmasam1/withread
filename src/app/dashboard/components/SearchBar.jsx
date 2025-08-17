"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Image from "next/image";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(queryParam);

  // ✅ keep state in sync with query string
  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    router.push(`/dashboard/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
<div className="relative">
  <Input
    placeholder="Search anything..."
    className="mt-2 !rounded-full w-72 md:w-96"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={handleKeyDown}
    prefix={
      <Image
        src="/images/search-normal.png"
        alt="search icon"
        width={20}
        height={20}
      />
    }
    suffix={
      <SearchOutlined
        onClick={handleSearch}
        style={{ cursor: "pointer" }}
      />
    }
  />
</div>
  );
};

export default SearchBar;


