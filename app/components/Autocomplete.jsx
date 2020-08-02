import { Controller } from "react-hook-form";
import ReactSelect from "react-select";

export const AutoComplete = ({ control, ...props }) => {
  return <Controller as={<ReactSelect />} control={control} {...props} />;
};
