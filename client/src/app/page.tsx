"use client";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (!token && token?.length === 0) {
      router.replace("/login");
      return;
    }
    try {
      const parsedToken = JSON.parse(atob(token?.split(".")[1] as string));
      console.log(parsedToken);
      if (parsedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("Token");
        router.replace("/login");
        return;
      }
    } catch (error) {
      console.log("Invalid Token", error);
      localStorage.removeItem("Token");
      router.replace("/login");
    }
  }, []);

  return (
    <div>
      <Navbar />
    </div>
  );
}
