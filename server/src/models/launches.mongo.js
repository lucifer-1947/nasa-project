import mongoose from "mongoose"

const launchesSchema = mongoose.Schema({
    flightNumber: {
        type: Number,
        require: true,
    },
    launchDate: {
        type: Date,
        require: true
    },
    mission:{
        type:String,
        require:true,
    },
    rocket:{
        type:String,
        require:true
    },
    target:{
        type:String,
    },
    customers:[String],
    upcoming:{
        type:Boolean,
        require:true
    },
    success:{
        type:Boolean,
        require:true
    }
})

export default mongoose.model('launch',launchesSchema) 