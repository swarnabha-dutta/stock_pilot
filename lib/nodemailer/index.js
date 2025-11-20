import nodemailer from "nodemailer";
import {NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE} from "@/lib/nodemailer/template";

export const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.NODEMAILER_EMAIL,
        pass:process.env.NODEMAILER_PASSWORD
    }
});


export const sendWelcomeEmail = async ({email,name,intro}) =>{
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
    .replace("{{name}}",name)
    .replace("{{intro}}",intro);

    const mailOptions = {
        from: `'StockPilot' <stockpilot@swarnabhadutta909.in>`,
        to: email,
        subject:`Welcome to StockPilot - your stock market toolkit is ready!`,
        text:'Thanks for joining StockPilot',
        html:htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};



export const sendNewsSummaryEmail = async({email, date,newsContent})=>{
    const htmltemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}',date)
        .replace('{{newsContent}}',newsContent);

    const mailOptions  = {
        from :`'StockPilot  News '<stockpilot@swarnabhadutta909.in>`,
        to:email,
        subject: `Market News Summary Today-${date}`,
        text:`Today's market news summary from StockPilot`,
        html:htmltemplate,
    };
    await transporter.sendMail(mailOptions);
}