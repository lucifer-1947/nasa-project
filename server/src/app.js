import express from 'express'
import cors from 'cors'
import * as url from 'url'
import morgan from 'morgan';
import api from './routes/api.js';

const app  = express();

//NOTE:We are no more needed cors because our FRONTEND and BACKEND is served/rendered through same origin. 
// app.use(cors({origin:'http://localhost:3000'}))
app.use(morgan('combined'))

app.use(express.json())

//NOTE:Static file serving.
app.use(express.static(url.fileURLToPath( new URL('./../public',import.meta.url))))


//NOTE:versioned API routes
app.use('/v1',api)

//NOTE: handling all other requests here.
app.get('/*',(req,res)=>{
    res.sendFile(url.fileURLToPath(new URL('./../public/index.html',import.meta.url)))
})

export default app