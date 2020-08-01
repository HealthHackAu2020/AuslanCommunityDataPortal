// @ts-check
require("dotenv").config();
const { v4: uuid } = require("uuid");
const {
  File,
  Checkbox,
  DateTime,
  Integer,
  CalendarDay,
  Password,
  Relationship,
  Select,
  Text,
  Virtual,
} = require("@keystonejs/fields");
const gql = require("graphql-tag");

const { LocalFileAdapter } = require("@keystonejs/file-adapters");
const { Wysiwyg } = require("@keystonejs/fields-wysiwyg-tinymce");
const {
  AuthedRelationship,
} = require("@keystonejs/fields-authed-relationship");

// const isDev = process.env.NODE_ENV !== "production";

const fileAdapter = new LocalFileAdapter({
  src: "./app/public/uploads",
  path: "/uploads",
});

// Access control functions
const isUser = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }
  return true;
};
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
const userLinkedToItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }
  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { user: { id: user.id } };
};

const userIsAdminOrOwner = (auth) => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};
const userIsAdminOrLinked = (auth) => {
  const isAdmin = access.userIsAdmin(auth);
  const isLinked = access.userLinkedToItem(auth);
  return isAdmin ? isAdmin : isLinked;
};

const access = {
  isUser,
  userIsAdmin,
  userOwnsItem,
  userLinkedToItem,
  userIsAdminOrOwner,
  userIsAdminOrLinked,
};

// Read: public / Write: admin
const DEFAULT_LIST_ACCESS = {
  read: access.isUser,
  update: access.userIsAdminOrLinked,
  create: access.isUser,
  delete: access.userIsAdmin,
};

exports.User = {
  // List-level access controls
  access: {
    ...DEFAULT_LIST_ACCESS,
    update: access.userIsAdminOrOwner,
    create: true,
    auth: true,
  },
  fields: {
    name: {
      type: Text,
      isRequired: true,
    },
    email: {
      type: Text,
      isRequired: true,
      isUnique: true,
    },
    dateOfBirth: {
      type: CalendarDay,
      isRequired: true,
      access: {
        read: access.userIsAdminOrOwner,
      },
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
      isRequired: true,
      access: {
        read: access.userIsAdminOrOwner,
      },
    },
    // videos: { type: Relationship, ref: "Video.user", many: true },
    // comments: { type: Relationship, ref: "Comment.user", many: true },
    // ratings: { type: Relationship, ref: "Rating.user", many: true },
  },
};

const videoRatingsQuery = gql`
  query AllVideoRatings($id: ID!) {
    allRatings(where: { video: { id: $id } }) {
      correctness
      clarity
    }
  }
`;

const calculateAverage = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
exports.Video = {
  access: DEFAULT_LIST_ACCESS,
  fields: {
    user: { type: AuthedRelationship, ref: "User", isRequired: true },
    translation: { type: Text, isRequired: true },
    handshapes: { type: Text },
    movements: { type: Text },
    locations: { type: Text },
    dominantHand: { type: Select, options: "left, right" },
    file: { type: File, adapter: fileAdapter, isRequired: true },
    comments: { type: Relationship, ref: "Comment.video", many: true },
    ratings: { type: Relationship, ref: "Rating.video", many: true },
    averageRatings: {
      type: Virtual,
      graphQLReturnType: "AverageRating",
      extendGraphQLTypes: [
        `type AverageRating { correctness: Float!, clarity: Float! }`,
      ],
      resolver: async (item, args, context) => {
        const { data, error } = await context.executeGraphQL({
          query: videoRatingsQuery,
          variables: { id: item.id },
        });

        if (error) {
          throw error;
        }

        const ratings = data.allRatings;
        const correctnessRatings = ratings.map((r) => r.correctness);
        const clarityRatings = ratings.map((r) => r.clarity);
        const averageCorrectness = calculateAverage(correctnessRatings);
        const averageClarity = calculateAverage(clarityRatings);

        return {
          correctness: averageCorrectness || 0,
          clarity: averageClarity || 0,
        };
      },
    },
  },
};

exports.Comment = {
  access: DEFAULT_LIST_ACCESS,
  fields: {
    text: { type: Text, isRequired: true },
    user: { type: AuthedRelationship, ref: "User", isRequired: true },
    video: { type: Relationship, ref: "Video.comments", isRequired: true },
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
    correctness: {
      type: Select,
      options: ratingOptions,
      dataType: "integer",
      isRequired: true,
    },
    clarity: {
      type: Select,
      options: ratingOptions,
      dataType: "integer",
      isRequired: true,
    },
    user: { type: AuthedRelationship, ref: "User", isRequired: true },
    video: { type: Relationship, ref: "Video.ratings", isRequired: true },
  },
};
