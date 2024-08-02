import { useAuth } from "@/hooks/auth";

export default function Profile() {
  const auth = useAuth();

  return (
    <div>
      <h3>Protected Page</h3>
      <p>Welcome, {auth?.user?.username}!</p>
      <button onClick={auth.logout}>Logout</button>
    </div>
  );
}
