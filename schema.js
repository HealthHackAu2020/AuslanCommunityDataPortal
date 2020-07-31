// @ts-check
require("dotenv").config();
const { v4: uuid } = require("uuid");
const {
  File,
  Checkbox,
  DateTime,
  Integer,
  Password,
  Relationship,
  Select,
  Text,
} = require("@keystonejs/fields");

const { LocalFileAdapter } = require("@keystonejs/file-adapters");
const { Wysiwyg } = require("@keystonejs/fields-wysiwyg-tinymce");

// const isDev = process.env.NODE_ENV !== "production";

const fileAdapter = new LocalFileAdapter({
  src: "./app/public/uploads",
  path: "/uploads",
});

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: user.id };
};

const userIsAdminOrOwner = (auth) => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };

// Read: public / Write: admin
const DEFAULT_LIST_ACCESS = {
  read: access.userIsAdminOrOwner,
  update: access.userIsAdminOrOwner,
  create: access.userIsAdmin,
  delete: access.userIsAdmin,
};

exports.User = {
  // List-level access controls
  access: {
    ...DEFAULT_LIST_ACCESS,
    create: true,
    auth: true,
  },
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: {
      type: Checkbox,
      // Field-level access controls
      // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
      access: {
        create: access.userIsAdmin,
        update: access.userIsAdmin,
      },
    },
    twitterHandle: { type: Text },
    image: { type: File, adapter: fileAdapter },
    profile: { type: Wysiwyg },
    password: {
      type: Password,
    },
    videos: { type: Relationship, ref: "Video.user", many: true },
    comments: { type: Relationship, ref: "Comment.user", many: true },
    ratings: { type: Relationship, ref: "Rating.user", many: true },
  },
};

exports.Video = {
  access: DEFAULT_LIST_ACCESS,
  fields: {
    translation: { type: Text },
    handshapes: {
      type: Select,
      options: "flat, bent_flat, point, hook, five, clawed_five",
    },
    user: { type: Relationship, ref: "User.videos" },
    dialect: { type: Select, options: "one, two" },
    visibility: { type: Select, options: "private, public" },
    allowMlResearch: { type: Checkbox, defaultValue: true },
    startLocation: { type: Text },
    endLocation: { type: Text },
    movement: { type: Text },
    comments: { type: Relationship, ref: "Comment.video", many: true },
    ratings: { type: Relationship, ref: "Rating.video", many: true },
    file: { type: File, adapter: fileAdapter },
  },
};

exports.Comment = {
  access: DEFAULT_LIST_ACCESS,
  fields: {
    text: { type: Text, isRequired: true },
    user: { type: Relationship, ref: "User.comments" },
    video: { type: Relationship, ref: "Video.comments" },
  },
};

const ratingOptions = [
  { value: 1, label: "One" },
  { value: 2, label: "Two" },
  { value: 3, label: "Three" },
  { value: 4, label: "Four" },
  { value: 5, label: "Five" },
];
exports.Rating = {
  access: DEFAULT_LIST_ACCESS,
  fields: {
    value: {
      type: Select,
      options: ratingOptions,
      dataType: "integer",
      isRequired: true,
    },
    user: { type: Relationship, ref: "User.ratings" },
    video: { type: Relationship, ref: "Video.ratings" },
  },
};
