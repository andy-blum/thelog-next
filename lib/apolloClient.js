import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: `/api/graphql`,
  cache: new InMemoryCache(),
  credentials: "include",
  ssrMode: true,
});

export default client;
