import React from "react";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Linking } from "react-native";
import { ApolloProvider, useQuery } from "@apollo/client";
import { apolloClient } from "./apollo";
import gql from "graphql-tag";

// with more time login could be dynamic
const GET_GITHUB_DATA = gql`
  query {
    organization(login: "facebook") {
      email
      description
      repositories(first: 100) {
        nodes {
          name
          forkCount
          description
          url
        }
      }
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  textGap: {
    marginBottom: 5,
  },
});

const RepoCards = () => {
  const { loading, error, data } = useQuery(GET_GITHUB_DATA);
  const [topThreeRepos, setTopThreeRepos] = useState([]);

  useEffect(() => {
    // check if data exists, sort then store in state
    if (data) {
      const sortData = data.organization.repositories.nodes
        .slice()
        .sort((a, b) => b.forkCount - a.forkCount)
        .slice(0, 3);
      setTopThreeRepos(sortData);
    }
  }, [data]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :(</Text>;

  return (
    <View>
      {topThreeRepos.map((repo, index) => (
        <View key={index} style={{ marginTop: 20 }}>
          <Text style={styles.titleText}>{repo.name}</Text>
          <Text style={styles.textGap}>{repo.description}</Text>
          <Text style={styles.textGap}>Fork count: {repo.forkCount}</Text>
          <Text
            style={{ color: "blue" }}
            onPress={() => Linking.openURL(`${repo.url}`)}
          >
            Link
          </Text>
        </View>
      ))}
    </View>
  );
};

const RootComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>
        Meta's top 3 most forked repositories
      </Text>
      {/* could add <Input> field and <Button> so user can query api */}
      <RepoCards />
    </View>
  );
};

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <RootComponent />
    </ApolloProvider>
  );
}
