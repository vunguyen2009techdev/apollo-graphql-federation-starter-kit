require("dotenv").config();
import { ApolloServer, ApolloError, gql } from "apollo-server";
import { applyMiddleware } from 'graphql-middleware';
import { buildFederatedSchema } from "@apollo/federation";
import { addResolversToSchema } from "apollo-graphql";
import { sign } from "jsonwebtoken";
import permissions from './permissions';

const { ACCESS_TOKEN_SECRET } = process.env;

enum Role {
  admin,
  subscriber,
}

enum Permission {
  readAny = "read:any_account",
  readOwn = "read:own_account",
}

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: [...KeyRole[]];
  permissions: [...Permission[]];
};

type KeyRole = keyof typeof Role;

const users: User[] = [
  { id:"12345", name:"Alice", email:"alice@email.com", password:"alicepAsSWoRd!", roles:["admin"], permissions:[Permission.readAny, Permission.readOwn] },
  { id:"67890", name:"Bob", email:"bob@email.com", password:"bobpAsSWoRd!", roles:["subscriber"], permissions:[Permission.readOwn] },
  { id:"08796", name:"mine", email:"mine@email.com", password:"minepAsSWoRd!", roles:["admin"], permissions:[Permission.readAny, Permission.readOwn] },
  { id:"56876", name:"jolie", email:"jolie@email.com", password:"joliepAsSWoRd!", roles:["subscriber"], permissions:[Permission.readOwn] },
  { id:"34256", name:"tommy", email:"tommy@email.com", password:"tommypAsSWoRd!", roles:["subscriber"], permissions:[Permission.readOwn] }
];

const createAccessToken = ({
  id,
  permissions,
  roles,
}: {
  id: string;
  permissions: [...Permission[]];
  roles: [...KeyRole[]];
}) => {
  let keyPermissions = permissions.map((permission) => {
    for (const [key, value] of Object.entries(Permission)) {
      if (permission === value) {
        return key;
      }
    }
  });

  return sign(
    {
      permissions: keyPermissions,
      roles,
    },
    ACCESS_TOKEN_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "1d",
      // expiresIn: 300,
      subject: id,
    }
  );
};

async function startApolloServer() {
  const typeDefs = gql`
    enum Permission {
      readAny
      readOwn
    }

    enum Role {
      admin
      subscriber
    }

    extend type Query {
      me: User
      user(id: ID!): User
      users: [User]
    }

    extend type Mutation {
      login(email: String!, password: String!): LoginPayload
    }

    type User @key(fields: "id") {
      id: ID!
      name: String
      email: String
      roles: [Role]
      permissions: [Permission]
    }

    type LoginPayload {
      name: String
      email: String
      permissions: [Permission]
      access_token: String
    }
  `;

  const resolvers = {
    Permission: {
      readAny: Permission.readAny,
      readOwn: Permission.readOwn,
    },

    Query: {
      me: async (_: any, __: any, { user }: { user: any }) => {
        return users.find(item => item?.id === user?.sub);
      },

      user: async (_: any, args: any) => {
        const { id } = args;
        const findUser = users.find(user => user.id === id);
        return findUser;
      },

      users: async () => {
        return users;
      },
    },

    Mutation: {
      login: async (_: any, { email = null, password = null }) => {
        try {
          const { id, name, email: resEmail, permissions, roles } = users.find(
            (user) => {
              if (user.email === email && user.password === password) {
                return user;
              }
            }
          );

          return {
            name,
            email: resEmail,
            permissions,
            access_token: createAccessToken({ id, permissions, roles }),
          };
        } catch (error) {
          throw new ApolloError("Login failed", "ERR0001");
        }
      },
    },
  };

  const rawSchema = await buildFederatedSchema({
    resolvers,
    typeDefs,
  });

  const referenceResolvers = {
    User: {
      __resolveReference(user: any) {
        console.log("__resolveReference User: ", user);
        return users.find((u) => u.id === user.id);
      },
    },
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
        user: JSON.parse(user),
      };
    }
  });

  await new Promise(resolve => {
    const resultResolve: any = resolve;
    return server.listen({ port: 4003 }, resultResolve);
  });
  console.log(`🚀 Server ready at  http://localhost:4003${server.graphqlPath}`);
}

startApolloServer();
