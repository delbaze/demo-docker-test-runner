import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import datasource from "./lib/datasource";
import UserResolver from "./resolvers/User.resolver";

import "reflect-metadata";
const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: false,
  });

  const server = new ApolloServer({ schema });
  const { url } = await server.listen(process.env.PORT || 5000);
  await datasource.initialize();
  console.log(`Le serveur est lancé, Apollo server disponible sur : ${url}`);
};
main();
