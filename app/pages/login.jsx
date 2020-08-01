import React from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { SignHello } from "components/icons/SignHello";
import { TextInput } from "components/TextInput";
import { Submit } from "components/Button";
import { Link } from "components/Link";
import { useAuth } from "providers/auth";
import { PageWrap } from "components/PageWrap";

export default function Login() {
  const { register, handleSubmit, errors, setError } = useForm();
  const { authenticateUser } = useAuth();
  const onSubmit = async ({ email, password }) => {
    try {
      // Call auth hook
      await authenticateUser(email, password);
    } catch (error) {
      setError("password", {
        type: "manual",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Login | Auslan Community Portal</title>
      </Head>

      <PageWrap
        noNav
        className="min-h-screen max-w-md flex flex-col items-center justify-center"
      >
        <div className="w-full">
          {/* Logo and Header */}
          <div className="flex flex-col items-center">
            <SignHello className="w-40 mb-4" />
            <span className="text-xl font-bold">Auslan Community Portal</span>
          </div>
          {/* Login Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="my-4 px-4 flex flex-col items-center space-y-2"
          >
            <TextInput
              name="email"
              placeholder="Email"
              ref={register({ required: true })}
              errors={{ "This field is required": errors.email }}
            />
            <TextInput
              name="password"
              type="password"
              placeholder="Password"
              ref={register({ required: true })}
              errors={{
                "That username and password are invalid":
                  errors.password && errors.password.type === "manual",
                "This field is required": errors.password,
              }}
            />
            <Submit className="w-full" value="Log In" />
            <Link href="/signup">Haven't got an account? Sign up!</Link>
          </form>
        </div>
      </PageWrap>
    </>
  );
}
