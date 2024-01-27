import { auth } from "@/auth";
import { LoginButton, LogoutButton } from "@/components/AuthButton";

export default async function Home() {
  const session = await auth();
  const isLogin = !!session;
  return (
    <main>
      <div>
        {isLogin ? (
          <div>
            <h1>Welcome {session?.user?.name}</h1>
            <LogoutButton />
          </div>
        ) : (
          <div>
            <LoginButton />
          </div>
        )}
      </div>
    </main>
  );
}
