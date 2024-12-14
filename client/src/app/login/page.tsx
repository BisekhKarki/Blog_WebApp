"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { EyeIcon, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

const page = () => {
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const submitUserDetails = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        localStorage.setItem("Token", data.token);
        router.push("/");
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
    <div className="flex items-center justify-center relative">
      <div className=" absolute top-20  flex flex-col justify-center py-32  gap-5 border border-gray-300 shadow-lg px-20 rounded-xl h-[500px]">
        <h1 className="text-4xl font-bold">Login</h1>
        <form onSubmit={(e) => submitUserDetails(e)}>
          <div className="flex flex-col gap-5 ">
            <div className="flex flex-col gap-2 ">
              <p>Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                className="border border-gray-400 rounded-md px-5 py-2  w-96 outline-gray-500"
              />
            </div>
            <div className="flex flex-col gap-2 relative">
              <p>Password</p>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={visible ? "string" : "password"}
                placeholder="password"
                className="border border-gray-400 rounded-md px-5 py-2  w-96 outline-gray-500"
              />
              <div className="absolute top-10 right-1 ">
                {visible ? (
                  <EyeIcon
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setVisible(!visible)}
                  />
                ) : (
                  <EyeOff
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => router.push("/Signup")}
                className="underline text-blue-500 cursor-pointer"
              >
                Register
              </span>
            </p>
            <button
              type="submit"
              className=" w-full mt-3 bg-none border border-gray-400 p-2 text-md rounded-md hover:bg-black hover:text-white hover:border-black transition-all delay-100 ease-in-out"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
