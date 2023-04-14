import * as dotenv from 'dotenv'
dotenv.config()


import mongoose from "mongoose"
import { loadPlanetsData } from "../models/planets.model.js"
import { loadLaunchesData } from "../models/launches.model.js"

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', ()=>{
    console.log("MongoDB connection ready")
})

mongoose.connection.on('error', (err)=>{
    console.error(err)
})

async function mongoConfig(){

    await mongoose.connect(MONGO_URL)

    await loadPlanetsData(); 

    await loadLaunchesData();

}


async function mongoDisconnect(){
    await mongoose.disconnect()
}

export  {mongoConfig as mongoConfig,mongoDisconnect}
