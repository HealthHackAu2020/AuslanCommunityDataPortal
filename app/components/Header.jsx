import clsx from "clsx";

const baseHeaderClasses = "text-gray-800 font-bold tracking-wide";

export const H1 = ({ className, children, ...props }) => {
  return (
    <h1 className={clsx("text-2xl", baseHeaderClasses, className)} {...props}>
      {children}
    </h1>
  );
};

export const H2 = ({ className, children, ...props }) => {
  return (
    <h2 className={clsx(baseHeaderClasses, className)} {...props}>
      {children}
    </h2>
  );
};

export const H3 = ({ className, children, ...props }) => {
  return (
    <h3 className={clsx(baseHeaderClasses, className)} {...props}>
      {children}
    </h3>
  );
};

export const H4 = ({ className, children, ...props }) => {
  return (
    <h4 className={clsx(baseHeaderClasses, className)} {...props}>
      {children}
    </h4>
  );
};
