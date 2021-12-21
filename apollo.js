import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const token = "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";

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Token ${token}` : null,
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(
    new HttpLink({ uri: "https://api.github.com/graphql" })
  ),
  cache: new InMemoryCache(),
});
