"use client";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import user from "@/assets/User.avif";
import { useRouter } from "next/navigation";
import Blog from "./Blog";
import AddBlogs from "./AddBlogs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { BiDownArrow } from "react-icons/bi";

const Navbar = () => {
  const router = useRouter();
  const [userImage, setUserImage] = useState<string>("");
  const [userName, setUsername] = useState<string>("");
  const [userDetail, setUserDetail] = useState<[] | any>([]);
  const [userId, setUserId] = useState<string>("");

  const getUserDetail = async () => {
    const token = localStorage.getItem("Token");

    if (!token && token?.length == 0) {
      router.replace("/login");
      return;
    }
    const parsedToken = JSON.parse(atob(token?.split(".")[1] as string));
    if (parsedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("Token");
      router.replace("/login");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:4000/api/user/get/${parsedToken.id}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      setUserImage(data.message.picture);
      setUserDetail(data.message);
      setUserId(parsedToken.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  const logout = () => {
    localStorage.removeItem("Token");
    router.push("/login");
  };

  return (
    <div>
      <div className="flex justify-between px-10 items-center py-2 shadow">
        <p className="font-bold text-3xl">Home</p>
        <input
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Search user"
          className="border border-gray-400 rounded-md px-5 py-1  w-96 outline-gray-500"
        />
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Image
                src={userImage && userImage.length > 0 ? userImage : user}
                alt=""
                className=" cursor-pointer bg-none rounded-full"
                width={50}
                height={50}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup value="a">
                <DropdownMenuRadioItem
                  value="b"
                  onClick={() => router.push("/Profile")}
                >
                  My profile
                </DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                <DropdownMenuRadioItem
                  value="c"
                  onClick={() => router.push("/MyBlogs")}
                >
                  My Blogs
                </DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                <DropdownMenuRadioItem value="d" onClick={logout}>
                  Logout
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <hr />
      <AddBlogs src={userImage} id={userId} />
      <Blog username={userName} />
    </div>
  );
};

export default Navbar;
