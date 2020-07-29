import React from "react";
import clsx from "clsx";

export const TextInput = React.forwardRef(
  ({ className, errors, ...props }, ref) => {
    // Create errors object
    const renderedError = errors
      ? Object.entries(errors)
          .filter(([_, value]) => value)
          .map(([key, _]) => (
            <FieldErrorText key={key}>{key}</FieldErrorText>
          ))[0]
      : null;

    return (
      <div className="w-full flex flex-col items-center">
        <input
          ref={ref}
          className={clsx(
            "p-4 w-full border rounded-full outline-none focus:shadow-outline",
            { "bg-red-100": renderedError },
            className
          )}
          {...props}
        />
        {renderedError}
      </div>
    );
  }
);

export const FieldErrorText = ({ className, children, ...props }) => {
  return (
    <span {...props} className={clsx("text-red-700 text-sm", className)}>
      {children}
    </span>
  );
};
