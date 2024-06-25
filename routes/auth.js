import { PrismaClient } from "@prisma/client";
import {sendEmail} from '../services/emailService.js'
const prisma = new PrismaClient;


export async function generateCode  (req, res) {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const user = await prisma.user.upsert({
        where: { email },
        update: { code },
        create: { email, code }
      });
  
      await sendEmail(email, 'Your verification code', `Your code is: ${code}`);
      res.status(200).json({ message: 'Code sent to email' });
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Failed to send code' });
    }
  };
  
  export async function verifyCode (req, res)  {
    const { email, code } = req.body;
  
    try {
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (user && user.code === code) {
        res.status(200).json({ message: 'Code verified' });
      } else {
        res.status(401).json({ error: 'Invalid code' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify code' });
    }
  };