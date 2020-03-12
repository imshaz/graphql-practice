import { v4 as uuidv4 } from "uuid";


const Mutation ={
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
    updateUser(parent,args, {db:{users}, info}){

    const {name, email, age} =args.data
     // find user
    const user = users.find(user=>user.id===args.id)

    if(!user){
      throw new Error("user not found")
    }

    if(typeof email ==="string"){
      const emailTaken = users.some(user=>user.email===email)
      if(emailTaken) throw new Error("Email already taken")
    }
    user.email= email; 
    if(typeof name==="string"){
      user.name=name
    }
    if(typeof age !== "undefined"){
      user.age=age
    }

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
  }

  export default Mutation