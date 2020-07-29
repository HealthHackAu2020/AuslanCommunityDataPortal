import NextLink from "next/link";

export const Link = ({ className, children, href, ...props }) => {
  return (
    <NextLink href={href}>
      <a
        tabIndex="0"
        className={`cursor-pointer text-gray-700 outline-none border-none hover:underline focus:underline border-black ${className}`}
        {...props}
      >
        {children}
      </a>
    </NextLink>
  );
};
