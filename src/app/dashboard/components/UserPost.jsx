import PostGrid from "./reusables/PostGrid";
const UserPost = () => {
  return <PostGrid endpoint="/api/post/user/posts" emptyMessage="No published posts yet." />;
};

export default UserPost;

