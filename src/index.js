const { GraphQLServer } = require("graphql-yoga");

import { v4 as uuidv4 } from "uuid";
let users = [
  {
    id: "123",
    name: "Shaz",
    email: "shaz@gmail.com",
    age: 29
  },
  {
    id: "124",
    name: "sara",
    email: "sara@gmail.com",
    age: 28
  },
  { id: "125", name: "ali", email: "ali@hotmail.com", age: 30 }
];

let posts = [
  {
    id: "post-1",
    title: "Post One",
    body: "This is Post one and it is all about graphql",
    published: true,
    author:'123'
  },
  {
    id: "post-2",
    title: "Post two",
    body: "This is Post two and it is all about reactJs",
    published: false,
    author:'124'
  },
  {
    id: "post-3",
    title: "Post three",
    body: "This is Post three and it is all about stock",
    published: true,
    author:'125'
  }
];

let comments=[
  {
    id:"1",
    text:"JS is awesome",
    author:'123',
    post:'post-2'
  },
  {
    id:"2",
    text:"JS is fun",
    author:'124',
    post:'post-1'
  },
  {
    id:"3",
    text:"Programming is fun",
    author:'123',
    post:'post-2'
  },
  {
    id:"4",
    text:"front end is cool",
    author:'125',
    post:'post-3'
  }
]

const typeDefs = `
type Query {
   user(query:String):User
   users:[User!]!
   posts(query:String):[Post!]!
   comments:[Comment!]!
   me:User!
   post: Post!
}
type Mutation{
  createUser(data:createUserInput):User!
  createPost(data:createPostInput):Post!
  createComment(text:String!, author:ID!, post:ID!):Comment!

  deleteUser(id:ID!):User!
  deletePost(id:ID!):Post!
  deleteComment(id:ID!):Comment!
}
input createUserInput {
name:String!
email:String!
age:Int
}

input createPostInput{
  title:String!
  body:String!
  published:Boolean!
  author:ID!
}
type User{
    id:ID!
    name:String! 
    email:String!
    age:String,
    posts:[Post],
    comments:[Comment]
}
type Post {
    id:ID!
    title:String!
    body:String!
    published:Boolean!
    author:User!,
    comments:[Comment!]!
}

type Comment {
  id: ID!
  text:String!
  author:User!
  post:Post!
}
`;

const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      return users;
    },
    posts(parent,args, ctx, info){
      if(!args.query){
        return posts
      }
      return posts.filter(post=>{
        const isTitleMatch = post.title.includes(args.query.toLowerCase()); 
        const isBodyMatch = post.body.includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch
      })
    },
    
    user(parent, args, ctx, info) {
      // if(!args.query) return null

      // TODO
      return users.filter(user => {
        // const
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
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
    comments(){
      return comments
    }
  },

  Mutation :{
    createUser(parent, args, ctx, info){
      
      const emailTaken = users.some(user=>{
        return user.email===args.data.email
      })

    if(emailTaken){
       throw new Error('Email taken')
    }

      const user={
      id : uuidv4(),
      ...args.data

      }

      users.push(user)

      return user
      
    },
    createPost(parent, args, ctx, info){

      const isAuthorExists = users.some(user=>{
        user.id === args.data.author
      })
 
      if(isAuthorExists){
        throw new Error('author not found')
      }

      const post ={
        id:uuidv4(), 
      ...args.data
      }
      posts.push(post)
      return post
    },
    createComment(parent, args, ctx, info){

    const isAuthorExists =users.some(user=>{
      return user.id===args.author
    })

    if(!isAuthorExists){
      throw new Error("author not found")
    }
    const isPostExist =posts.some(post=>{
      return post.id===args.post && post.published
    })
    if(!isPostExist){
      throw new Error("Post not found")
    }

    const comment ={
      id:uuidv4(),
      ...args
    }

    comments.push(comment);
    return comment
  },

  deleteUser(parent, args, ctx,info){
      
      const index = users.findIndex(user=>{
        return user.id===args.id
      })

       if(index===-1){
         throw new Error("User not found")
       }
       const deletedUsers= users.splice(index, 1);

       posts = posts.filter((post)=>{
            const match = post.author ===args.id
            if(match){
              comments = comments.filter(comment=>{
                return comment.id!==post.id
              })
            }
            return !match
       })
       comments = comments.filter((comment)=>comment.author!==args.id)

       return deletedUsers[0]
  },
  deletePost(parent, args, ctx,info){
    const index = posts.findIndex(post=>{
      return post.id===args.id
    })
    if(index===-1){
      throw new Error("Post not found")
    }


    const deletePosts = posts.splice(index, 1);

    comments = comments.filter(comment=>comment.post!==args.id
    )
    return deletePosts[0]
  },
  deleteComment(parent, args, ctx, info){

    const index = comments.findIndex(comment=>{
      return comment.id===args.id
    })

    if(index===-1) throw new Error("Comment not found")

    const deletedComment = comments.splice(index, 1)
    return deletedComment[0]
  }
  },
  

  Post:{
    // this is called for each object of posts array. 
    // the parent contains individual object
    author(parent, args, ctx, info){
      return users.find(user=>{
        return user.id ===parent.author
      })
    },
    comments(parents, args, ctx, info){
      console.log(parents)
      return comments.filter(comment=>{
        return comment.post===parents.id
      })
    }
  },
  User:{
      posts(parent, args, ctx, info){
        return posts.filter(post=>{
          return post.author===parent.id
        })
      },
      comments(parent, args, ctx, info){
        return comments.filter(comment=>{
          return comment.author=parent.id
        })
      }
  },
  Comment:{
     author(parent,args, ctx, info){
          return users.find(user=>{
         return user.id===parent.author
       })
     },
     post(parent, args, ctx, info){
       return posts.find(post=>{
         return post.id===parent.post
       })
     }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log("server running on localhost:4000");
});
