"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import user from "@/assets/User.avif";
import Image from "next/image";

const formSchema = z.object({
  picture: z.string(),
  username: z.string().min(1, "Username must be of minimum 4 characters"),
  email: z.string(),
});

const page = () => {
  const { id } = useParams();
  const [userDetail, setUserDetail] = useState<[] | any>([]);
  const [show, hide] = useState<boolean>(false);
  const [publicId, setPublicId] = useState<string>("");
  const [profile, setProfile] = useState<string>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      picture: "",
      username: "",
      email: "",
    },
  });

  const getUserById = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/user/get/${id}`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        form.setValue("picture", data.message?.picture);
        form.setValue("username", data.message?.username);
        form.setValue("email", data.message?.email);

        setUserDetail(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };
  useEffect(() => {
    getUserById();
  }, []);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/user/updateUser/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.username,
            email: values.email,
            picture: profile,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        router.push("/Profile");
      }
    } catch (error: any) {
      toast.error(error);
    }
    console.log(values);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-5 mb-10">
      <h1 className="text-4xl font-bold mb-2">My Profile</h1>
      <div className="flex w-3/5  rounded border shadow-md px-5 py-3">
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {publicId ? (
                <CldImage
                  src={publicId}
                  alt={publicId}
                  width={"500"}
                  height={"500"}
                />
              ) : (
                <Image
                  src={userDetail.picture || user}
                  alt={"user"}
                  width={"500"}
                  height={"500"}
                />
              )}

              <CldUploadWidget
                uploadPreset="blog_profile"
                onSuccess={({ event, info }) => {
                  if (
                    event === "success" &&
                    typeof info !== "string" &&
                    info?.url
                  ) {
                    setPublicId(info.public_id);
                    setProfile(info.url);
                  }
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className=" mt-3 bg-none border border-gray-400 p-2 text-md rounded-md hover:bg-black hover:text-white hover:border-black transition-all delay-100 ease-in-out"
                  >
                    Change Profile Picture
                  </button>
                )}
              </CldUploadWidget>
              <div className="flex flex-row gap-2">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push("/Profile")}
                  className="bg-red-600 hover:bg-red-700"
                >
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
