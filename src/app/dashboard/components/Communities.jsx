"use client";
import PostGrid from "./reusables/PostGrid";

const Communities = () => {
  return (
    <PostGrid
      endpoint="/api/community/my-community"
      // titleKey="name"
    //   descriptionKey="about"
      imageKey="banner"
      emptyMessage="No community yet."
    />
  );
};

export default Communities;
