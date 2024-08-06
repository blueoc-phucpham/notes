import { profileFn } from "@/api/user";
import { useAuth } from "@/hooks/user";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { isAuthenticated } = useAuth();
  const { isPending, isError, data } = useQuery({
    queryFn: profileFn,
    queryKey: ["profile"],
  });

  if (isPending) return <p>Loading....</p>;

  if (isError) return <p>Error, please try again</p>;

  return (
    <div>
      <h3>Protected Page</h3>
      <p>Welcome, {isAuthenticated ? "ppvan" : "no one"}!</p>
      <code>{JSON.stringify(data)}</code>
    </div>
  );
}
