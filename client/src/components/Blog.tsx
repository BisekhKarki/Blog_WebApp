"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DropdownMenuCheckboxes } from "./DropdownMenu";
import { Heart } from "lucide-react";
import { DialogCloseButton } from "./CommentDialog";
import { useRouter } from "next/navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Button } from "@mui/material";

interface Props {
  username: string;
}

const Blog = ({ username }: Props) => {
  const [blogs, setBlogs] = useState<[] | any>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<[] | any>([]);
  const [type, setType] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("");
  const [poster, setPoster] = useState<[] | any>([]);
  const router = useRouter();

  const getAllBlogs = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/blog/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBlogs(data.message);

        setFilteredBlogs(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token && token.length > 0) {
      const parsedToken = JSON.parse(atob(token?.split(".")[1] as string));
      setTokenId(parsedToken.id);
      setPoster(parsedToken);
    }
  }, []);

  useEffect(() => {
    if (username.trim() === "") {
      setBlogs(filteredBlogs);
    } else {
      const filterByUsername = blogs.filter((b: any) =>
        b.username.toLowerCase().includes(username.toLowerCase())
      );
      setBlogs(filterByUsername);
    }
  }, [username]);

  const likeButton = async (id: string, userId: string) => {
    try {
      const response = await fetch("http://localhost:4000/api/blog/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId: id,
          userId: userId,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setBlogs((previous: any) =>
          previous.map((blog: any) =>
            blog._id === id ? { ...blog, likedBy: data.blog.likedBy } : blog
          )
        );
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.success(error);
    }
  };

  console.log(blogs);

  return (
    <div>
      <div className="flex flex-col items-center py-7 mb-20 gap-5">
        {blogs &&
          blogs.length > 0 &&
          blogs.map((b: any, i: any) => {
            return (
              <div
                key={b.id || i}
                className="w-2/5 border p-5 border-gray-300 shadow-lg rounded-lg"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="font-bold text-xl">{b.username}</h1>
                      <p className="text-sm text-gray-400">
                        Posted on: {b.createdAt.split("T")[0]}
                      </p>
                    </div>
                    {tokenId === b.userId && (
                      <DropdownMenuCheckboxes
                        type={type}
                        setType={setType}
                        id={b._id}
                        setBlogs={setBlogs}
                        blogs={blogs}
                      />
                    )}
                  </div>
                  <hr className="mb-2" />
                  {b.blog_image ? (
                    <Image
                      className="w-full cursor-pointer"
                      src={b.blog_image}
                      alt=""
                      width={300}
                      height={300}
                      onClick={() => router.push(`/blogs/${b._id}`)}
                    />
                  ) : (
                    ""
                  )}
                  <p
                    className="border p-2 border-gray-200 rounded cursor-pointer"
                    onClick={() => router.push(`/blogs/${b._id}`)}
                  >
                    {b.Content}
                  </p>
                  <div className="flex gap-5 mt-2">
                    <div className="flex items-center gap-1">
                      {b.likedBy.includes(tokenId) ? (
                        <FavoriteIcon
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() => {
                            likeButton(b._id, tokenId);
                          }}
                        />
                      ) : (
                        <Heart
                          className="h-5 w-5"
                          onClick={() => likeButton(b._id, tokenId)}
                        />
                      )}
                      <p className="text-sm text-gray-500">
                        {b.likedBy.length}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <DialogCloseButton
                        id={b._id}
                        poster={poster}
                        blogs={blogs}
                        setBlogs={setBlogs}
                      />
                      <p className="text-sm text-gray-500">
                        {b.comment.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Blog;
