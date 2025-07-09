import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import {PORT} from './config.js'

dotenv.config();

const app = express();
app.use(morgan('dev'))
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando');
});


app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

