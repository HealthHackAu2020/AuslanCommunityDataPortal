import clsx from "clsx";
import { SignHello } from "./icons/SignHello";
import { Button } from "./Button";
import Link from "next/link";

import { useAuth } from "providers/auth";
import { LogOutIcon } from "./icons/CaretDown";

export const Navbar = ({ searchCallback }) => {
  const { logoutUser } = useAuth();
  return (
    <div className="bg-gray-200">
      <div className="py-2 px-4 mx-auto container flex items-center space-x-2 justify-between">
        <Link href="/">
          <a className="block p-2 bg-purple-700 border-2 border-purple-700 rounded hover:bg-purple-500 transition-colors duration-100">
            <SignHello className="block h-8 w-8" />
          </a>
        </Link>
        <span className="sr-only">Auslan Community</span>
        <div className="flex items-center space-x-1">
          {searchCallback && <Button onClick={searchCallback}>Search</Button>}
          <Link href="/record">
            <Button>Record</Button>
          </Link>
          <Link href="/profile">
            <Button>Profile</Button>
          </Link>
          <Button onClick={() => logoutUser()}>
            <LogOutIcon className="h-5 w-5" />
            <span className="sr-only">Log Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
