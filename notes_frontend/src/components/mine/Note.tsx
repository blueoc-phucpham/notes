import { Note } from "@/api/notes";
import {parseISO, formatDistanceToNow} from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type NoteProp = Note & {
    onClick: (note: Note) => void
};



export default function NoteCard(note: NoteProp) {
  const date = parseISO(note.created_at);
  const relativeTime = formatDistanceToNow(date, { addSuffix: true });

  return (
    <Card className="cursor-pointer hover:bg-muted" onClick={() => note.onClick(note)}>
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <CardDescription>{note.content}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{note.content}</p>
      </CardContent>
      <CardFooter>
        <p>{relativeTime}</p>
      </CardFooter>
    </Card>
  );
}
