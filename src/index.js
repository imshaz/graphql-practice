const { GraphQLServer } = require("graphql-yoga");
import { v4 as uuidv4 } from "uuid";
import db from './db'

const resolvers = {
  Query: {
    // context is destructured db and db is further to 'users'
    users(parent, args, {db:{users}}, info) {
      
      return users;
    },
    posts(parent,args, {db:{posts}}, info){
      if(!args.query){
        return posts
      }
      return posts.filter(post=>{
        const isTitleMatch = post.title.includes(args.query.toLowerCase()); 
        const isBodyMatch = post.body.includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch
      })
    },
    
    user(parent, args, {db:{users}}, info) {
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
    comments(parent, args, {db:{comments}},info){
      return comments
    }
  },

  Mutation :{
    createUser(parent, args, {db:{users}}, info){
      
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
    createPost(parent, args, {db:{users,posts, comments}}, info){

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
    createComment(parent, args, {db:{posts,users, comments }}, info){

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

  deleteUser(parent, args, {db:{posts,comments, users}},info){
      
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
  deletePost(parent, args, {db:{posts, comments}},info){
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
  deleteComment(parent, args, {db:{comments}}, info){

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
    author(parent, args, {db:{users}}, info){
      return users.find(user=>{
        return user.id ===parent.author
      })
    },
    comments(parents, args, {db:{comments}}, info){
      console.log(parents)
      return comments.filter(comment=>{
        return comment.post===parents.id
      })
    }
  },
  User:{
      posts(parent, args, {db:{posts}}, info){
        return posts.filter(post=>{
          return post.author===parent.id
        })
      },
      comments(parent, args, {db:{comments}}, info){
        return comments.filter(comment=>{
          return comment.author=parent.id
        })
      } 
  },
  Comment:{
     author(parent,args, {db:{users}}, info){
          return users.find(user=>{
         return user.id===parent.author
       })
     },
     post(parent, args, {db:{posts}}, info){
       return posts.find(post=>{
         return post.id===parent.post
       })
     }
  }
};

const server = new GraphQLServer(
  { 
    typeDefs:'./src/schema.graphql',
     resolvers, 
     context:{
       db
     }
     
      });
server.start(() => {
  console.log("server running on localhost:4000");
});
