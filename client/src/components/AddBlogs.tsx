"use client";
import Image from "next/image";
import React from "react";

import user from "@/assets/User.avif";
import { useRouter } from "next/navigation";

interface Props {
  src: string;
  id: string;
}

const AddBlogs = ({ src, id }: Props) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center py-5">
      <div
        onClick={() => router.push(`/PostBlog/${id}`)}
        className="flex items-center py-5  px-5 gap-3 text-center bg-white border border-gray-200 w-96 shadow-md rounded-md cursor-pointer"
      >
        <Image
          src={src && src.length > 0 ? src : user}
          alt="Avatar"
          width={50}
          height={50}
          className="rounded-full "
        />
        <p>What's on your mind?</p>
      </div>
    </div>
  );
};

export default AddBlogs;
