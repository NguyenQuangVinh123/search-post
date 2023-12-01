import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Route,
  Routes,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import PostList from "./components/PostList/PostList";
import SearchBar from "./components/SearchBar/SearchBar";
import FilterDropdown from "./components/FilterDropdown/FilterDropdown";
import { Post } from "./components/PostList/PostList";
export interface QueryFilter {
  userId?: string;
  q?: string;
  tags?: string;
  minReactions?: number;
}
const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [queryFilter, setQueryFilter] = useState<QueryFilter>({
    userId: "",
    q: "",
    tags: "",
    minReactions: 0,
  });
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/posts");
        setPosts(response.data.posts);
        setFilteredPosts(response.data.posts);
      } catch (error) {
        console.error("Fetching error:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const queryParams: any = {};
    urlParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    setQueryFilter(queryParams);
    const newFilteredPosts = posts.filter((post) => {
      const userIdMatch = queryParams["userId"]
        ? post.userId === parseInt(queryParams["userId"])
        : true;
      const minReactionsMatch = queryParams["minReactions"]
        ? post.reactions >= parseInt(queryParams["minReactions"])
        : true;

      const tagsMatch =
        queryParams["tags"]
          ? queryParams["tags"].split(',').some((tag: string) => post.tags.includes(tag))
          : true;
      const titleMatch = queryParams["q"]
        ? post.title.toLowerCase().includes(queryParams["q"].toLowerCase()) ||
          post.body.toLowerCase().includes(queryParams["q"].toLowerCase())
        : true;

      return userIdMatch && minReactionsMatch && tagsMatch && titleMatch;
    });
    setFilteredPosts(newFilteredPosts);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  const handleSearch = (query: string) => {
    const newFilteredPosts = posts.filter(
      (post) =>
        (query
          ? post.title.toLowerCase().includes(query.toLowerCase())
          : true) ||
        (query ? post.body.toLowerCase().includes(query.toLowerCase()) : true)
    );
    setFilteredPosts(newFilteredPosts);
    const newQueryFilter = removeFalsyValues({
      userId: searchParams.get("userId")?.toString() || undefined,
      tags: searchParams.get("tags")?.toString() || undefined,
      minReactions: searchParams.get("minReactions")?.toString() || undefined,
      q: query,
    });
    setSearchParams(createSearchParams(newQueryFilter));
  };
  const handleFilter = (filters: any) => {
    const newQueryFilter = removeFalsyValues({
      userId: filters.userId ? filters.userId : undefined,
      tags: filters.tags ? Array.isArray(filters.tags) ? filters.tags.join(',') : filters.tags.toString() : undefined,
      minReactions: filters.minReactions ? filters.minReactions : undefined,
      q: searchParams.get('q')?.toString(),
    });
    setSearchParams(createSearchParams(newQueryFilter));
    const newFilteredPosts = posts.filter((post) => {
      const userIdMatch = filters.userId
        ? post.userId === parseInt(filters.userId)
        : true;
      const minReactionsMatch = filters.minReactions
        ? post.reactions >= parseInt(filters.minReactions)
        : true;
      const tagsMatch =
        filters.tags && filters.tags.length > 0
          ? filters.tags.some((tag: any) => post.tags.includes(tag))
          : true;
      const titleMatch = searchParams.get('q')
        ? post.title.toLowerCase().includes(searchParams.get('q')?.toString().toLowerCase() || "") ||
          post.body.toLowerCase().includes(searchParams.get('q')?.toString().toLowerCase() || "")
        : true;
      return userIdMatch && minReactionsMatch && tagsMatch && titleMatch;
    });
    setFilteredPosts(newFilteredPosts);
  };


  const getAllTags = (posts: Post[]): string[] => {
    const uniqueTagsSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        uniqueTagsSet.add(tag);
      });
    });
    const uniqueTagsArray = Array.from(uniqueTagsSet);
    return uniqueTagsArray;
  };

  function removeFalsyValues<T>(obj: T): Partial<T> {
    const cleanedObject: Partial<T> = {};
    for (const key in obj) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== false) {
        cleanedObject[key] = obj[key];
      }
    }
    return cleanedObject;
  }

  return (
    <div className="max-w-6xl m-auto mt-3">
      <h1 className="font-bold text-lg text-center font-">Posts</h1>
      <SearchBar onSearch={(q) => handleSearch(q)} queryFilter={queryFilter} />
      <p
        className="mb-4 cursor-pointer"
        onClick={() => setIsOpenFilter(!isOpenFilter)}
      >
        Advanced Filter
      </p>
      {isOpenFilter && (
        <FilterDropdown
          onFilter={(f) => handleFilter(f)}
          allTags={getAllTags(posts)}
          queryFilter={queryFilter}
          isOpenFilter={isOpenFilter}
        />
      )}
      <Routes>
        <Route path="/" element={<PostList posts={filteredPosts} />} />
      </Routes>
    </div>
  );
};

export default App;
