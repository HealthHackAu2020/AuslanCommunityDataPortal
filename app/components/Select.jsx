import clsx from "clsx";
import { CaretDown } from "./icons/CaretDown";

export const Select = ({ className, options, children, ...props }) => {
  return (
    <div className={clsx("relative w-full", className)}>
      <select
        className="py-4 px-8 bg-white appearance-none block w-full border rounded-full outline-none focus:shadow-outline"
        {...props}
      >
        {options ? renderChildOptions(options) : children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600">
        <CaretDown className="h-8 w-8" />
      </div>
    </div>
  );
};

// PRIVATE -----------------------------------------------------------------

const renderChildOptions = (options) => {
  return options.map((option) => {
    return (
      <option key={option.value} value={option.value}>
        {option.label || option.value}
      </option>
    );
  });
};
