import React from "react";
import { GoArrowLeft } from "react-icons/go";
import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";

const page = () => {
  const people = [
    {
      name: "Jameson Michelle",
      role: "Web3 Developer",
      contents: "10k Contents",
      followers: "800k Followers",
      description:
        "Developer with 8+ years of experience building scalable web applications. She specializes in JavaScript frameworks like React and Node.js. Jameson is also an active contributor to open-source projects and writes about the latest trends in web development.",
      verified: true,
    },
    {
      name: "Kounde Harry",
      role: "Cybersecurity",
      contents: "12k Contents",
      followers: "500k Followers",
      description:
        "Cybersecurity Analyst with a knack for identifying vulnerabilities and implementing robust security measures, with certifications in CISSP and CEH. Liam shares his knowledge through practical tips and frameworks to help teams stay one step ahead of cyber threats.",
      verified: true,
    },
    {
      name: "Damson Lamal",
      role: "Data Scientist",
      contents: "11k Contents",
      followers: "400k Followers",
      description:
        "Data Scientist with a deep understanding of machine learning, data mining, and statistical modeling. He’s proficient in Python and R, and has a regular speaker tech conferences and shares his knowledge through detailed tutorials and case studies on his Withread community.",
      verified: false,
    },
    {
      name: "Isabella Morgan",
      role: "UI/UX Designer",
      contents: "11k Contents",
      followers: "500k Followers",
      description:
        "Creative UI/UX Designer with a strong focus on user-centered design. She has over 7 years of experience crafting digital experiences that shine. She shares her thoughts on design trends and portfolio showcases.",
      verified: true,
    },
    {
      name: "James Foster",
      role: "Software Architect",
      contents: "10k Contents",
      followers: "500k Followers",
      description:
        "Software Architect who specializes in designing large-scale, distributed systems, with a deep expertise in microservices and cloud-native applications. James writes extensively about software architecture, system design, and emerging technologies on his blog.",
      verified: false,
    },
    {
      name: "Sophia Gray",
      role: "AI Researcher",
      contents: "12k Contents",
      followers: "500k Followers",
      description:
        "AI Researcher focused on natural language processing and generative models. She has published multiple papers in the field and often shares her findings and thought processes through her writings. Sophia shares all of it through her online channels.",
      verified: true,
    },
    {
      name: "Lucas Turner",
      role: "Mobile App Developer",
      contents: "10k Contents",
      followers: "500k Followers",
      description:
        "Mobile App Developer with a passion for creating intuitive and high-performance applications for iOS and Android platforms. Lucas enjoys mentoring junior devs and contributing to open source.",
      verified: false,
    },
    {
      name: "Ethan Brooks",
      role: "Ethical Hacker",
      contents: "12k Contents",
      followers: "500k Followers",
      description:
        "Ethical Hacker and penetration tester who helps companies secure their infrastructure. Ethan is known for breaking systems responsibly and educating others on how to secure theirs.",
      verified: false,
    },
  ];

  return (
    <div className="p-4">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 !text-black text-sm w-25"
      >
        <GoArrowLeft />
        Main Feed
      </Link>

      <div className="p-3 rounded-lg bg-white mt-4">
        <h1 className="font-semibold">Top Creators</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {/* Card 1 */}
          {people.map((person) => {
            return (
              <div className="bg-white flex items-center gap-4">
                <div className="h-40 w-50 rounded-lg">
                  <Image
                    src="/images/user_img.jpg"
                    alt="user image"
                    height={1000}
                    width={400}
                    className="shadow object-cover w-full h-40 rounded-lg"
                  />
                </div>
                <div className="w-full">
                  <div className="flex justify-between">
                    <div>
                      <h1 className="font-semibold capitalize">
                        {person.name}
                      </h1>
                      <span className="mt-2 text-[#333333E5] text-[.8rem]">
                        {person.role}
                      </span>
                      <div className="flex items-center gap-3 mt-2 text-[#333333a4] text-[.8rem]">
                        <span>16k Contents</span>
                        <Image
                          src="/images/dot.png"
                          alt="dot"
                          height={4}
                          width={4}
                        />
                        <span>800k Followers</span>
                      </div>
                    </div>
                    <Button className="!bg-black !border-none !rounded-full hover:!border-none !text-white p-3">
                      Follow
                    </Button>
                  </div>
                  <p className="mt-2 text-[.8rem] text-[#333333E5]">
                    {person.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default page;
