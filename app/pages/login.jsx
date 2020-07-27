import React from "react";
import Head from "next/head";
import Link from "next/link";
import { SignHello } from "components/icons/SignHello";
import { TextInput } from "components/TextInput";
import { Button } from "components/Button";
import { ALink } from "components/ALink";

export default function Home() {
  return (
    <>
      <Head>
        <title>Login | Auslan Community Portal</title>
      </Head>

      <div className="mx-auto container h-screen max-w-md flex flex-col items-center justify-center">
        <div className="w-full">
          {/* Logo and Header */}
          <div className="flex flex-col items-center">
            <SignHello className="w-40 mb-4" />
            <span className="text-xl font-bold">Auslan Community Portal</span>
          </div>
          {/* Login Form */}
          <div className="my-4 px-4 flex flex-col items-center space-y-2">
            <TextInput name="email" placeholder="Email" />
            <TextInput name="password" type="password" placeholder="Password" />
            <Button className="w-full">Log In</Button>
            <Link href="/signup">
              <ALink>Haven't got an account? Sign up!</ALink>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}