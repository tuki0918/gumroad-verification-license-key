import { LoginButton } from "@/components/AuthButton";
import { auth } from "@/libs/auth/auth";
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
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
