const FollowBtn = ({ userId }) => {
  const { user: currentUser, toggleFollowUser } = useApp();
  const [loading, setLoading] = useState(false);

  const isFollowing = (currentUser?.following || [])
    .map(String)
    .includes(String(userId));

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    await toggleFollowUser(userId);
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 rounded transition-colors duration-200 ${
        isFollowing
          ? "bg-red-500 hover:bg-red-600"
          : "bg-blue-500 hover:bg-blue-600"
      } text-white disabled:opacity-50`}
    >
      {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};
