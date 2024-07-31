import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { Textarea } from "~/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "~/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Separator } from "~/components/ui/separator";
import {
  CountdownTimerIcon,
  Pencil2Icon,
  Share1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";

export default function NoteList() {
  const notes = [
    {
      title: "Grocery List",
      content: "Milk, eggs, bread, apples, chicken, pasta",
    },
    {
      title: "Meeting Agenda",
      content:
        "1. Project updates 2. Budget review 3. Team concerns 4. Next steps",
    },
    {
      title: "Book Recommendations",
      content:
        "1984 by George Orwell, To Kill a Mockingbird by Harper Lee, The Great Gatsby by F. Scott Fitzgerald",
    },
    {
      title: "Workout Plan",
      content:
        "Monday: Cardio, Tuesday: Upper body, Wednesday: Rest, Thursday: Lower body, Friday: Full body, Weekend: Yoga",
    },
    {
      title: "Gift Ideas",
      content:
        "Mom: Scarf, Dad: Grilling set, Sister: Cookbook, Brother: Headphones",
    },
    {
      title: "Travel Packing List",
      content: "Passport, chargers, toiletries, clothes, camera, first-aid kit",
    },
    {
      title: "Recipe: Chocolate Chip Cookies",
      content:
        "Ingredients: flour, sugar, butter, eggs, chocolate chips. Mix dry ingredients, cream butter and sugar, combine all, bake at 350°F for 10-12 minutes.",
    },
    {
      title: "Home Improvement Tasks",
      content:
        "Paint living room, fix leaky faucet, clean gutters, organize garage",
    },
    {
      title: "Language Learning Goals",
      content:
        "Learn 10 new words per week, practice speaking for 30 minutes daily, watch one foreign film per month",
    },
    {
      title: "Project Deadlines",
      content:
        "Research: June 15, First Draft: July 1, Revisions: July 15, Final Submission: August 1",
    },
  ];

  return (
    <div className="flex flex-col gap-2 items-center py-6">
      {notes.map((item) => (
        <Note {...item}></Note>
      ))}
    </div>
  );
}

const FormSchema = z.object({
  title: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  content: z
    .string()
    .min(10, {
      message: "Content must be at least 10 characters.",
    })
    .max(160, {
      message: "Content must not be longer than 30 characters.",
    }),
});

function Note(note: { title: string; content: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="w-1/2 cursor-pointer hover:bg-slate-50">
          <CardHeader>
            <CardTitle>{note.title}</CardTitle>
          </CardHeader>
          <CardContent className="min-h-32">
            <p>{note.content}</p>
          </CardContent>
          <Separator></Separator>
          <CardFooter className="p-4">
            <div className="flex gap-2 justify-end w-full">
              <Button variant="outline" size="icon">
                <CountdownTimerIcon></CountdownTimerIcon>
              </Button>
              <Button variant="outline" size="icon">
                <Share1Icon></Share1Icon>
              </Button>
              <Button variant="outline" size="icon">
                <Pencil2Icon></Pencil2Icon>
              </Button>
              <Button className="hover:bg-red-500" variant="destructive" size="icon">
                <TrashIcon></TrashIcon>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="w-1/2">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>
            Make changes to your note here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-note"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Give some title"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jot down some ideas"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-note">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
