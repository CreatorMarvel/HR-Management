import { auth } from "~/server/auth";
import SignInButton from "./_components/SignInButton";

export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
      <h1 className="mb-4 font-bold text-3xl">Employee Management System</h1>
      {session?.user && (
        <p className="mb-6 text-2xl">Hello {session?.user?.name}</p>
      )}
      <SignInButton />
    </div>
  );
}
