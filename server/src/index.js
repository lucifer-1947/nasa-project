//NOTE: always at top , so all below code can utilise the environment variables
import * as dotenv from 'dotenv'
dotenv.config()


import http from 'http'
import app from './app.js'
import {mongoConfig} from './services/mongo.js'


const PORT = process.env.PORT || 4000 

const server = http.createServer(app)


//NOTE: as we know any code above await works as synchrous. 
await mongoConfig()


//NOTE: any code below await works like asynchronous. this will need to wait until await is done.
server.listen(PORT,()=>console.log(`web server activated and listening at port:${PORT}`))