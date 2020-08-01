import React from "react";
import clsx from "clsx";

export const TextInput = React.forwardRef(
  (
    { className, errors, placeholder, name, id, showLabel, isRect, ...props },
    ref
  ) => {
    // Create errors object
    const renderedError = errors
      ? Object.entries(errors)
          .filter(([_, value]) => value)
          .map(([key, _]) => (
            <FieldErrorText key={key}>{key}</FieldErrorText>
          ))[0]
      : null;

    return (
      <div className="w-full flex flex-col">
        <label
          htmlFor={id ? id : name}
          className={clsx(
            "text-left w-full mb-2",
            !isRect && "px-4",
            !showLabel && "sr-only"
          )}
        >
          {`${placeholder}:`}
        </label>
        <input
          ref={ref}
          name={name}
          id={id ? id : name}
          className={clsx(
            "form-input w-full",
            !isRect && "rounded-full p-4",
            { "bg-red-100": renderedError },
            className
          )}
          placeholder={placeholder}
          {...props}
        />
        <div className="w-full flex justify-center">{renderedError}</div>
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

export const TextArea = React.forwardRef(
  ({ className, errors, placeholder, name, showLabel, ...props }, ref) => {
    const renderedError = errors
      ? Object.entries(errors)
          .filter(([_, value]) => value)
          .map(([key, _]) => (
            <FieldErrorText key={key}>{key}</FieldErrorText>
          ))[0]
      : null;

    return (
      <div className="w-full flex flex-col">
        <label
          htmlFor={name}
          className={clsx("text-left mb-2 w-full", !showLabel && "sr-only")}
        >
          {placeholder}
        </label>
        <textarea
          ref={ref}
          id={name}
          name={name}
          className={clsx(
            "form-textarea bg-gray-200",
            { "bg-red-100": renderedError },
            className
          )}
          placeholder={placeholder}
          cols="30"
          rows="3"
          {...props}
        />
        <div className="w-full flex justify-center">{renderedError}</div>
      </div>
    );
  }
);

export const RadioInput = React.forwardRef(
  ({ className, label, name, value, id, ...props }, ref) => {
    const radioId = id ? id : `${name}-${value}`;
    return (
      <label
        className="cursor-pointer flex items-center space-x-3"
        htmlFor={id}
      >
        <input
          type="radio"
          id={radioId}
          name={name}
          value={value}
          ref={ref}
          className={clsx("form-radio text-purple-700 h-5 w-5", className)}
          {...props}
        />
        <span>{label}</span>
      </label>
    );
  }
);
