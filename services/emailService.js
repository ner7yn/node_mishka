import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Yandex',
    auth: {
        user: 'dan.palabugin@yandex.ru',
        pass: 'gvylnpjvytileftj'
    }
});

export async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: 'dan.palabugin@yandex.ru',
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}