import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CircleAlert } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/auth";

const schema = z.object({
  username: z
    .string()
    .min(2, { message: "username too short" })
    .max(50, { message: "username too long" }),
  password: z.string().min(1, { message: "password can't be blank" }),
});

type LoginValues = z.infer<typeof schema>;

export default function Login() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (values: LoginValues) => {
    login(values.username, values.password);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-w-96">
      <Card>
        <CardHeader>
          <CardTitle>
            <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Login
            </p>
          </CardTitle>
          <CardDescription>Hi, wellcome back</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              {loginError && (
                <Alert variant="destructive" className="mb-4">
                  <CircleAlert className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
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
              <Button className="w-full mt-8" type="submit">
                Log in
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="w-full flex gap-3 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?
            </p>{" "}
            <Link
              className="underline text-muted-foreground hover:text-primary"
              to={"/auth/sign-up"}
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
