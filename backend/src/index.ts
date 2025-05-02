import express from 'express';
import { configureRoutes } from './routes/routes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport from 'passport';
import { configurePassport } from './passport/passport';
import mongoose from 'mongoose';
import { User } from './model/User';
import cors from 'cors';

const app = express();
const port = 3000;
const MONGO_URI = "mongodb+srv://kolbertmario19:Mario2002@mario.l35go.mongodb.net/?retryWrites=true&w=majority&appName=Mario";


mongoose.connect(MONGO_URI).then(_ => {
    console.log('Successfully connected to MongoDB.');
}).catch(error => {
    console.log('Error connecting to MongoDB.');
    console.log(error);    
});


const whiteList = ['*'/*, 'http://192.168.1.101:4200'*/, 'http://localhost:4200']
const corsOptions = {
    origin: (origin: string | undefined, callback: (error: Error | null, allowed?: boolean) => void) => {
        if (whiteList.indexOf(origin!) !== -1 || whiteList.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));

// bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// cookiesParser
app.use(cookieParser());

// session
const sessionOpitons: expressSession.SessionOptions = {
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false,
}
app.use(expressSession(sessionOpitons));

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use('/app', configureRoutes(passport, express.Router()));

app.listen(port, () => {
    console.log(`The app is running on port ${port}`);
    checkAdminIsExists();
});

// check admin exists, if it's not exist, then create it
async function checkAdminIsExists() {
    const isAdminExists = await User.findOne({email: "admin@admin.com"});
    if (!isAdminExists) {
        const adminUser = new User({email: "admin@admin.com", password: "adminPwd123", isAdmin: true});
        adminUser.save().then(_ => {
            console.log('Admin successfully created.');
        }).catch(error => {
            console.error(error);
        })
    }
}