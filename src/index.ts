import app from './infrastructure/http/server';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT_APP) || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
