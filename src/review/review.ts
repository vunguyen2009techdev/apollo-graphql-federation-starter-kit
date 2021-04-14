import { ApolloServer, gql } from "apollo-server";
import { applyMiddleware } from 'graphql-middleware';
import { buildFederatedSchema } from "@apollo/federation";

type TContent = {
  id: string;
};

type TReview = {
  id: string;
  score: number;
  comments: [...string[]];
  content?: {
    [Key in keyof TContent]: TContent[Key];
  };
};

const reviews: TReview[] = [
  { id: "1", score: 7.5, comments: ['Great movie', 'First and unique!'], content: { id: "1" } },
  { id: "2", score: 7.0, comments: ['Amazing!', 'Love this one!'], content: { id: "2" } },
  { id: "3", score: 8.0, comments: ['Childhood memories!', 'Really good!'], content: { id: "5" } },
  { id: "4", score: 7.5, comments: ['Great movie', 'First and unique!'], content: { id: "4" } },
  { id: "5", score: 7.0, comments: ['Amazing!', 'Love this one!'], content: { id: "3" } },
  { id: "6", score: 4.0, comments: ['Horrible!', 'Really badly!'], content: { id: "5" } },
];

async function startApolloServer() {
  const typeDefs = gql`
    type Review {
      id: ID!
      score: Float
      comments: [String]
      content: Content
    }

    extend type Content @key(fields: "id") {
      id: ID! @external
      reviews: [Review]
    }
  `;

  const resolvers = {
    Review: {
      content(review: any) {
        return { __typename: "Content", id: review.content.id };
      }
    },

    Content: {
      reviews(content: any) {
        return reviews.filter((db) => db.content.id === content.id);
      },
    },
  };

  const server = new ApolloServer({
    schema: applyMiddleware(
      buildFederatedSchema([{ typeDefs, resolvers }]),
    ),
    context: ({ req }) => {
      const user: any = req.headers.user;
      return {
        user: JSON.parse(user),
      };
    }
  });

  await new Promise((resolve) => {
    const resultResolve: any = resolve;
    return server.listen({ port: 4002 }, resultResolve);
  });

  console.log(`🚀 Server ready at  http://localhost:4002${server.graphqlPath}`);
}

startApolloServer();
