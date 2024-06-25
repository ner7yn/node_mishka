import express from 'express';
import { generateCode, verifyCode } from "./auth.js";
const router = express.Router();

router.post('/generate-code', generateCode);
router.post('/verify-code', verifyCode);

export default router;