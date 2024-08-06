import {
  Permission,
  Role,
  roleCreateFn,
  roleDeleteFn,
  roleListFn,
  roleUpdateFn,
} from "@/api/user";
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
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
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
import MultipleSelector from "@/components/ui/multi-select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

const OPTIONS = [
  { label: "view", value: "view" },
  { label: "edit", value: "edit" },
  { label: "delete", value: "delete" },
];
const optionSchema = z.object({
  label: z.enum(["view", "edit", "delete"]),
  value: z.enum(["view", "edit", "delete"]),
});

const schema = z.object({
  id: z.number(),
  label: z
    .string()
    .min(2, { message: "Too short for a label" })
    .max(50, { message: "You have to use label this long?" }),
  permissions: z.array(optionSchema).min(1),
});

export default function RolePage() {
  const [action, setAction] = useState<"idle" | "update" | "delete" | "create">(
    "idle"
  );

  const [targetRole, setTargetRole] = useState<Role | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: "",
      permissions: [{ label: "view", value: "view" }],
    },
  });

  const onCreateRole = (values: z.infer<typeof schema>) => {
    const payload = {
      label: values.label,
      permissions: values.permissions.map((item) => item.value),
    };
    createMutation.mutate(payload);
    setAction("idle");
  };
  const onUpdateRole = (values: z.infer<typeof schema>) => {
    const payload = {
      id: values.id ?? 0,
      label: values.label,
      permissions: values.permissions.map((item) => item.value),
    };
    updateMutation.mutate(payload);
    setAction("idle");
  };
  const onDeleteRole = (role: Role | null) => {
    if (role) {
      deleteMutation.mutate(role);
    }
  };

  const queryClient = useQueryClient();
  const { isPending, data: roles } = useQuery({
    queryFn: roleListFn,
    queryKey: ["roles"],
  });

  const createMutation = useMutation({
    mutationFn: roleCreateFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });
  const updateMutation = useMutation({
    mutationFn: roleUpdateFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: roleDeleteFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  if (isPending) {
    return <p>Loading....</p>;
  }

  if (!roles) {
    return <p>Data not available....</p>;
  }

  return (
    <div className="flex flex-col p-4 gap-4 mt-10">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Role Management
      </h2>
      <p className="text-sm text-muted-foreground">
        System role and access control management
      </p>
      <div>
        <Dialog
          open={action === "create"}
          onOpenChange={(open) => setAction(open ? "create" : "idle")}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription className="flex justify-between items-center">
                <p>Greate power comes with great responsibility</p>
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onCreateRole)}
                className="space-y-8 flex flex-col"
              >
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Some remark" {...field} />
                      </FormControl>
                      <FormDescription>Act as a role name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          defaultOptions={OPTIONS}
                          badgeClassName="bg-opacity-50 font-light border rounded-xl p-1 px-2 mx-1 text-primary bg-slate-200 cursor-default"
                          {...field}
                        ></MultipleSelector>
                      </FormControl>
                      <FormDescription>
                        Great power comes with great responsibility
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{"Create"}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={action === "update"}
          onOpenChange={(open) => setAction(open ? "update" : "idle")}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription className="flex justify-between items-center">
                <p>Greate power comes with great responsibility</p>
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onUpdateRole)}
                className="space-y-8 flex flex-col"
              >
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Some remark" {...field} />
                      </FormControl>
                      <FormDescription>Act as a role name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          defaultOptions={OPTIONS}
                          badgeClassName="bg-opacity-50 font-light border rounded-xl p-1 px-2 mx-1 text-primary bg-slate-200 cursor-default"
                          {...field}
                        ></MultipleSelector>
                      </FormControl>
                      <FormDescription>
                        Great power comes with great responsibility
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{"Update"}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setAction("create");
            form.reset();
          }}
        >
          <Plus></Plus>
          <span className="ml-1">New Role</span>
        </Button>

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
              <AlertDialogAction onClick={() => onDeleteRole(targetRole)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Table className="mt-10">
        <TableCaption>A list of system roles.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">ID</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Permissons</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles?.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="text-right">{role.id}</TableCell>
              <TableCell className="font-medium">{role.label}</TableCell>
              <TableCell>{role.permissions.map(renderPermission)}</TableCell>
              <TableCell className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setAction("update");
                    setTargetRole(role);
                    form.setValue("id", role.id);
                    form.setValue("label", role.label);
                    form.setValue(
                      "permissions",
                      role.permissions.map((per) => {
                        return { label: per, value: per };
                      })
                    );
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setAction("delete");
                    setTargetRole(role);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function renderPermission(per: Permission) {
  let colorCSS = "";
  switch (per) {
    case "view":
      colorCSS = "text-green-700 border-green-700 bg-green-400";
      break;
    case "edit":
      colorCSS = "text-yellow-700 border-yellow-700 bg-yellow-400";
      break;
    case "delete":
      colorCSS = "text-red-700 border-red-700 bg-red-400";
      break;
  }

  return (
    <span
      className={twMerge(
        "bg-opacity-50 border rounded-xl p-1 px-2 mx-1",
        colorCSS
      )}
    >
      {per}
    </span>
  );
}
