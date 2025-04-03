"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import * as React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export interface ISocialsProps {
  isPending: boolean;
}

export default function Socials({ isPending }: ISocialsProps) {
  const onClick = async (provider: "google" | "github") => {
    await signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div className="flex gap-4">
      <Button
        size="icon"
        className="w-full"
        disabled={isPending}
        onClick={() => onClick("google")}
      >
        <FcGoogle />
        Google
      </Button>
      <Button
        size="icon"
        className="w-full"
        disabled={isPending}
        onClick={() => onClick("github")}
      >
        <FaGithub />
        Github
      </Button>
    </div>
  );
}
