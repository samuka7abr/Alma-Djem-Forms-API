var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { google } from 'googleapis';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
// Logs para debug
console.log('Variáveis de ambiente:');
console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID);
console.log('GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL);
console.log('GOOGLE_PRIVATE_KEY existe?', !!process.env.GOOGLE_PRIVATE_KEY);
const app = express();
app.use(cors());
app.use(express.json());
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: (_a = process.env.GOOGLE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.split('\\n').join('\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
app.post('/api/submit-form', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone } = req.body;
        yield sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Página1!A:C',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[name, email, phone]],
            },
        });
        res.status(200).json({ message: 'Dados enviados com sucesso!' });
    }
    catch (error) {
        console.error('Erro ao enviar dados:', error);
        res.status(500).json({ error: 'Erro ao enviar dados' });
    }
}));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
