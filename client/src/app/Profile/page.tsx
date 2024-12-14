"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import user from "@/assets/User.avif";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const page = () => {
  const [tokenId, setTokenId] = useState<string>("");
  const router = useRouter();
  const [userDetail, setUserDetail] = useState<[] | any>([]);

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token) {
      const parsedToken = JSON.parse(atob(token.split(".")[1] as string));
      if (parsedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("Token");
        router.push("/login");
      } else {
        console.log(parsedToken);
        setTokenId(parsedToken.id);
      }
    }
  }, []);

  const getUserById = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/user/get/${tokenId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUserDetail(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };
  useEffect(() => {
    if (tokenId) {
      getUserById();
    }
  }, [tokenId]);
  console.log(tokenId);
  console.log(userDetail);

  return (
    <div className="flex justify-center py-5">
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">My Profile</h1>
          <Button className="bg-red-500 mt-2" onClick={() => router.push("/")}>
            Back
          </Button>
        </div>
        {userDetail && (
          <div className="mt-2 flex flex-col gap-2">
            <Image
              src={userDetail.picture || user}
              alt="User"
              width={400}
              height={400}
              className="rounded-2xl"
            />
            <p>Name: {userDetail?.username}</p>
            <p>Email: {userDetail?.email}</p>
          </div>
        )}
        <div>
          <Button
            className="bg-red-500 mt-2"
            onClick={() => router.push(`Profile/${userDetail._id}`)}
          >
            Edit
          </Button>
          <Button
            className="ml-2"
            onClick={() => router.push(`Profile/password/${userDetail._id}`)}
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
