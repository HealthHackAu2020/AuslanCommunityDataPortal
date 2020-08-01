import clsx from "clsx";
import { SignHello } from "./icons/SignHello";
import { Button } from "./Button";
import { Link } from "./Link";

export const Navbar = () => {
  return (
    <div className="bg-gray-200">
      <div className="py-2 px-4 mx-auto container flex items-center space-x-2 justify-between">
        <Link href="/">
          <SignHello className="h-8 w-8" />
        </Link>
        <span className="sr-only">Auslan Community</span>
        <Link href="/profile">
          <Button>Profile</Button>
        </Link>
      </div>
    </div>
  );
};
