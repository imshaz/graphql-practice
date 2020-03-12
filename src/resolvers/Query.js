const Query ={
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
  } 


  export default Query