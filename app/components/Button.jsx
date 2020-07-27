export const Button = ({ className, color, children, ...props }) => {
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
  return (
    <button
      className={`py-4 px-6 border rounded-full outline-none transition duration-75 focus:shadow-outline ${textClass} ${typeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
