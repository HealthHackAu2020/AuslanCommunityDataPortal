import clsx from "clsx";
export const PageWrap = ({ className, children, noNav, ...props }) => {
  return (
    <div className={clsx(noNav ? "bg-gray-200" : "bg-white")}>
      <div className={clsx("mx-auto container p-4", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
