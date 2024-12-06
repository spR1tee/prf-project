import express, { Request, Response } from 'express';
import { configureRoutes } from './routes/routes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession  from 'express-session';
import passport from 'passport';
import { configurePassport } from './passport/passport';
import mongoose from 'mongoose';
import cors from 'cors';
import client from 'prom-client';

const app = express();
const port = 5000;
const dbUrl = 'mongodb://172.100.0.30:27017/my_db';

const collectDefaultMetrics = client.collectDefaultMetrics; 
collectDefaultMetrics();

mongoose.connect(dbUrl).then((_) => {
    console.log('Successfully connected to MongoDB.');
}).catch(error => {
    console.log(error);
    return;
});

const whitelist = ['*', 'http://172.100.0.20:4200']
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
        if (whitelist.indexOf(origin!) !== -1 || whitelist.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'));
        }
    },
    credentials: true
};

/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://172.100.0.10:5000/register");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });*/

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

const sessionOptions: expressSession.SessionOptions = {
    secret: 'totallysecretsomething',
    resave: true,
    saveUninitialized: true
};
app.use(expressSession(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.get('/metrics', async (req: Request, res: Response) => {
    try { res.set('Content-Type', client.register.contentType);
            res.end(await client.register.metrics());
    } catch (ex) {
        res.status(500).end(ex); 
    } 
});

app.use('/', configureRoutes(passport, express.Router()));

app.listen(port, () => {
    console.log('Server is listening on port ' + port.toString());
});

console.log('After server is ready.');