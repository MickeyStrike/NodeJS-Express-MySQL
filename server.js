const port = 8000
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const app = express()
const cors = require('cors')

// import routes
const routes = require('./routes')
// import controller
const controller = require('./controller')
// Cors
const whitelist = ['http://localhost:3000','http://192.168.42.129','http://192.168.42.99','http://localhost:4500',undefined] 
const corsOptions = {origin: (origin,callback) => {
    console.log(origin)
    if(whitelist.indexOf(origin) > -1){
        callback(null,true)
    }else{
        callback(new Error('Not allowed by CORS'))
    }
},
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
}

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use('/api', routes)

const server = http.createServer(app)

server.listen(port, ()=>{
    console.log('server running on port:'+port)
})