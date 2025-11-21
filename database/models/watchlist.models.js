import {Schema,model,models} from "mongoose";




const WatchlistSchema = new Schema(
    {
                userId:{type:String,required:true , index:true},
                symbol:{type:String,required:true,uppercase:true,trim:true},
                company:{type:String,required:true,trim:true},
                addedAt:{type:Date,default:Date.now},
              },
    {timestamps:false}
    );

// Prevent duplicate symbols per user
WatchlistSchema.index({ userId : 1 , symbol : 1 },{unique :true });


export const Watchlist = models?.Watchlist || model("Watchlist",WatchlistSchema);