// @ts-check
const { Keystone } = require("@keystonejs/keystone");
const { PasswordAuthStrategy } = require("@keystonejs/auth-password");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { NextApp } = require("@keystonejs/app-next");
const initialiseData = require("./initial-data");

const { User, Comment, Rating, Video } = require("./schema");

const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");

const PROJECT_NAME = "Auslan Community";
const adapterConfig = { mongoUri: "mongodb://localhost:27017/keystone" };

const keystone = new Keystone({
  name: "App",
  adapter: new Adapter(adapterConfig),
  onConnect: initialiseData,
});

keystone.createList("User", User);
keystone.createList("Video", Video);
keystone.createList("Comment", Comment);
keystone.createList("Rating", Rating);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: "User",
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      authStrategy,
    }),
    new NextApp({ dir: "app" }),
  ],
};
