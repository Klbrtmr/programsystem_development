"use strict";
/*
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://mongo:27017/mean-app';

app.use(cors());
app.use(express.json());
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB kapcsolódva');
}).catch(err => {
  console.error('MongoDB kapcsolódási hiba:', err);
});

app.get('/', (req, res) => {
  res.send('Backend működik!');
});

app.listen(PORT, () => {
  console.log(`Szerver fut a ${PORT}-es porton`);
});
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes/routes");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./passport/passport");
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("./model/User");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
const MONGO_URI = "mongodb+srv://kolbertmario19:Mario2002@mario.l35go.mongodb.net/?retryWrites=true&w=majority&appName=Mario";
mongoose_1.default.connect(MONGO_URI).then(_ => {
    console.log('Successfully connected to MongoDB.');
}).catch(error => {
    console.log('Error connecting to MongoDB.');
    console.log(error);
});
const whiteList = ['*' /*, 'http://192.168.1.101:4200'*/, 'http://localhost:4200'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || whiteList.includes('*')) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS.'));
        }
    },
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
// bodyParser
app.use(body_parser_1.default.urlencoded({ extended: true }));
// cookiesParser
app.use((0, cookie_parser_1.default)());
// session
const sessionOpitons = {
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false,
};
app.use((0, express_session_1.default)(sessionOpitons));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, passport_2.configurePassport)(passport_1.default);
app.use('/app', (0, routes_1.configureRoutes)(passport_1.default, express_1.default.Router()));
app.listen(port, () => {
    console.log(`The app is running on port ${port}`);
    checkAdminIsExists();
});
// check admin exists, if it's not exist, then create it
function checkAdminIsExists() {
    return __awaiter(this, void 0, void 0, function* () {
        const isAdminExists = yield User_1.User.findOne({ email: "admin@admin.com" });
        // const isAdminExists = true;
        if (!isAdminExists) {
            const adminUser = new User_1.User({ email: "admin@admin.com", password: "adminPwd123", isAdmin: true });
            adminUser.save().then(_ => {
                console.log('Admin successfully created.');
            }).catch(error => {
                console.error(error);
            });
        }
    });
}
