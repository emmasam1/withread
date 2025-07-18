"use client";
import React, { useState } from "react";
import ToggleSwitch from "./reusables/toggleStwich";

const Notification = () => {
  const [allowFollow, setAllowFollow] = useState(true);
  return (
    <div className="p-6 space-y-0">
      <div className="flex justify-between items-center py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Pop up notifications on desktop</h1>
        </div>
        <ToggleSwitch value={allowFollow} onChange={setAllowFollow} />
      </div>
      <div className="flex justify-between items-center py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Turn on all communities notifications</h1>
        </div>
        <ToggleSwitch value={allowFollow} onChange={setAllowFollow} />
      </div>
      <div className="flex justify-between items-center py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Turn on new trending topic notifications</h1>
        </div>
        <ToggleSwitch value={allowFollow} onChange={setAllowFollow} />
      </div>
      <div className="flex justify-between items-center py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Comments on your post</h1>
        </div>
        <ToggleSwitch value={allowFollow} onChange={setAllowFollow} />
      </div>
      <div className="flex justify-between items-center py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Replies to your comment</h1>
        </div>
        <ToggleSwitch value={allowFollow} onChange={setAllowFollow} />
      </div>
      <div className="flex justify-between items-center py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Likes on your post</h1>
        </div>
        <ToggleSwitch value={allowFollow} onChange={setAllowFollow} />
      </div>
      <div className="flex justify-between items-center py-5 border-b border-[#D0D0D033]">
        <div>
          <h1 className="font-medium">Likes on your comment</h1>
        </div>
        <ToggleSwitch value={allowFollow} onChange={setAllowFollow} />
      </div>
    </div>
  );
};

export default Notification;
