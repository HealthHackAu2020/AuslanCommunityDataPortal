import React from "react";
import clsx from "clsx";

export const Button = React.forwardRef(
  ({ className, color, children, ...props }, ref) => {
    let { textClass, typeClass } = buttonColorClass(color);
    return (
      <button
        ref={ref}
        className={`py-4 px-6 border cursor-pointer rounded-full outline-none transition duration-75 focus:shadow-outline ${textClass} ${typeClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export const Submit = React.forwardRef(
  ({ className, color, value, loading, ...props }, ref) => {
    let { textClass, typeClass } = buttonColorClass(color);
    return (
      <input
        ref={ref}
        type="submit"
        className={clsx(
          "py-4 px-6 cursor-pointer border rounded-full outline-none transition duration-75 focus:shadow-outline",
          loading && "opacity-75",
          textClass,
          typeClass,
          className
        )}
        value={loading ? "Loading..." : value}
        disabled={loading}
        {...props}
      />
    );
  }
);

const buttonColorClass = (color) => {
  let typeClass = "";
  let textClass = "text-white";
  switch (color) {
    case "secondary":
      typeClass = "bg-yellow-400 hover:bg-yellow-300";
      textClass = "text-black";
      break;
    case "primary":
    default:
      typeClass = "bg-purple-700 hover:bg-purple-800";
  }
  return { textClass, typeClass };
};
