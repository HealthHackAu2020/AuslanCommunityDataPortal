import clsx from "clsx";
export const PageWrap = ({ className, children, ...props }) => {
  return (
    <div className={clsx("mx-auto container p-4", className)} {...props}>
      {children}
    </div>
  );
};
