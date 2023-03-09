/*** APP ***/
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
  useMutation,
} from "@apollo/client";

import { link } from "./link.js";
import { Layout } from "./layout.jsx";
import "./index.css";

const ALL_WIDGETS = gql`
  query AllWidgets {
    widgets {
      id
      name
    }
  }
`;

const ALL_PEOPLE = gql`
  query AllPeople {
    people {
      id
      name
    }
  }
`;

const SINGLE_WIDGET = gql`
  query SingleWidget($id: ID!) {
    widget(id: $id) {
      id
      name
    }
  }
`;

const SINGLE_PERSON = gql`
  query SinglePerson($id: ID!) {
    person(id: $id) {
      id
      name
    }
  }
`;

const WidgetListItem = ({ id }) => {
  const { loading, data, error } = useQuery(SINGLE_WIDGET, {
    variables: { id },
  });

  return (
    <li>
      {loading ? "Loading..." : `${data.widget?.id}: ${data.widget?.name}`}
    </li>
  );
}

const PersonListItem = ({ id }) => {
  const { loading, data, error } = useQuery(SINGLE_PERSON, {
    variables: { id },
  });

  return (
    <li>
      {loading ? "Loading..." : `${data.person?.id}: ${data.person?.name}`}
    </li>
  );
}

function App() {
  const { loading: widgetsLoading, data: widgetsData } = useQuery(ALL_WIDGETS);
  const { loading: peopleLoading, data: peopleData } = useQuery(ALL_PEOPLE);

  return (
    <main>
      <h2>People</h2>
      {peopleLoading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {peopleData?.people.map((person) => (
            <PersonListItem key={person.id} id={person.id} />
          ))}
        </ul>
      )}
      <h2>Widgets</h2>
      {widgetsLoading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {widgetsData?.widgets.map((widget) => (
            <WidgetListItem key={widget.id} id={widget.id} />
          ))}
        </ul>
      )}
    </main>
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          widget: {
            read(existing, { args, toReference }) {
              return toReference({
                __typename: "Widget",
                id: args.id
              })
            }
          },
          person: {
            read(existing, { args, toReference }) {
              return toReference({
                __typename: "Person",
                id: args.id
              })
            }
          }
        }
      }
    },
    possibleTypes: {
      Widget: ["FooWidget", "BarWidget"]
    }
  }),
  link,
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
        </Route>
      </Routes>
    </Router>
  </ApolloProvider>
);
