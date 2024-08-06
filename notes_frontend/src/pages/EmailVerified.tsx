import { verifiedEmailFn } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, MoveRightIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function EmailVerified() {
  const { token } = useParams();

  const { isLoading, isError } = useQuery({
    queryKey: ["email"],
    queryFn: () => {
      return verifiedEmailFn(token ?? "");
    },
    retry: false
  });

    if (isLoading) return <div>Verifying your email...</div>;
    if (isError) return <div>Error verifying email. Please try again.</div>

  return (
    <div className="flex items-center flex-col gap-4">
      <CheckCircle size={128} color="#22c55e"></CheckCircle>
      <h2 className="scroll-m-20 text-3xl font-light tracking-tight">
        Email Verified
      </h2>
      <p>Your email address was successfully verified.</p>
      <Link
        className="scroll-m-20 font-medium tracking-tight flex justify-center items-center gap-2 hover:underline"
        to={"/auth/login"}
      >
        <MoveRightIcon></MoveRightIcon>
        <span>Go to Login Page</span>
      </Link>
    </div>
  );
}
