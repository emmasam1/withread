import PostGrid from "./reusables/PostGrid";

const AnonymousPost = () => {
  return (
    <PostGrid
      endpoint="/api/post/user/anonymous-posts"
      emptyMessage="No anonymous posts yet."
    />
  );
};

export default AnonymousPost;
