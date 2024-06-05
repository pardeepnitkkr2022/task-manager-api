const sgMail=require('@sendgrid/mail')

const sendGridAPIKey=process.env.SENDGRID_API_KEY
sgMail.setApiKey(sendGridAPIKey)
const sendWelcomeEmail=(email,name)=>{
sgMail.send({
    to:email,
    from:'pardeepnitkkr2022@gmail.com',
 
    subject:'My website email services',
    text:`welcome to my website,${name}`

})
}

const whyLeavingMyWebsite=(email,name)=>
    {
        sgMail.send({
        to: email,
        from : 'pardeepnitkkr2022@gmail.com',
        subject:'Leaving our website',
        text:`We are sorry to hear that you are leaving our website Mr.${name} . Can you tell us the reason why you did not like our website??`
        })
    }

module.exports={
    sendWelcomeEmail,
    whyLeavingMyWebsite
}