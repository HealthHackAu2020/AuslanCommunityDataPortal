export const ALink = ({ className, children, ...props }) => {
  return (
    <a
      tabIndex="0"
      className={`cursor-pointer text-gray-700 outline-none border-none hover:underline focus:underline border-black ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};
