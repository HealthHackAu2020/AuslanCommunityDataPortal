import clsx from "clsx";
import { SignHello } from "./icons/SignHello";
import { Button } from "./Button";
import { Link } from "./Link";

export const Navbar = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        "py-2 px-4 mx-auto container flex items-center space-x-2 justify-between",
        className
      )}
      {...props}
    >
      <SignHello className="h-8 w-8" />
      <span className="sr-only">Auslan Community</span>
      <Link href="/profile">
        <Button>Profile</Button>
      </Link>
    </div>
  );
};
