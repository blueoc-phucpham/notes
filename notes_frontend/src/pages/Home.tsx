import { getNotesFn } from "@/api/notes";
import NoteCard from "@/components/mine/Note";
import { useQuery } from "@tanstack/react-query";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function Home() {
  const { isPending, error, data } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotesFn,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="p-4">
      <ResponsiveMasonry>
        <Masonry gutter="1.5rem">
          {data.map((note) => (
            <NoteCard {...note}></NoteCard>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}
