const { GraphQLServer } = require("graphql-yoga");
const users =[
    {
        id:'123', 
        name:'Shaz', 
        email:'shaz@gmail.com', 
        age:29
    }, 
    {
        id:'124', 
        name:'sara', 
        email:'sara@gmail.com', 
        age:28
    }, 
    {id:'125', 
        name:'ali', 
        email:'ali@hotmail.com', 
        age:30
    }

]
const typeDefs = `
type Query {
    user(query:String):User
   users:[User!]!
   me:User!
   post: Post!
}
type User{
    id:ID!
    name:String! 
    email:String!
    age:String!
}

type Post {
    id:ID!
    title:String!
    body:String!
    published:Boolean!
}
`;

const resolvers = {
  Query: {
      users(parent, args, ctx, info){

return users
      },
      user(parent, args, ctx, info){

        // if(!args.query) return null

// TODO
        return users.filter(user=>{
            // const 
          return user.name.toLowerCase().includes(args.query.toLowerCase());
        })
      },
    me() {
      return {
        id: "sjslk",
        name: "shaz",
        email: "shaz@me.com",
        age: 29
      };
    },

    post() {
      return {
        id: "id-1",
        title: "graphql",
        body: "Graphql is fun",
        published: false
      };
    },

 
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("server running on localhost:4000");
});
