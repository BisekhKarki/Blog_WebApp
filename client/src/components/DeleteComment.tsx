"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { toast } from "react-toastify";

interface Props {
  type: string;
  setType: (type: string) => void;
  id: String;
  blogId: String;
  blog: [] | null;
  setBlogs: (blogs: any) => void;
}

export function DeleteComment({
  type,
  setType,
  id,
  blogId,
  blog,
  setBlogs,
}: Props) {
  const deleteItem = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/blog/getComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blogId: blogId,
            commentId: id,
          }),
        }
      );
      if (response.ok) {
        setBlogs((blogs: any) =>
          blogs.map((b: any) =>
            b._id === blogId
              ? {
                  ...b,
                  comment: b.comment.filter((c: any) => c._id !== id),
                }
              : b
          )
        );
        toast.success("Comment Deleted Successfully");
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="cursor-pointer">
          <Ellipsis />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={type} onValueChange={setType}>
          <DropdownMenuRadioItem value="edit">Edit</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="delete" onClick={() => deleteItem()}>
            Delete
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
