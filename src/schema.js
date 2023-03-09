/*** SCHEMA ***/
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInterfaceType,
} from 'graphql';

const PersonType = new GraphQLObjectType({
  name: "Person",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }
});

const people = [
  { id: "1", name: 'John Smith' },
  { id: "2", name: 'Sara Smith' },
  { id: "3", name: 'Budd Deey' },
];

const WidgetType = new GraphQLInterfaceType({
  name: "Widget",
  resolveType: (value) => value.type,
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }
});

const FooWidgetType = new GraphQLObjectType({
  name: "FooWidget",
  interfaces: [WidgetType],
  fields: {
    id: {
      type: GraphQLID,
      resolve: (value) => value.id,
    },
    name: {
      type: GraphQLString,
      resolve: (value) => value.name,
    },
    foo: {
      type: GraphQLString,
      resolve: (value) => value.foo,
    },
  }
});

const BarWidgetType = new GraphQLObjectType({
  name: "BarWidget",
  interfaces: [WidgetType],
  fields: {
    id: {
      type: GraphQLID,
      resolve: (value) => value.id,
    },
    name: {
      type: GraphQLString,
      resolve: (value) => value.name,
    },
    bar: {
      type: GraphQLString,
      resolve: (value) => value.bar,
    },
  }
});

const widgets = [
  { id: "1", type: "FooWidget", name: "Foo 1", foo: "foo" },
  { id: "2", type: "BarWidget", name: "Bar 1", bar: "bar" },
  { id: "3", type: "FooWidget", name: "Foo 2", foo: "foo2" },
];

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    widgets: {
      type: new GraphQLList(WidgetType),
      resolve: () => widgets,
    },
    widget: {
      type: WidgetType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (root, { id }) => widgets.find((w) => w.id === id),
    },
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => people,
    },
    person: {
      type: PersonType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (root, { id }) => people.find((p) => p.id === id),
    }
  },
});

export const schema = new GraphQLSchema({ query: QueryType, types: [WidgetType, FooWidgetType, BarWidgetType] });
