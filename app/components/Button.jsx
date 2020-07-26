export default ({ className, color, children, ...props }) => {
  let typeClass = "";
  let textClass = "text-white";
  switch (color) {
    case "primary":
      typeClass = "bg-purple-700";
      break;
    case "secondary":
      typeClass = "bg-yellow-400";
      textClass = "text-black";
      break;
  }
  return (
    <button
      className={`py-4 px-6 border rounded-full outline-none focus:shadow-outline ${textClass} ${typeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
