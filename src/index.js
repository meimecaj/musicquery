import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App/App";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3000",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App client={client} />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);
