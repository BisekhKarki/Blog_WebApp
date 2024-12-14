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
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface Props {
  type: string;
  setType: (type: string) => void;
  id: String;
  blogs: [] | null;
  setBlogs: (blogs: any) => void;
}

export function DropdownMenuCheckboxes({
  type,
  setType,
  id,
  setBlogs,
  blogs,
}: Props) {
  console.log(id);
  const router = useRouter();
  const deleteItem = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/blog/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        if (window.location.href === `http://localhost:3000/blogs/${id}`) {
          router.push("/");
        } else {
          setBlogs((previous: any) =>
            previous.filter((blog: any) => blog._id !== id)
          );
        }

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Ellipsis className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup>
          <div className="flex flex-col">
            <Button onClick={() => router.push(`/EditBlogs/${id}`)}>
              Edit
            </Button>
            <hr />
            <Button onClick={deleteItem}>Delete</Button>
          </div>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
