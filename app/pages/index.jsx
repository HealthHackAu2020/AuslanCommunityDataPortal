import React from "react";
import Head from "next/head";
import { useAuth } from "providers/auth";
import { Button } from "components/Button";

export default function Home() {
  const { user, logoutUser } = useAuth();

  return (
    <>
      <Head>
        <title>Auslan Community Portal</title>
      </Head>
      <div className="mx-auto container flex flex-col h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">Home Page</h1>
        <span>User Details:</span>
        <pre className="p-2 bg-white">{JSON.stringify(user, null, 2)}</pre>
        <Button onClick={() => logoutUser()}>Log Out</Button>
      </div>
    </>
  );
}
