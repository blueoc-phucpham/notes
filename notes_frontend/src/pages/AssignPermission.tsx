import { getNotesFn } from "@/api/notes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserCog } from "lucide-react";
("use client");

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { assignRoleFn, roleListFn, userListFn } from "@/api/user";
import { useState } from "react";

const FormSchema = z.object({
  user: z.number({
    required_error: "Please select an user.",
  }),
  role: z.number({
    required_error: "Please select a role.",
  }),
});

type Option = {
  label: string;
  value: number;
};

type RoleAssignFormProp = {
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
  users: Option[];
  roles: Option[];
};

export function RoleAssignForm({ onSubmit, roles, users }: RoleAssignFormProp) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>User</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? users.find((user) => user.value === field.value)
                            ?.label
                        : "Select user"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search username..." />
                    <CommandList>
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            value={user.label}
                            key={user.value}
                            onSelect={() => {
                              form.setValue("user", user.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                user.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>User to grant role</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Role</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? roles.find((user) => user.value === field.value)
                            ?.label
                        : "Select user"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search role..." />
                    <CommandList>
                      <CommandEmpty>No role found.</CommandEmpty>
                      <CommandGroup>
                        {roles.map((role) => (
                          <CommandItem
                            value={role.label}
                            key={role.value}
                            onSelect={() => {
                              form.setValue("role", role.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                role.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {role.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>The role with given permission</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Assign</Button>
        </div>
      </form>
    </Form>
  );
}

export default function AssignPermission() {
  const { isPending, error, data } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotesFn,
  });

  const { isSuccess, data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: roleListFn,
  });

  const { isSuccess: usersReady, data: users } = useQuery({
    queryKey: ["users"],
    queryFn: userListFn,
  });

  const mutation = useMutation({
    mutationFn: assignRoleFn,
  });

  const onSubmit = (payload: { note: number; user: number; role: number }) => {
    mutation.mutate(payload);
    setOpen(false);
  };

  const [isOpen, setOpen] = useState(false);
  const [id, setId] = useState(0);

  if (isPending) return <p>Loading....</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <div className="pt-10 flex flex-col gap-10">
      <div>
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Wellcome, Admin
        </h2>
        <p className="text-base text-muted-foreground">
          Here are all notes in system
        </p>
      </div>
      <div>
        <Table>
          <TableCaption>A list of notes.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((note) => (
              <TableRow key={note.id}>
                <TableCell className="">{note.id}</TableCell>
                <TableCell>{note.author.username}</TableCell>
                <TableCell>{note.title}</TableCell>
                <TableCell className="truncate max-w-96">
                  {note.content}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => {
                      setId(note.id);
                      setOpen(true);
                    }}
                    variant="outline"
                    size="icon"
                  >
                    <UserCog />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Role's permission will be applied to this note only
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            {isSuccess && usersReady && (
              <RoleAssignForm
                onSubmit={(data) => {
                  onSubmit({ ...data, note: id });
                }}
                users={users.map((user) => {
                  return { label: user.username, value: user.id };
                })}
                roles={roles.map((role) => {
                  return { label: role.label, value: role.id };
                })}
              ></RoleAssignForm>
            )}
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
