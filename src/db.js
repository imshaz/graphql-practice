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


const db ={
    users, posts, comments
}

export default db
// export db as default