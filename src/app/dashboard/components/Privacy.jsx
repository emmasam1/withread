"use client";
import React, { useState } from "react";
import ToggleSwitch from "./reusables/toggleStwich";
import DisplayThemeSelector from "./ThemeToggle";
import Image from "next/image";
import Link from "next/link";

const Privacy = () => {
  const [allowFollow, setAllowFollow] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [commentsOnPost, setCommentsOnPost] = useState(false);
  const [tagsAndMentions, setTagsAndMentions] = useState(true);
  const [allowMessageRequests, setAllowMessageRequests] = useState(true);
  const [displayTheme, setDisplayTheme] = useState("Light");

  return (
    <div className="p-6 space-y-0">
      {/* Allow People to Follow */}
      <div className="flex justify-between items-start py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Allow People to Follow</h1>
          <p className="text-[#333333B2] text-xs">
            Let People follow you to see your posts on their feed
          </p>
        </div>
        <ToggleSwitch value={allowFollow} onChange={setAllowFollow} />
      </div>

      {/* Private Account */}
      <div className="flex justify-between items-start py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Private Account</h1>
          <p className="text-[#333333B2] text-xs">
            Turn your account to private and only your followers that you
            approve can view your profile
          </p>
        </div>
        <ToggleSwitch value={privateAccount} onChange={setPrivateAccount} />
      </div>

      {/* Comments on your Post */}
      <div className="flex justify-between items-start py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Comments on your Post</h1>
          <p className="text-[#333333B2] text-xs">
            Turn on and off your comments section of your post
          </p>
        </div>
        <ToggleSwitch value={commentsOnPost} onChange={setCommentsOnPost} />
      </div>

      {/* Display Theme */}
      <div className="flex justify-between items-start py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium mb-1">Display Theme</h1>
          <p className="text-[#333333B2] text-xs mb-2">
            Personalize the visual aesthetics of your interface
          </p>
        </div>
        <DisplayThemeSelector value={displayTheme} onChange={setDisplayTheme} />
      </div>

      {/* Tags and Mentions */}
      <div className="flex justify-between items-center py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Tags and Mentions</h1>
          <p className="text-[#333333B2] text-xs">
            Allows people to tag you to a post
          </p>
        </div>
        <ToggleSwitch value={tagsAndMentions} onChange={setTagsAndMentions} />
      </div>

      {/* Blocked Accounts */}
      <div className="flex justify-between items-center py-5 border-b border-[#D0D0D033]">
        <h1 className="font-medium">Blocked Accounts</h1>
        <Link href="/dashboard/settings/blocked-accounts" className="cursor-pointer">
          <Image
            src="/images/right_arrow.png"
            alt="arrow"
            height={10}
            width={10}
          />
        </Link>
      </div>

      {/* Allow Message Requests (LAST ONE - NO BORDER) */}
      <div className="flex justify-between items-start py-4">
        <div>
          <h1 className="font-medium">Allow message requests from:</h1>
          <p className="text-[#333333B2] text-xs">
            No one except people you follow
          </p>
        </div>
        <ToggleSwitch
          value={allowMessageRequests}
          onChange={setAllowMessageRequests}
        />
      </div>
    </div>
  );
};

export default Privacy;
