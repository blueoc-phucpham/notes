import { MoveRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] items-center justify-center">
      <div className="flex">
        <p className="m-auto text-[10rem] font-thin">404</p>
      </div>
      <div className="flex flex-col gap-4 p-4 text-center">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The page you looking for doesn't exist. You may have mis-spell url or
          page has been moved
        </p>
        <Link
          className="scroll-m-20 font-medium tracking-tight flex justify-center items-center gap-2 hover:underline"
          to={"/"}
        >
          <MoveRightIcon></MoveRightIcon>
          <span>Go to Home Page</span>
        </Link>
      </div>
    </div>
  );
}
