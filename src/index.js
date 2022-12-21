import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import { connect } from '../config/db/index.js';
import { routes } from '../routes/index.js';
import { SocketIO } from './socket/index.js';
import { createServer } from 'http';
const app = express();
const port = 3000;
const server = createServer(app);
dotenv.config();

app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(path.dirname(__dirname), 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET',
    key: 'sid'
  })
);

SocketIO(server);

app.use(passport.initialize());
app.use(passport.session());

connect();
routes(app);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
