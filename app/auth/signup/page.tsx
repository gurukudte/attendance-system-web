"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { SignupSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import signup from "@/actions/signup";
import Socials from "../Socials";

function SignUp() {
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignupSchema>) => {
    setSuccess("");
    setError("");
    startTransition(() => {
      signup(values).then((data) => {
        setSuccess(data.success);
        setError(data.error);
        console.log(data.user);
      });
    });
  };
  return (
    <div className="h-full flex bg-[#2c2638]">
      <div className="w-1/2"></div>
      <div className="w-1/2 flex justify-center items-center">
        <div className="  p-14 flex flex-col gap-4">
          <h1 className="text-white scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl">
            Create an account
          </h1>
          <div className="flex gap-2 items-center">
            <p className="text-[#746E80] font-bold leading-7 [&:not(:first-child)]:mt-6">
              Please enter your details below
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Name"
                        className="text-white"
                      />
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
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Email"
                        type="email"
                        className="text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="password"
                        type="password"
                        className="text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div className="text-white flex space-x-2 justify-end items-end">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Forgot password?
                </label>
              </div> */}
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button type="submit" disabled={isPending} className="w-full">
                Create account
              </Button>
            </form>
            <div className="flex flex-col gap-4">
              <div>
                <Separator />
              </div>
              <Socials isPending={isPending} />
              <div className="flex gap-2 ju items-center">
                <p className="text-[#746E80] font-bold leading-7 [&:not(:first-child)]:mt-6">
                  Already have an account?
                </p>
                <a href="/login" rel="noopener noreferrer">
                  Login
                </a>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
