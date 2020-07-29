import Head from "next/head";
import { Button } from "components/Button";
import { H1 } from "components/Header";
import { Select } from "components/Select";

export default function SignUpData() {
  const levelOfAuslanOptions = [
    { value: "", label: "Select your level of Auslan" },
    { value: "beginner", label: "Beginner" },
    { value: "native", label: "Native" },
  ];
  const mainDialectOptions = [
    { value: "", label: "Select your main dialect" },
    { value: "northern", label: "Northern" },
    { value: "southern", label: "Southern" },
  ];
  const visibilityPermissions = [
    { value: "", label: "Select your sharing preferences" },
    { value: "hidden", label: "Public" },
    { value: "public", label: "Private" },
  ];

  return (
    <>
      <Head>
        <title>Your Preferences | Auslan Community Portal</title>
      </Head>

      <div className="mx-auto container h-screen max-w-md flex flex-col items-center justify-center">
        <div className="w-full">
          {/* Logo and Header */}
          <div className="flex flex-col items-center">
            <H1>Tell us more about you</H1>
          </div>
          {/* Login Form */}
          <div className="my-4 px-4 flex flex-col items-center space-y-2">
            <Select options={levelOfAuslanOptions} />
            <Select options={mainDialectOptions} />
            <Select options={visibilityPermissions} />

            <div className="text-center">
              <Button className="w-full mb-4">Take me to the community</Button>
              <span className="text-sm text-gray-600 font-light">
                Don't worry, you can change your answers later
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
