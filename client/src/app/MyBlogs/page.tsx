"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DialogCloseButton } from "@/components/CommentDialog";
import { DropdownMenuCheckboxes } from "@/components/DropdownMenu";

const Blog = () => {
  const [blogs, setBlogs] = useState<[] | any>([]);
  const [type, setType] = useState<string>("");
  const [tokenId, setTokenId] = useState<String>("");
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

  const filteredBlogs = blogs.filter((b: any) => b.userId === tokenId);

  return (
    <div>
      <h1 className="text-center text-4xl font-bold mt-2">My Blogs</h1>
      <div className="flex flex-col items-center py-7 mb-20 gap-5">
        {filteredBlogs &&
          filteredBlogs.length > 0 &&
          filteredBlogs.map((b: any, i: any) => {
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
                </div>
              </div>
            );
          })}
      </div>
      <div className="flex items-center justify-center">
        <Button className="bg-red-500" onClick={() => router.push("/")}>
          Home
        </Button>
      </div>
    </div>
  );
};

export default Blog;
