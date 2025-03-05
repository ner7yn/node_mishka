import { PrismaClient } from "@prisma/client";
import { sendEmail } from '../services/emailService.js';

const prisma = new PrismaClient();

export async function generateCode(req, res) {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { code },
      create: { email, code }
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Comfortaa',Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 20px;
            padding: 0;
          }
          img{
            width:200px;
          }
          .container {
            width: 600px;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            border-radius:10px;
          }
          .logo {
            margin-bottom: 20px;
            margin-toз: 20px;
          }
          .code-block {
            background-color: #6f9c3d;
            color: #ffffff;
            padding: 10px 10px;
            border-radius: 8px;
            margin: 20px auto;
            font-size: 30px;
            width: 150px;
          }
          .message {
            color: #000;
            font-size: 16px;
            line-height: 1.5;
          }
          p{
            font-size:18px;
            color:#000;
          }
          h1{
            font-size:30px;
            color:#000;
            padding:0;
            margin-bottom:10px;
          }
            .time{
              color:#888;
            }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <!-- Вставьте сюда ваш логотип или название компании -->
            <img src="../Loading.png" alt="Logo">
          </div>
          <div class="message">
            <h1>Ваш код авторизации</h1>
             <p>Спасибо за то что выбрали нас. Используйте код ниже для завершения регистрации.</p>
            <div class="code-block">
              ${code}
            </div>
            <p class="time">Код действителен в течение 10 минут.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(email, 'Ваш код авторизации', html);
    res.status(200).json({ message: 'Code sent to email' });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: 'Failed to send code' });
  }
}

export async function verifyCode(req, res) {
  const { email, code } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.code === code) {
      res.status(200).json({ message: 'Code verified', userId: user.id });
    } else {
      res.status(401).json({ error: 'Invalid code' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify code' });
  }
}