import {
  createNoteFn,
  deleteNoteFn,
  getNotesFn,
  Note,
  updateNoteFn,
} from "@/api/notes";
import NoteCard from "@/components/mine/Note";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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

  const createMutation = useMutation({
    mutationFn: createNoteFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateNoteFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteNoteFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
  const noteForm = useForm<NoteValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: 0,
      title: "",
      content: "",
    },
  });

  const [action, setAction] = useState<"idle" | "update" | "delete" | "create">(
    "idle"
  );
  const [targetNote, setTargetNote] = useState<Note | null>(null);

  const onUpdateFormSubmit = (values: NoteValues) => {
    updateMutation.mutate(values);
    noteForm.reset();
    setAction("idle");
  };

  const onCreateFormSubmit = (values: NoteValues) => {
    createMutation.mutate(values);
    setAction("idle");
    noteForm.reset();
  };

  const onDeleteConfirmed = () => {
    if (targetNote) {
      deleteMutation.mutate(targetNote.id);
    }
    setAction("idle");
  };

  const onCardClick = (note: Note) => {
    setTargetNote(note);
    noteForm.setValue("id", note.id);
    noteForm.setValue("title", note.title ?? "");
    noteForm.setValue("content", note.content ?? "");
    setAction("update");
  };

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="p-4 flex flex-col gap-4 mt-10">
      <div className="flex justify-end">
        <Dialog
          open={action === "create"}
          onOpenChange={(open) => setAction(open ? "create" : "idle")}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => noteForm.reset()}
              className="h-12 flex gap-3"
              variant="default"
            >
              <Plus size={24} /> <span>Add New Note</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create Note</DialogTitle>
            <DialogDescription className="flex justify-between items-center">
              <p>Write down your new idea</p>
            </DialogDescription>
            <Form {...noteForm}>
              <form
                onSubmit={noteForm.handleSubmit(onCreateFormSubmit)}
                className="space-y-8 flex flex-col"
              >
                <FormField
                  control={noteForm.control}
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
                  control={noteForm.control}
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
                <Button type="submit">
                  {updateMutation.isPending ? "Creating ..." : "Create"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <ResponsiveMasonry>
        <Masonry gutter="1.5rem">
          {data.map((note) => (
            <ContextMenu>
              <ContextMenuTrigger>
                <NoteCard
                  key={note.id}
                  {...note}
                  onClick={onCardClick}
                ></NoteCard>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>Share</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onSelect={() => {
                    setTargetNote(note);
                    setAction("delete");
                  }}
                >
                  <strong className="text-red-400">Delete</strong>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </Masonry>
      </ResponsiveMasonry>

      <Dialog
        open={action === "update"}
        onOpenChange={(open) => setAction(open ? "update" : "idle")}
      >
        <DialogContent>
          <DialogTitle>Update Note</DialogTitle>
          <DialogDescription className="flex justify-between items-center">
            <p>Edits your exisiting note</p>
            <Button variant={"destructive"} onClick={() => setAction("delete")}>
              Delete
            </Button>
          </DialogDescription>
          <Form {...noteForm}>
            <form
              onSubmit={noteForm.handleSubmit(onUpdateFormSubmit)}
              className="space-y-8 flex flex-col"
            >
              <FormField
                control={noteForm.control}
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
                control={noteForm.control}
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
              <Button type="submit">
                {updateMutation.isPending ? "Updating ..." : "Update"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={action === "delete"}
        onOpenChange={(open) => setAction(open ? "delete" : "idle")}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteConfirmed}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
