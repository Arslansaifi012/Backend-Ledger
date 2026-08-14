import nodemailer from "nodemailer" ;

 const sendEmails =async(to) =>{

    const transporter = nodemailer.createTransport({
   host:'smtp.gmail.com',
   service:'gmail',
   port:587,
   secure:false,
   auth:{
    user:process.env.SMTP_USER,
    pass:process.env.SMTP_PASS
   }
}) ;

try {
    await transporter.verify();
    console.log("sever is ready to take our message") ;
    
} catch (error) {
    console.log("email verification failed", error.message);
    
} ;


try {
    const info = await transporter.sendMail({
        from:process.env.SMTP_USER,
        to,
        subject:"Email System Check",
        text:"Hii Email Sender Is Working....",
        html:"<h1>Email System.</h1>"
    },);

    console.log("message sent ",info) ;

    
} catch (error) {
    console.log("Error while sending mail", error);
}} ;


export default sendEmails ;