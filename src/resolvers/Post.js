const Post ={
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
  }

  export default Post