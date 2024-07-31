import { Link } from "@remix-run/react";
import { Separator } from "~/components/ui/separator";

type FooterProp = {
  author: string;
  projectLink: string;
};

export default function Footer({ author, projectLink }: FooterProp) {
  return (
    <footer>
      <Separator></Separator>
      <div className="h-20 flex items-center">
        <p className="container py-4">
          &copy; Built by{" "}
          <Link className="hover:underline" to={author}>
            ppvan
          </Link>
          . The source code is available on{" "}
          <Link className="hover:underline" to={projectLink}>
            GitHub
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
