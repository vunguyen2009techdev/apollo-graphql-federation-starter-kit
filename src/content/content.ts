import { ApolloServer, gql } from "apollo-server";
import { applyMiddleware } from 'graphql-middleware';
import { buildFederatedSchema } from "@apollo/federation";
import { addResolversToSchema } from "apollo-graphql";
import permissions from './permissions';

type TUser = {
  id: string;
};

type TContent = {
  id: string;
  title: string;
  year: number;
  author: {
    [Key in keyof TUser]: TUser[Key];
  };
};

const contents: Array<TContent> = [
  { id: "1", title: "Batman", year: 1989, author: { id: "12345" } },
  { id: "2", title: "Tom & Jerry", year: 1992, author: { id: "56876" } },
  { id: "3", title: "Looky & Looky", year: 1993, author: { id: "34256" } },
  { id: "4", title: "SpiderMan", year: 1997, author: { id: "08796" } },
  { id: "5", title: "Fast & Furious", year: 2007, author: { id: "67890" } },
  { id: "6", title: "Fast & Furious 2", year: 2013, author: { id: "67890" } },
  { id: "7", title: "Fast & Furious 3, Vinsel", year: 2017, author: { id: "67890" } },
];

async function startApolloServer() {
  const typeDefs = gql`
    extend type Query {
      contents: [Content]
    }

    type Content @key(fields: "id") {
      id: ID!
      title: String
      year: String
      author: User
    }

    extend type User @key(fields: "id") {
      id: ID! @external
    }
  `;

  const resolvers = {
    Query: {
      contents: async (_: any, __: any, { user }: { user: any }) => {
        if (user) {
          const findContents = contents.filter(content => content?.author?.id === user?.sub);
          return findContents;
        }
        return contents;
      },
    },
  };

  const rawSchema = await buildFederatedSchema({
    resolvers,
    typeDefs,
  });

  const referenceResolvers = {
    Content: {
      __resolveReference(content: any) {
        console.log("__resolveReference Content: ", content);
        return contents.find((c) => c.id === content.id);
      },
    }
  };

  const schema = applyMiddleware(
    rawSchema,
    permissions,
  );

  addResolversToSchema(
    schema,
    referenceResolvers
  )

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const user: any = req.headers.user;
      return {
        user: JSON.parse(user)
      };
    }
  });

  await new Promise(resolve => {
    const resultResolve: any = resolve;
    return server.listen({ port: 4001 }, resultResolve);
  });

  console.log(`🚀 Server ready at  http://localhost:4001${server.graphqlPath}`);
}

startApolloServer();
