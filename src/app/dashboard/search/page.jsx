"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import { Tabs, Spin, Empty, Button, Drawer } from "antd";
import { useApp } from "@/app/context/context";
import Link from "next/link";
import { FilterOutlined } from "@ant-design/icons";

/* ---------- Page Wrapper with Suspense ---------- */
export default function SearchPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      }
    >
      <SearchPage />
    </Suspense>
  );
}

/* ---------- Main Search Page ---------- */
function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { performSearch, searchResults, searchLoading } = useApp();

  const [activeTab, setActiveTab] = useState("all");
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => setMounted(true), []);

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
    <div className="flex w-full lg:w-[80%] m-auto min-h-screen relative">
      {/* Middle Section */}
      <div className="flex-1 px-3 sm:px-4 py-6 lg:pr-80">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold mb-4">
            Search results for:{" "}
            <span className="text-blue-500 break-words">{query}</span>
          </h1>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Button
              className="flex items-center"
              icon={<FilterOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Filters
            </Button>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={filters.map((f) => ({ key: f.key, label: f.label }))}
          tabBarGutter={16}
          className="overflow-x-auto"
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

      {/* Right Sidebar (Desktop) */}
      <div className="w-72 shadow-md bg-gray-50 px-4 py-6 mt-16 hidden lg:block fixed right-0 top-0 bottom-0 overflow-y-auto">
        <SidebarFilters
          filters={filters}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="Filter Search Results"
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="lg:hidden"
      >
        <SidebarFilters
          filters={filters}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </Drawer>
    </div>
  );
}

/* ---------- UI Components ---------- */
function SidebarFilters({ filters, activeTab, setActiveTab }) {
  return (
    <div className="space-y-2">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => setActiveTab(f.key)}
          className={`block w-full cursor-pointer text-left px-3 py-2 rounded transition ${
            activeTab === f.key
              ? "!bg-black !text-white font-semibold"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

function Section({ title, items, renderItem }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold mb-3">{title}</h2>
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
          className="w-full h-40 sm:h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-base sm:text-lg mb-2">
          {post.title}
        </h3>
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
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
        />
        <div>
          <p className="font-semibold text-base sm:text-lg">
            {community.name}
          </p>
          <p className="text-sm text-gray-500 line-clamp-2">
            {community.about}
          </p>
        </div>
      </div>
      <Button
        type="text"
        className="w-full !px-3 !bg-black font-semibold !text-white text-sm sm:text-base"
      >
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
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
        />
        <div>
          <p className="font-medium text-sm sm:text-base">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>
      <Button
        type="text"
        className="ml-4 !px-3 !bg-black !text-white font-semibold text-sm sm:text-base"
      >
        Follow
      </Button>
    </div>
  );
}
