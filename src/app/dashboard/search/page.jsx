"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Tabs, Spin, Empty, Button } from "antd";
import { useApp } from "@/app/context/context";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { performSearch, searchResults, searchLoading } = useApp();

  const [activeTab, setActiveTab] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && query) {
      performSearch(query, activeTab);
    }
  }, [query, activeTab, mounted]);

  const filters = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "posts", label: "Posts" },
      { key: "users", label: "Users" },
      { key: "communities", label: "Communities" },
    ],
    []
  );

  if (!mounted) {
    return (
      <div className="flex justify-center py-10">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex w-[80%] m-auto min-h-screen">
      {/* Middle Section */}
      <div className="flex-1 px-4 py-6 lg:pr-80">
        <h1 className="text-xl font-semibold mb-4">
          Search results for:{" "}
          <span className="text-blue-500">{query}</span>
        </h1>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={filters.map((f) => ({
            key: f.key,
            label: f.label,
          }))}
        />

        {/* Loading */}
        {searchLoading && (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        )}

        {/* Results */}
        {!searchLoading && searchResults && (
          <div className="mt-4 space-y-6">
            {activeTab === "all" && (
              <>
                <Section
                  title="Users"
                  items={searchResults.results.users}
                  renderItem={(user) => <UserCard key={user._id} user={user} />}
                />

                <Section
                  title="Posts"
                  items={searchResults.results.posts}
                  renderItem={(post) => <PostCard key={post._id} post={post} />}
                />

                <Section
                  title="Communities"
                  items={searchResults.results.communities}
                  renderItem={(com) => (
                    <CommunityCard key={com._id} community={com} />
                  )}
                />
              </>
            )}

            {activeTab === "users" && (
              <Section
                title="Users"
                items={searchResults.results.users}
                renderItem={(user) => <UserCard key={user._id} user={user} />}
              />
            )}

            {activeTab === "posts" && (
              <Section
                title="Posts"
                items={searchResults.results.posts}
                renderItem={(post) => <PostCard key={post._id} post={post} />}
              />
            )}

            {activeTab === "communities" && (
              <Section
                title="Communities"
                items={searchResults.results.communities}
                renderItem={(com) => (
                  <CommunityCard key={com._id} community={com} />
                )}
              />
            )}
          </div>
        )}

        {/* Empty State */}
        {!searchLoading && !searchResults && (
          <div className="flex justify-center py-10">
            <Empty description="No results yet" />
          </div>
        )}
      </div>

      {/* Right Sidebar - Fixed */}
      <div className="w-72 border-l bg-gray-50 px-4 py-6 hidden lg:block fixed right-0 top-0 bottom-0 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 mt-15">Filter Search results</h2>
        <div className="space-y-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveTab(f.key)}
              className={`block w-full text-left px-3 py-2 rounded transition ${
                activeTab === f.key
                  ? " !bg-black !text-white font-semibold"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- UI Components ---------- */
function Section({ title, items, renderItem }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="space-y-4">{items.map((item) => renderItem(item))}</div>
    </div>
  );
}

function PostCard({ post }) {
  return (
    <div className="rounded-xl shadow-sm bg-white overflow-hidden">
      {post.images && (
        <img
          src={post.images}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">
           {post.content.slice(0, 150)}...
           <Link
             href={`/dashboard/feeds/${post._id}`}
             className="text-blue-500 ml-1 px-0 mt-2"
           >
            Read More
           </Link>
        </p>
      </div>
    </div>
  );
}

function CommunityCard({ community }) {
  return (
    <div className="rounded-xl shadow-sm bg-white p-4">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={community.avatar || "/default-community.png"}
          alt={community.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-semibold text-lg">{community.name}</p>
          <p className="text-sm text-gray-500 line-clamp-2">
            {community.about}
          </p>
        </div>
      </div>
      <Button type="text" className="w-full !px-3 !bg-black font-semibold !text-white  text-xl sm:text-sm">
        Join
      </Button>
    </div>
  );
}

function UserCard({ user }) {
  return (
    <div className="rounded-xl shadow-sm bg-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.username}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>
      <Button type="text" className="ml-4 !px-3 !bg-black !text-white font-semibold  text-xl sm:text-sm">
        Follow
      </Button>
    </div>
  );
}
