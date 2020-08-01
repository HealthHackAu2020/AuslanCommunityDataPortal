import Head from "next/head";
import { Button } from "components/Button";
import { Select } from "components/Select";
import { SignHello } from "components/icons/SignHello";

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
    { value: "notSure", label: "I'm not sure" },
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

      <div className="mx-auto p-4 container min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center">
          <SignHello className="w-40" />
          <span className="text-xl font-bold">Welcome!</span>
          <span>Your account has been created.</span>
          <span>Let us get to know you a little more:</span>
        </div>

        <div className="w-full">
          {/* Login Form */}
          <div className="my-4 flex flex-col items-center space-y-2">
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
