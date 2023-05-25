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
import { strategyFB } from '../app/auth/StrategyFB.js';

import   { strategyGG } from '../app/auth/StrategyGG.js'

const app = express();
const port = 3001;
const server = createServer(app);
dotenv.config();



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(path.dirname(__dirname), 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

strategyGG();
strategyFB();

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET',
    key: 'sid'
  })
);

app.use(cors({ 
  origin: 'http://localhost:3000',
  methods:"GET,POST,PUT,PATCH,DELETE",
  credentials:true }
  ));
SocketIO(server);

app.use(passport.initialize());
app.use(passport.session());

connect();
routes(app);

server.listen(port, () => {
  console.log(`Example run on port: http://localhost:${port}`);
});
