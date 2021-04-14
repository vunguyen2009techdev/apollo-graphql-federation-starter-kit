require("dotenv").config();
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
const expressJwt = require("express-jwt");
const waitOn = require("wait-on");

import Person from './test';

const { ACCESS_TOKEN_SECRET } = process.env;

async function startApolloServer() {
  const gateway = new ApolloGateway({
    serviceList: [
      { name: "contents", url: "http://localhost:4001" },
      { name: "reviews", url: "http://localhost:4002" },
      { name: "users", url: "http://localhost:4003" },
    ],
    buildService({ url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }) {
          request.http.headers.set("user", context.user ? JSON.stringify(context.user) : null)
        }
      })
    }
  });

  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    context: async ({ req }: { req: any }) => {
      const user = req.user || null;
      return { user }
    },
  });

  await server.start();

  const app = express();

  app.use(
    expressJwt({
      secret: ACCESS_TOKEN_SECRET,
      algorithms: ["HS256"],
      credentialsRequired: false,
    })
  );

  app.use(function (err: any, _req: any, res: any, _next: any) {
    if (err.name === "UnauthorizedError") {
      res.status(401).send("invalid token...");
    }
  });

  server.applyMiddleware({ app, cors: false });

  await new Promise(resolve => {
    const resultResolve: any = resolve;
    return app.listen({ port: 4200 }, resultResolve);
  })
  console.log(
    `🚀 Server ready and listening at ==> http://localhost:4200${server.graphqlPath}`
  )

  const person = await new Person({
    first: 'AnhVu',
    last: 'Nguyen',
    geo: {
      state: 'NinhThuan Province',
      country: 'VietNam'
    }
  });

  console.log(`Fullname: ${person.fullName} | Location: ${person.location} | Information: ${person.whoAmI()}`);

  return { server, app };
}

async function starting() {
  try {
    await waitOn({
      resources: [
        'tcp:4001',
        'tcp:4002',
        'tcp:4003',
      ]
    });
    await startApolloServer();
  } catch (err) {
    console.log(`Error wait-on: ${err}`);
  }
}

starting();
