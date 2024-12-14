"use client";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BiComment } from "react-icons/bi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  id: String;
  poster: [] | any;
  blogs: [] | any;
  setBlogs: (blogs: any) => void;
}

export function DialogCloseButton({ id, poster, blogs, setBlogs }: Props) {
  const [comment, setComment] = useState("");

  const postComment = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/blog/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          username: poster?.username,
          commentText: comment,
          userId: poster?.id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);

        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <BiComment />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogDescription>Comment something you like to.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label className="sr-only">Link</Label>
            <Input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="destructive">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose>
            <Button type="button" variant="default" onClick={postComment}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
