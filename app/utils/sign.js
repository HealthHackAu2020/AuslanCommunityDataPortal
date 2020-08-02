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

  { value: "two" },
  { value: "bent_two" },
  { value: "okay" },
  { value: "middle" },
  { value: "irish_k" },
  { value: "three" },
  { value: "which" },
  { value: "eight" },
  { value: "clawed_eight" },
  { value: "mother" },

  { value: "perth" },
  { value: "animal" },
  { value: "four" },
  { value: "nine" },

].map((item) => ({
  value: item.value,
  label: item.value.split("_").join(" "),
}));

export const movements = [
  { value: "up" },
  { value: "down" },
  { value: "up_and_down" },
  { value: "right_or_left" },
  { value: "side_to_side" },
  { value: "away_from_signer" },
  { value: "towards_signers" },
  { value: "to_and_fro" },
  { value: "horizontal_circular" },
  { value: "vertical_circular" },
  { value: "elliptical" },
  { value: "hooking" },
  { value: "flattening" },

  { value: "squeezing" },
  { value: "wiggling" },
  { value: "rubbing" },
  { value: "twisting" },
  { value: "nodding" },
  { value: "pivoting" }


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

  { value: "top_of_head" },
  { value: "cheek" },
  { value: "lower_head" },
  { value: "neck_or_throat" },
  { value: "shoulders" },
  { value: "chest" },
  { value: "abdomen" },
  { value: "hips_or_pelvis_or_groin" },
  { value: "upper_leg" },

  { value: "arm" },
  { value: "upper_arm" },
  { value: "elbow" },
  { value: "lower_arm" },
  { value: "hand" },
  { value: "wrist" },
  { value: "fingers_or_thumb" },
  { value: "palm_of_hand" },
  { value: "back_of_hand" },
  { value: "blades_of_hand" },

].map((item) => ({
  value: item.value,
  label: item.value.split("_").join(" "),
}));
