"use client";
import { DeleteComment } from "@/components/DeleteComment";
import { DropdownMenuCheckboxes } from "@/components/DropdownMenu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const { blogId } = useParams();
  console.log(blogId);
  const [blogs, setBlogs] = useState<[] | any>([]);
  const [tokenId, setTokenId] = useState("");
  const router = useRouter();
  const [type, setType] = useState("");
  console.log(blogId);

  const getBlog = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/blog/getBlog/${blogId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      setBlogs(data.message);
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getBlog();
    const token = localStorage.getItem("Token");
    if (token && token.length > 0) {
      const parsedToken = JSON.parse(atob(token.split(".")[1] as string));
      setTokenId(parsedToken.id);
    }
  }, []);
  console.log(blogs);

  return (
    <div className="flex items-center justify-center">
      <div className=" py-10 w-2/4">
        <div key={blogs._id} className="  p-5 border-gray-300 ">
          <Button
            onClick={() => router.push("/")}
            variant="destructive"
            className="mb-2"
          >
            Back
          </Button>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-bold text-xl">{blogs.username}</h1>
                <p className="text-sm text-gray-400">
                  Posted on: {blogs.createdAt?.split("T")[0]}
                </p>
              </div>
              {tokenId === blogs.userId && (
                <DropdownMenuCheckboxes
                  type={type}
                  setType={setType}
                  id={blogs?._id}
                  blogs={blogs}
                  setBlogs={setBlogs}
                />
              )}
            </div>
            <hr className="mb-2" />
            {blogs.blog_image ? (
              <Image
                className="w-full"
                src={blogs.blog_image}
                alt=""
                width={300}
                height={300}
              />
            ) : (
              ""
            )}
            <p className=" p-2">{blogs.Content}</p>
            <hr className="mt-1 mb-1" />
            <div>
              <p>Likes: {blogs?.likedBy?.length}</p>
            </div>

            <hr className="mt-2 mb-2" />
            <div>
              <p>All Comments: {blogs.comment?.length}</p>
              {blogs.comment?.map((c: any, i: any) => (
                <div
                  key={c._id}
                  className="mt-2 border border-gray-300 px-5 py-2 rounded"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center mb-1 mt-1">
                      <p className="text-sm text-gray-500 ">{c.username} at</p>
                      <p className="text-[10px] text-gray-400">
                        {c.date.split("T")[1].split(".")[0]}
                      </p>
                    </div>
                    <div>
                      {tokenId === c.id || tokenId === blogs.userId ? (
                        <DeleteComment
                          type={type}
                          setType={setType}
                          id={c._id}
                          blogId={blogs._id}
                          blog={blogs}
                          setBlogs={setBlogs}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <hr />

                  <p className="text-sm text-gray-600 mt-1">{c.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
