import PostGrid from "./reusables/PostGrid";

const SavedPost = () => {
  return (
    <PostGrid
      endpoint="/api/post/user/saved-post"
      emptyMessage="No saved posts yet."
    />
  );
};

export default SavedPost;