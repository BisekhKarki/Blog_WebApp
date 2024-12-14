"use client";
import { EyeIcon, EyeOff } from "lucide-react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<string>("");
  const [publicId, setPublicId] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  const submitUserDetails = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email,
          password,
          picture: profile,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toast.success(data.message);
        router.push("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex  justify-center  mt-10">
      <div className="flex flex-col justify-center py-12  gap-3 border border-gray-300 shadow-lg px-20 rounded-xl ">
        <h1 className="text-4xl font-bold">Register </h1>
        <hr />

        <form
          onSubmit={(e) => {
            submitUserDetails(e);
          }}
        >
          <div className="flex flex-col gap-5 ">
            <div className="flex flex-col gap-2 ">
              <p>Username</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="username"
                className="border border-gray-400 rounded-md px-5 py-2  w-96 outline-gray-500"
              />
            </div>
            <div className="flex flex-col gap-2 ">
              <p>Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                type="email"
                className="border border-gray-400 rounded-md px-5 py-2  w-96 outline-gray-500"
              />
            </div>
            <div className=" relative flex flex-col gap-2 ">
              <p>Password</p>

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                type={visible ? "string" : "password"}
                className="border border-gray-400 rounded-md px-5 py-2  w-96 outline-gray-500"
              />
              <div className="absolute top-10 right-1">
                {visible ? (
                  <EyeIcon
                    className="cursor-pointer"
                    onClick={() => setVisible(!visible)}
                  />
                ) : (
                  <EyeOff
                    onClick={() => setVisible(!visible)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 ">
              <div className="flex gap-5">
                {publicId && (
                  <CldImage
                    src={publicId}
                    alt={publicId}
                    width={"100"}
                    height={"100"}
                  />
                )}
                <CldUploadWidget
                  uploadPreset="blog_profile"
                  onSuccess={({ event, info }) => {
                    if (
                      event === "success" &&
                      typeof info != "string" &&
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
                      className=" mt-3 bg-none border border-gray-400 p-2 text-md rounded-md hover:bg-black hover:text-white hover:border-black transition-all delay-100 ease-in-out"
                      onClick={() => open()}
                    >
                      Upload Profile Picture
                    </button>
                  )}
                </CldUploadWidget>
              </div>
            </div>
          </div>
          <div>
            <p>
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="underline text-blue-500 cursor-pointer"
              >
                Login
              </span>
            </p>

            <button
              type="submit"
              className=" w-full mt-3 bg-none border border-gray-400 p-2 text-md rounded-md hover:bg-black hover:text-white hover:border-black transition-all delay-100 ease-in-out"
            >
              {loading ? (
                <span className="animate-spin border-2 border-t-2 border-black border-t-transparent rounded-full w-10 h-4"></span>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
