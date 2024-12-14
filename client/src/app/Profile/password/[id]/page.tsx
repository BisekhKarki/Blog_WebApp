"use client";
import React, { useState } from "react";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const formSchema = z.object({
  password: z.string().min(5, "Password must be of minimum 5 characters"),
  confirmPassword: z.string(),
});

const page = () => {
  const { id } = useParams();
  const [show, hide] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Password do not match\n Enter the same password");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:4000/api/user/Password/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: values.password,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    }
    console.log(values);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 mb-5">
      <div className="flex w-3/5  rounded border shadow-md px-5 py-3">
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} type={show ? "text" : "password"} />
                        <div className="absolute top-2 right-2 cursor-pointer">
                          {show ? (
                            <Eye type="button" onClick={() => hide(!show)} />
                          ) : (
                            <EyeOff type="button" onClick={() => hide(!show)} />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} type={show ? "text" : "password"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-red-500 hover:bg-red-600">
                Change
              </Button>
              <Button
                type="button"
                className="bg-white text-black hover:text-white border border-gray-400 ml-3"
                onClick={() => router.push("/Profile")}
              >
                Cancel
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default page;
