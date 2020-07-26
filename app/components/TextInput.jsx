export default ({ className, ...props }) => {
  return (
    <input
      className={`p-4 w-full border rounded-full outline-none focus:shadow-outline ${className}`}
      {...props}
    />
  );
};
