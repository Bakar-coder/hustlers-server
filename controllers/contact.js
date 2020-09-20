const nodemailer = require('nodemailer');

exports.postContact = async (req, res) => {
  const { name, email, subject, text } = req.body;
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ghettohustlers256@gmail.com',
            pass: 'ghettoman0781996306'
        }
    })
    const mailOptions = {
        from: `${name}`,
        to: 'mainmangenious@gmail.com',
        subject: `${email} - ${subject} `,
        text: `${text}`
    }

     await transport.sendMail(mailOptions);
     return res.json({ success: true, msg: `Message  sent successfully,` })
  };