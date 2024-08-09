import { SignUpSchema } from "@/api/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { useSignUpMutation } from "@/hooks/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FieldPath, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z
  .object({
    username: z
      .string()
      .min(2, { message: "username too short" })
      .max(50, { message: "username too long" }),
    email: z.string().email({ message: "invalid email" }),
    password: z.string().min(1, { message: "password can't be blank" }),
    password2: z.string(),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords don't match",
    path: ["password2"], // path of error
  });

type SignUpValues = z.infer<typeof schema>;

export default function SignUp() {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password2: "",
    },
  });
  const { mutation, error } = useSignUpMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (error != null) {
      (Object.keys(error) as Array<keyof SignUpSchema>).forEach((key) => {
        if (Array.isArray(error[key]) && error[key].length > 0) {
          form.setError(key as FieldPath<SignUpSchema>, {
            type: "manual",
            message: error[key][0],
          });
        }
      });
    }
  }, [error, form]);

  function onSubmit(values: SignUpValues) {
    mutation.mutate(values, {
      onSuccess: () => {
        navigate("/check-email/");
      },
    });
  }

  return (
    <div className="min-w-96">
      <Card>
        <CardHeader>
          <CardTitle>
            <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Sign up for Notes
            </p>
          </CardTitle>
          <CardDescription>Let's spread some ideas</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="ppvan" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="ppvan@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The email associated with your account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your account password
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your account password (again)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full mt-8" type="submit">
                {"Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="w-full flex gap-3 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?
            </p>{" "}
            <Link
              className="underline text-muted-foreground hover:text-primary"
              to={"/auth/login"}
            >
              Log In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
