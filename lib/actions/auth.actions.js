"use server";

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";
import {headers} from "next/headers";

export const signUpWithEmail=async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry})=>{
    try{

        if (!email || !password || !fullName) {
            return {success: false, error: "Email, password, and full name are required"};
        }

        if (password.length < 8) {
            return {success: false, error: "Password must be at least 8 characters"};
        }
        const response = await auth.api.signUpEmail({
            body:{email,password,name:fullName}
        });
        if(response){
            try {
                await inngest.send({
                    name:"app/user.created",
                    data:{
                        email,
                        name:fullName,
                        country,
                        investmentGoals,
                        riskTolerance,
                        preferredIndustry
                    }
                });  
            }catch (eventError) {
                console.error("Failed to send user.created event", eventError);
            }
        }

        return  {success:true,data:response};

    }catch (e) {
        console.error("Sign Up Failed",e);
        return {success:false,error:"Sign up failed"};
    }
}


export const signInWithEmail = async({email,password})=>{
    try {
        if (!email || !password) {
            return {success: false, error: "Email and password are required"};
        }
        const response = await auth.api.signInEmail({
            body:{email,password},
        });
        return {success:true,data:response};
    }catch (e) {
        console.error("Sign In failed",e);
        return {success:false,error:"Sign in failed"};

    }
}


export const signOut = async () =>{
    try {
        await auth.api.signOut({
            headers:await  headers()
        });
        return { success: true };
    }catch(e){
        console.log("Sign out failed",e);
        return {success:false,error:"Sign out failed"};
    }
}