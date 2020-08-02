import { StarIcon } from "components/icons/Star";
import clsx from "clsx";

export const Stars = ({ className, rating, max = 5 }) => {
  const rounded = Math.round(rating);

  const stars = Array(max)
    .fill(0)
    .map((_, i) => i + 1);

  return (
    <div className={clsx("text-yellow-400 flex space-x-1", className)}>
      {stars.map((i) => (
        <StarIcon
          key={i}
          className={clsx(
            "h-5 w-5 fill-current",
            i > rounded && "text-gray-400"
          )}
        />
      ))}
    </div>
  );
};

export const StarInput = ({
  className,
  onChange,
  onBlur,
  value,
  max = 5,
  name,
}) => {
  const stars = Array(max)
    .fill(0)
    .map((_, i) => i + 1);

  const checkboxId = (i) => `cstar-${name}-${i}`;

  return (
    <div className={clsx("text-yellow-400 flex space-x-1", className)}>
      {stars.map((i) => (
        <label key={i} className="cursor-pointer" htmlFor={checkboxId(i)}>
          <input
            type="checkbox"
            id={checkboxId(i)}
            value={i}
            className="appearance-none hidden"
            onChange={() => onChange(i)}
          />
          <StarIcon
            className={clsx(
              "h-5 w-5 fill-current",
              (i > value || !value) && "text-gray-400"
            )}
          />
          <span className="sr-only">{i} Stars</span>
        </label>
      ))}
    </div>
  );
};
