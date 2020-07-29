import Head from "next/head";
import { SignHello } from "components/icons/SignHello";
import { TextInput } from "components/TextInput";
import { Button } from "components/Button";
import { Link } from "components/Link";

export default function SignUp() {
  return (
    <>
      <Head>
        <title>Sign Up | Auslan Community Portal</title>
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
            <TextInput name="email" placeholder="Email address" />
            <TextInput name="name" placeholder="Full name" />
            <TextInput name="password" type="password" placeholder="Password" />
            <TextInput
              name="password_repeat"
              type="password"
              placeholder="Repeat password"
            />
            <Button className="w-full">Register</Button>
            <Link href="/login">Got an account? Log in!</Link>
          </div>
        </div>
      </div>
    </>
  );
}
