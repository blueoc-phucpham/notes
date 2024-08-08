import { MailOpen, MoveRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function CheckEmail() {
  return (
    <div className="flex items-center justify-center flex-col gap-4 h-[calc(100vh-12rem)]">
      <MailOpen size={128} ></MailOpen>
      <h2 className="scroll-m-20 text-3xl font-light tracking-tight">
        Check your email
      </h2>
      <p>We sent you an email. Click on the link in the email to activate your account.</p>
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
