const { GraphQLServer } = require('graphql-yoga')

const typeDefs =`
type Query {
   greeting(name:String):String!
   me:User!
   post: Post!
}
type User{
    id:ID!
    name:String! 
    email:String!
    contact:String!
}

type Post {
    id:ID!
    title:String!
    body:String!
    published:Boolean!
}
`

const resolvers ={
    Query:{
        
        me(){
            return {
                id:'sjslk',
                name:'shaz',
                email:'shaz@me.com',
                contact:'00923009159999'
            }
        },
    
        post(){
            return {
                id:'id-1',
                title:'graphql',
                body:'Graphql is fun',
                published:false
            }
        }
    }
}

const server =new GraphQLServer({typeDefs, resolvers})
server.start(()=>{console.log("server running on localhost:4000")})