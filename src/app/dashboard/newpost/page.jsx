"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useApp } from "../../context/context";

import { Editor } from 'primereact/editor';
        

const page = () => {
  const { API_BASE_URL, loading, user, token } = useApp();
  const [text, setText] = useState('');
  const initials = `${user?.firstName?.[0] || ""}${
    user?.lastName?.[0] || ""
  }`.toUpperCase();

  console.log(initials);
  return (
    <div className="p-4">
      <Link href="/dashboard" className="flex items-center gap-1.5">
        {" "}
        <Image src="/images/arrow-left.png" alt="icon" width={20} height={15} />
        <p className="text-black text-sm">Main Feed</p>
      </Link>

      <div className="bg-white p-2 rounded-md mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {user?.avatar ? (
              <Image
                src={user?.avatar}
                alt="user avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                <h1 className="font-semibold text-gray-400">{initials}</h1>
              </div>
            )}
            <div>
              <h1 className="font-semibold capitalize">
                {user?.firstName} {user?.lastName}
              </h1>
            </div>
          </div>
          <div></div>
          <div></div>
        </div>

        <div className="card">
            <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} />
        </div>

        
      </div>
    </div>
  );
};

export default page;
