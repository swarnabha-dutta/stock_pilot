import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;


// Global cache setup for Next.js (prevents multiple connections)
if(!global.mongooseCache){
    global.mongooseCache = {conn:null,promise:null};
}


let cached = global.mongooseCache;

export const connectToDatabase = async () =>{
    if(!MONGODB_URL){
        throw new Error("MONGODB_URL must be set in .env file ")
    }

    // If already connected → return existing connection
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URL,{
            bufferCommands:false,
        });
    }

    try{
        cached.conn = await cached.promise;
    }catch(err){
        cached.promise = null;
        throw err;
    }

    console.log(`Connected to database ${process.env.NODE_ENV} - ${MONGODB_URL}`);


    return cached.conn;
}
