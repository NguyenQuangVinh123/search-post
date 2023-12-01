import React from "react";
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: number;
}

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-6 rounded-md shadow-md transition-transform transform hover:scale-105"
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.body}</p>
            <div className="flex flex-col">
              <div className="flex space-x-2">
                <span className="text-gray-500">User ID: {post.userId}</span>
              </div>
              <div className="flex space-x-2">
                <span className="text-gray-500">
                  Reactions: {post.reactions}
                </span>
              </div>
              <div className="flex space-x-2">
                <span className="text-gray-500">
                  Tags: {post.tags.join(", ")}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-600">
          No posts match the current filters.
        </div>
      )}
    </div>
  );
};

export default PostList;
