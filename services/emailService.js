import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Yandex',
    auth: {
        user: 'besFriends@yandex.ru',
        pass: 'gsxbclaeeiheotpz'
    },
    tls: {
        rejectUnauthorized: false
    }
});

export async function sendEmail(to, subject, html) {
    const mailOptions = {
        from: 'besFriends@yandex.ru',
        to,
        subject,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}