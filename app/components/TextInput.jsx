import React from "react";
import clsx from "clsx";

export const TextInput = React.forwardRef(
  ({ className, errors, placeholder, name, showLabel, ...props }, ref) => {
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
        <label
          htmlFor={name}
          className={clsx("text-left px-4 w-full", !showLabel && "sr-only")}
        >
          {`${placeholder}:`}
        </label>
        <input
          ref={ref}
          name={name}
          id={name}
          className={clsx(
            "p-4 bg-white w-full border rounded-full outline-none focus:shadow-outline",
            { "bg-red-100": renderedError },
            className
          )}
          placeholder={placeholder}
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
