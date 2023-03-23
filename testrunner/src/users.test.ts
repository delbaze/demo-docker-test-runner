import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client/core";
import fetch from "cross-fetch";


/**
 * La limite ici, du fait d'utiliser le ApolloClient, est que je n'ai pas la maitrise de la 
 * base de données, ça m'empeche par exemple de choisir une base de données en particulier
 * (sauf si on adapte le build de notre docker) mais surtout je ne peux pas demander à réinitialiser 
 * la base de donnée avant chaque test sauf en appelant un resolver dédié pour ça (ce qui n'est pas terrible...)
 */
const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://server:5000",
    fetch,
  }),
  cache: new InMemoryCache(),
});

const LIST_USERS = gql`
  query ListUsers {
    listUsers {
      id
      name
      password
      email
    }
  }
`;
const LIST_USERS_TEST = gql`
  query ListUsers {
    listUsers {
      name
    }
  }
`;

const ADD_USER = gql`
  mutation CreateUser($createInput: CreateInput!) {
    createUser(createInput: $createInput) {
      email
      id
      name
      password
    }
  }
`;

describe("User Resolver", () => {
  it("Users are empty", async () => {
    const res = await client.query({
      query: LIST_USERS,
      fetchPolicy: "no-cache",
    });
    expect(res.data?.listUsers).toEqual([]);
  });

  it("Users contain new user", async () => {
    await client.mutate({
      mutation: ADD_USER,
      variables: {
        createInput: {
          email: "demo@gmail.com",
          name: "demo",
          password: "demo",
        },
      },
    });

    const res = await client.query({
      query: LIST_USERS_TEST,
      fetchPolicy: "no-cache",
    });
    console.log("res", res);

    expect(res.data?.listUsers).toEqual([{ __typename: "User", name: "demo" }]);
  });
});
