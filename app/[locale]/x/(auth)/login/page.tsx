import Login from "@/components/Login";
import { auth } from "@/utils/auth/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const isLogin = !!session;

  // If the user is an admin, redirect to the admin page
  if (isLogin) redirect("/x/admin");

  return (
    <main>
      <div>
        <div>
          <Login />
        </div>
      </div>
    </main>
  );
}
