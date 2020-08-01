export const handShapes = [
  { value: "flat" },
  { value: "bent_flat" },
  { value: "point" },
  { value: "hook" },
  { value: "five" },
  { value: "clawed_five" },
  { value: "fist" },
  { value: "soon" },
  { value: "good" },
  { value: "spoon" },
  { value: "gun" },
  { value: "c" },
  { value: "write" },
  { value: "eleven" },
  { value: "round" },
  { value: "flat_round" },
  { value: "cup" },
].map((item) => ({
  value: item.value,
  label: item.value.split("_").join(" "),
}));

export const movements = [
  { value: "top" },
  { value: "left" },
  { value: "right" },
  { value: "bottom" },
].map((item) => ({
  value: item.value,
  label: item.value.split("_").join(" "),
}));

export const locations = [
  { value: "in_front_of_body" },
  { value: "in_front_of_face" },
  { value: "head" },
  { value: "eyes" },
  { value: "nose" },
  { value: "ear" },
].map((item) => ({
  value: item.value,
  label: item.value.split("_").join(" "),
}));
