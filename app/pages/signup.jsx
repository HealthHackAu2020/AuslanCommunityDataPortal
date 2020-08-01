import Head from "next/head";
import { SignHello } from "components/icons/SignHello";
import { TextInput } from "components/TextInput";
import { Link } from "components/Link";
import { Submit } from "components/Button";

import gql from "graphql-tag";
import { useMutation } from "graphql-hooks";
import { useForm } from "react-hook-form";
import { printGraphql } from "utils/gql";
import { useRouter } from "next/router";
import { useAuth } from "providers/auth";
import { PageWrap } from "components/PageWrap";

const createUserMutation = gql`
  mutation SignUpUser(
    $name: String!
    $email: String!
    $password: String!
    $dateOfBirth: String!
  ) {
    createUser(
      data: {
        name: $name
        email: $email
        password: $password
        dateOfBirth: $dateOfBirth
      }
    ) {
      id
    }
  }
`;

const emailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

export default function SignUp() {
  const { register, handleSubmit, errors, setError } = useForm();
  const [createUser] = useMutation(printGraphql(createUserMutation));
  const router = useRouter();
  const { authenticateUser } = useAuth();

  const onSubmit = async (values) => {
    // Validations
    if (!emailRegex.test(values.email)) {
      setError("email", { type: "invalid" });
      return;
    }

    if (values.password !== values.password_repeat) {
      setError("password_repeat", { type: "mismatch" });
      return;
    }

    const { error } = await createUser({
      variables: {
        name: values.name,
        email: values.email,
        password: values.password,
        dateOfBirth: values.dateOfBirth,
      },
    });

    if (error) {
      const errors = error.graphQLErrors.map((e) => e.message);
      errors.forEach((error) => {
        if (error.includes("E11000 duplicate key error collection:")) {
          setError("email", { type: "exists" });
          return;
        }
        if (error.includes("password:minLength:User:password")) {
          setError("password", { type: "minLength" });
          return;
        }
      });
      return;
    }

    // If successful, authenticate user with their username and password
    await authenticateUser(values.email, values.password);
    router.push("/signup/data");
  };

  return (
    <>
      <Head>
        <title>Sign Up | Auslan Community Portal</title>
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
              ref={register({ required: true })}
              name="email"
              placeholder="Email address"
              errors={{
                "This email address in invalid.":
                  errors.email?.type === "invalid",
                "This email address is already registered.":
                  errors.email?.type === "exists",
                "This field is required.": errors.email?.type === "required",
              }}
            />
            <TextInput
              ref={register({ required: true })}
              name="name"
              placeholder="Full name"
              errors={{
                "This field is required.": errors.name?.type === "required",
              }}
            />
            <TextInput
              ref={register({ required: true })}
              name="password"
              type="password"
              placeholder="Password"
              errors={{
                "This field is required.": errors.password?.type === "required",
                "Requires a minumum of 8 characters.":
                  errors.password?.type === "minLength",
              }}
            />
            <TextInput
              ref={register({ required: true })}
              name="password_repeat"
              type="password"
              placeholder="Repeat password"
              errors={{
                "Passwords do not match.":
                  errors.password_repeat?.type === "mismatch",
              }}
            />

            <TextInput
              ref={register({ required: true })}
              name="dateOfBirth"
              type="date"
              placeholder="Date Of Birth"
              showLabel
              errors={{ "This field is required.": errors.dateOfBirth }}
            />
            <Submit className="w-full" value="Register" />
            <Link href="/login">Got an account? Log in!</Link>
          </form>
        </div>
      </PageWrap>
    </>
  );
}
