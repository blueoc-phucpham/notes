import { useAuth } from "@/hooks/user";

export default function Profile() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h3>Protected Page</h3>
      <p>Welcome, {isAuthenticated ? "ppvan" : "no one"}!</p>
    </div>
  );
}
