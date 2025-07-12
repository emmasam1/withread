"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { GoArrowLeft } from "react-icons/go";
import { Skeleton } from "antd";

const page = () => {
  const [loading, setLoading] = useState(true);

  const mainPost = [
    {
      id: "main-001",
      title:
        "New Solar Panel Technology that Sells Sunlight at Night Increases Efficiency by 40%",
      image: "/images/solar.jpg",
      content: `
In a groundbreaking advancement, researchers have developed a revolutionary solar panel technology capable of storing and selling solar energy at night, dramatically improving energy efficiency by up to 40%. This innovation is being hailed as a major leap forward in the global push toward sustainable energy and carbon neutrality.

Traditionally, solar panels have been limited by their dependency on sunlight, restricting energy production to daylight hours. This new technology, however, introduces a hybrid mechanism that not only captures solar energy during the day but also stores excess power using high-efficiency thermal batteries and smart-grid conversion systems. This allows the energy to be redistributed or sold during peak demand times—especially at night when energy use typically spikes.

The new panels, developed by a collaborative team of engineers and climate scientists, incorporate advanced photon-absorbing materials, such as perovskite-silicon tandems, which are significantly more effective than conventional silicon-only panels. These materials can absorb a broader spectrum of light, even in low-light conditions like dusk or overcast weather.

Dr. Emily Nash, the lead researcher on the project, explained, “Our technology is designed to challenge the limitations of current photovoltaic systems. By integrating a storage system and real-time energy redistribution capabilities, we're essentially turning every rooftop into a 24-hour power station.”

Pilot programs conducted in California and parts of Europe have already shown impressive results. Residential and commercial properties using these panels reported not only a 40% increase in energy efficiency but also a 25% reduction in monthly electricity bills. Energy companies have expressed keen interest in adopting this innovation for wide-scale distribution, especially in off-grid and rural areas where reliable power remains a challenge.

The system’s built-in software also utilizes AI to monitor weather patterns, predict energy consumption, and optimize power distribution automatically. This ensures maximum output with minimal human intervention, making it suitable for both tech-savvy users and those new to renewable energy.

Experts believe this could be a turning point in solar adoption globally. With the cost of clean energy technology steadily dropping and its accessibility improving, homeowners, businesses, and governments are finding fewer reasons to rely on fossil fuels.

As the world races against climate change deadlines, innovations like this new solar panel could provide the much-needed momentum to achieve a sustainable, carbon-neutral future. In the words of Dr. Nash, “This isn’t just about generating electricity. It's about empowering people, protecting the planet, and redefining our relationship with energy.”`,
      date: "29 Aug, 2024",
      readTime: "3 min read",
      author: "Ramsey Gary",
    },
  ];

  const relatedPosts = [
    {
      id: "rel-001",
      title:
        "New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40%",
      image: "/images/dog.jpg",
      date: "29 Aug, 2024",
      readTime: "3 min read",
      author: "Ramsey Gary",
    },
    {
      id: "rel-002",
      title:
        "New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40%",
      image: "/images/dog.jpg",
      date: "29 Aug, 2024",
      readTime: "3 min read",
      author: "Ramsey Gary",
    },
    {
      id: "rel-003",
      title:
        "New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40%",
      image: "/images/dog.jpg",
      date: "29 Aug, 2024",
      readTime: "3 min read",
      author: "Ramsey Gary",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // simulate loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4">
      <Link
        href="/dashboard/discover"
        className="flex items-center gap-2 !text-black text-sm w-20"
      >
        <GoArrowLeft />
        Discover
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_400px] gap-7 p-4 mt-4">
        <div className="rounded-lg grid grid-cols bg-white p-3">
          {loading ? (
            <>
              <Skeleton.Image active className="!w-full !h-[250px] !rounded-md" />
              <Skeleton active paragraph={{ rows: 6 }} className="mt-4" />
            </>
          ) : (
            mainPost.map((post) => (
              <div key={post.id}>
                <Image
                  src='/images/image1.png'
                  alt=""
                  width={1500}
                  height={1000}
                  className="rounded-md"
                />
                <h1 className="text-[#333333] font-semibold mt-2 text-2xl">
                  {post.title}
                </h1>
                <p className="mt-3 whitespace-pre-line">{post.content}</p>
              </div>
            ))
          )}
        </div>

        <div className="w-full relative lg:fixed lg:right-10 lg:w-[400px] lg:h-screen lg:pb-35 overflow-auto bg-white rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold">More by Ramsey Gary</h1>
            <Link href="#" className="text-xs">
              See All
            </Link>
          </div>

          <div className="mt-4">
            {loading
              ? Array(3)
                  .fill(null)
                  .map((_, idx) => (
                    <div key={idx} className="mb-4">
                      <Skeleton.Image
                        active
                        className="!w-full !h-[100px] !rounded-md"
                      />
                      <Skeleton active paragraph={{ rows: 2 }} className="mt-2" />
                    </div>
                  ))
              : relatedPosts.map((post) => (
                  <div className="mb-4" key={post.id}>
                    <Image
                      src={post.image}
                      alt=""
                      width={1400}
                      height={600}
                      className="rounded-md w-full"
                    />
                    <h1 className="text-[#333333E5] mt-2 text-[.8rem]">
                      {post.title}
                    </h1>
                    <div className="flex items-center gap-10">
                      <div className="flex items-center gap-1 mt-2">
                        <Image
                          src="/images/Calendar.png"
                          alt=""
                          width={15}
                          height={15}
                        />
                        <span className="text-[#333333E5] text-xs">
                          {post.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-3">
                        <Image
                          src="/images/clock.png"
                          alt=""
                          width={15}
                          height={15}
                        />
                        <span className="text-[#333333E5] text-xs">
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
