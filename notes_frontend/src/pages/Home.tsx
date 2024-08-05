import { getNotesFn, Note, updateNoteFn } from "@/api/notes";
import NoteCard from "@/components/mine/Note";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Description } from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { z } from "zod";

const schema = z.object({
  id: z.number(),
  title: z.string().min(1, { message: "Note title can't be blank" }),
  content: z.string().min(1, { message: "Note content can't be blank" }),
});

type NoteValues = z.infer<typeof schema>;

export default function Home() {
  const { isPending, error, data } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotesFn,
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateNoteFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
  const noteUpdateForm = useForm<NoteValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: 0,
      title: "",
      content: "",
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = (values: NoteValues) => {
    mutation.mutate(values);
    setIsOpen(false);
  };

  const onCardClick = (note: Note) => {
    noteUpdateForm.setValue("id", note.id);
    noteUpdateForm.setValue("title", note.title ?? "");
    noteUpdateForm.setValue("content", note.content ?? "");
    setIsOpen(true);
  };

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="p-4">
      <ResponsiveMasonry>
        <Masonry gutter="1.5rem">
          {data.map((note) => (
            <NoteCard key={note.id} {...note} onClick={onCardClick}></NoteCard>
          ))}
        </Masonry>
      </ResponsiveMasonry>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>Update Note</DialogTitle>
          <Description>Edits your exisiting note</Description>
          <Form {...noteUpdateForm}>
            <form
              onSubmit={noteUpdateForm.handleSubmit(onSubmit)}
              className="space-y-8 flex flex-col"
            >
              <FormField
                control={noteUpdateForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Note title" {...field} />
                    </FormControl>
                    <FormDescription>Your idea summary</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={noteUpdateForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea rows={12} placeholder="Content" {...field} />
                    </FormControl>
                    <FormDescription>Your idea details</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{mutation.isPending ? "Updating ...": "Update"}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
