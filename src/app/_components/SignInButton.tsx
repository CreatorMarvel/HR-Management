"use client";

import { signIn, signOut, useSession } from "next-auth/react";

function SignInButton() {
  const session = useSession();

  async function handleSignIn() {
    await signIn(); // Trigger sign-in
  }

  async function handleSignOut() {
    await signOut(); // Trigger sign-out
  }

  return (
    <div>
      {session.data?.user ? (
        <button
          className="rounded-full border-2 border-slate-700 bg-white/10 px-6 py-2 font-semibold no-underline transition hover:bg-white/20"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      ) : (
        <button
          className="rounded-full border-2 border-slate-700 bg-white/10 px-6 py-2 font-semibold no-underline transition hover:bg-white/20"
          onClick={handleSignIn}
        >
          Sign in
        </button>
      )}
    </div>
  );
}

export default SignInButton;
