import { Note } from "@/api/notes";
import { parseISO, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { truncateText } from "@/lib/utils";

type NoteProp = Note & {
  onClick: (note: Note) => void;
};

export default function NoteCard(note: NoteProp) {
  const date = parseISO(note.created_at);
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });

  return (
    <Card
      className="cursor-pointer hover:bg-muted"
      onClick={() => note.onClick(note)}
    >
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <CardDescription>{relativeTime}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="h-fit">{truncateText(note.content ?? "", 512)}</p>
      </CardContent>
      <CardFooter className="flex justify-end text-muted-foreground underline">
        <p className="hover:text-primary">{note.author.username}</p>
      </CardFooter>
    </Card>
  );
}
