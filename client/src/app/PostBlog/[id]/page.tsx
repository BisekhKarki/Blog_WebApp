"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import user from "@/assets/User.avif";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  text: z.string().min(10, "Enter at least 10 characters"),
  type: z.string(),
});

const page = () => {
  const { id } = useParams();
  const [userDetail, setUser] = useState<[] | any>([]);
  const [userImage, setUserImage] = useState<string>("");
  const [publicId, setPublicId] = useState<string>("");
  const [blogImage, setBlogImage] = useState<string>("");

  const router = useRouter();

  const getUserDetail = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/user/get/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      setUser(data.message);
      setUserImage(data.message.picture);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      type: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("http://localhost:4000/api/blog/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Content: values.text,
          blog_image: blogImage,
          Blog_Type: values.type,
          userId: id,
          username: userDetail?.username,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error);
    }
  };
  let date = new Date();
  let latestDate = date.toLocaleString();

  return (
    <div className="flex items-center justify-center py-10">
      <div className="bg-white border border-gray-300 py-10 px-5 rounded-md shadow cursor-pointer w-3/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={userImage && userImage.length > 0 ? userImage : user}
              alt=""
              width={50}
              height={50}
              className="rounded-full"
            />
            <p>{userDetail?.username}</p>
          </div>
          <p>{latestDate}</p>
        </div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full h-2/5 space-y-6 mt-5 px-5"
            >
              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col ">
                    <FormLabel>Enter Blog Type</FormLabel>
                    <FormControl>
                      <Input
                        className="border rounded py-3 px-2 border-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="text"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What's on your mind</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write something here..."
                        className="resize-none  "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {publicId && (
                <CldImage
                  src={publicId}
                  alt={publicId}
                  width={"500"}
                  height={"500"}
                />
              )}

              <CldUploadWidget
                uploadPreset="user_blog"
                onSuccess={({ event, info }) => {
                  if (
                    event === "success" &&
                    typeof info !== "string" &&
                    info?.url
                  ) {
                    setPublicId(info.public_id);
                    setBlogImage(info.url);
                  }
                }}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()}>
                    <ImageIcon />
                  </button>
                )}
              </CldUploadWidget>

              <div className="flex flex-row gap-2">
                <Button type="submit">Submit</Button>
                <Button type="button" onClick={() => router.push("/")}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default page;
