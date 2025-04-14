import Link from "next/link";
import SignupForm from "../SignupForm";
import SocialLogins from "../SocialLogins";

export default function SignupPage() {
  return (
    <>
      <SignupForm />
      <SocialLogins />
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Log in
        </Link>
      </div>
    </>
  );
}
