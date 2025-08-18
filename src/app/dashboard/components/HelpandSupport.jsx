import React, { useState } from "react";
import Image from "next/image";
import ToggleSwitch from "./reusables/toggleStwich";
import Link from "next/link";

const HelpandSupport = () => {
  return (
    <div className="p-3">
      <div className="flex justify-between items-start py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Report a Problem</h1>
          <p className="text-[#333333B2] text-xs">
            Report a problem and get help from us
          </p>
        </div>
        <Image
          src="/images/right_arrow.png"
          alt="arrow"
          height={10}
          width={10}
        />
      </div>
    
      <div className="flex justify-between items-start py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Help Center</h1>
          <p className="text-[#333333B2] text-xs">
            Report a problem and get help from us
          </p>
        </div>
        <Image
          src="/images/right_arrow.png"
          alt="arrow"
          height={10}
          width={10}
        />
      </div>
     <Link href="/dashboard/settings//contactus">
      <div className="flex justify-between items-start py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Contact Us</h1>
          <p className="text-[#333333B2] text-xs">
            Report a problem and get help from us
          </p>
        </div>
        <Image
          src="/images/right_arrow.png"
          alt="arrow"
          height={10}
          width={10}
        />
      </div>
     </Link>
      <div className="flex justify-between items-start py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Safety and Security</h1>
          <p className="text-[#333333B2] text-xs">
        Report a problem and get help from us
          </p>
        </div>
        <Image
          src="/images/right_arrow.png"
          alt="arrow"
          height={10}
          width={10}
        />
      </div>
      <div className="flex justify-between items-start py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Rules and Policies</h1>
          <p className="text-[#333333B2] text-xs">
            Report a problem and get help from us
          </p>
        </div>
        <Image
          src="/images/right_arrow.png"
          alt="arrow"
          height={10}
          width={10}
        />
      </div>
      <div className="flex justify-between items-start py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Report a Problem</h1>
          <p className="text-[#333333B2] text-xs">
            Report a problem and get help from us
          </p>
        </div>
        <Image
          src="/images/right_arrow.png"
          alt="arrow"
          height={10}
          width={10}
        />
      </div>
    </div>
  );
};

export default HelpandSupport;
