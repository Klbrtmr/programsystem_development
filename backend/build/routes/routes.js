"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.configureRoutes = void 0;
const User_1 = require("../model/User");
const Races_1 = require("../model/Races");
const Comment_1 = require("../model/Comment");
const UsersLikesRaces_1 = require("../model/UsersLikesRaces");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const configureRoutes = (passport, router) => {
    router.get('/', (req, res) => {
        res.write('The server is available at the moment.');
        res.status(200).end(`Wow it's working`);
    });
    // User endpoints
    // Log in
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (error, user) => {
            if (error) {
                res.status(500).send(error);
            }
            else {
                if (!user) {
                    res.status(400).send('User not found.');
                }
                else {
                    req.login(user, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        }
                        else {
                            console.log('Successful login.');
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });
    // Register
    router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, username, name, password, isAdmin } = req.body;
        console.log('Registering user...');
        const user = new User_1.User({ email: email, username: username, name: name, password: password, isAdmin: isAdmin });
        const isExists = yield User_1.User.findOne({ email: email });
        console.log('Checking if user exists...');
        if (isExists) {
            console.log('This email is already taken.');
            res.status(500).send('This email is already taken.');
        }
        else {
            user.save().then(data => {
                console.log('Successfully registration.');
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            });
        }
    }));
    // Log out
    router.post('/logout', (req, res) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error');
                }
                console.log('Successfully logged out.');
                res.status(200).send('Successfully log out.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    // Delete user
    router.delete('/delete_user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.userId;
        const deletedUser = yield User_1.User.findByIdAndDelete(userId);
        if (deletedUser) {
            res.status(200).send('User successfully deleted.');
        }
        else {
            res.status(404).send('User not found.');
        }
    }));
    // Get All Users
    router.get('/getAllUsers', (req, res) => {
        if (req.isAuthenticated()) {
            const query = User_1.User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    // Check user is authenticated
    router.get('/checkAuth', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        }
        else {
            res.status(500).send(false);
        }
    });
    // Check user is admin
    router.get('/isAdmin', (req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin) {
                res.status(200).send(true);
            }
            else {
                res.status(500).send(false);
            }
        }
        else {
            res.status(500).send(false);
        }
    });
    // Get current user
    router.get('/currentUser', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send(req.user);
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    // Race endpoints
    // One specific Race
    router.get('/races/:racesId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { racesId } = req.params;
        try {
            const race = yield Races_1.Races.findById(racesId);
            if (race) {
                console.log('Specific race found.');
                res.status(200).send(race);
            }
            else {
                res.status(404).send('Race not found.');
            }
        }
        catch (error) {
            res.status(500).send('Internal server error.');
        }
        /*const topic = await Topic.findById(topicId);
        if (topic) {
            console.log('Specific topic found.');
            res.status(200).send(topic);
        } else {
            res.status(404).send('Topic not found.');
        }*/
    }));
    // All Races
    router.get('/all_races', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const races = yield Races_1.Races.find();
        if (races) {
            console.log('All the Races successfully retrieved.');
            res.status(200).send(races);
        }
        else {
            res.status(404).send('No races found.');
        }
    }));
    // My Topics
    // router.get('/my_topics', async (req: Request, res: Response) => {
    //     if (req.isAuthenticated()) {
    //         const topics = await Topic.find({ author: req.user.email });
    //         if (topics) {
    //             console.log('My Topics successfully retrieved.');
    //             res.status(200).send(topics);
    //         } else {
    //             res.status(404).send('You have not written any topics yet.');
    //         }
    //     } else {
    //         res.status(500).send('User is not logged in.');
    //     }
    // });
    // New Race
    router.post('/new_races', (req, res) => {
        const { trackName, locationName, date } = req.body;
        if (req.isAuthenticated()) {
            const race = new Races_1.Races({ trackName: trackName, locationName: locationName, date: date });
            console.log("Create");
            console.log(race);
            race.save().then(data => {
                console.log('Race successfully created.');
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    // Delete Race
    router.delete('/delete_race/:racesId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const racesId = req.params.racesId;
        const deletedRace = yield Races_1.Races.findByIdAndDelete(racesId);
        if (deletedRace) {
            res.status(200).send('Race successfully deleted.');
        }
        else {
            res.status(404).send('Race not found.');
        }
    }));
    // Edit Race
    router.put('/edit_races/:racesId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { racesId } = req.params;
        const { trackName, locationName } = req.body;
        if (req.isAuthenticated()) {
            const race = yield Races_1.Races.findById(racesId);
            if (race) {
                const updatedRace = yield Races_1.Races.findOneAndUpdate({ _id: racesId }, { $set: { 'trackName': trackName, 'locationName': locationName } }, { new: true });
                res.status(200).send('Race successfully edited.');
            }
            else {
                res.status(404).send('Race not found.');
            }
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    }));
    // Like Race
    router.put('/like_races/:racesId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { racesId } = req.params;
        if (req.isAuthenticated()) {
            const username = new UsersLikesRaces_1.UsersLikesRaces({ username: req.user.email });
            const race = yield Races_1.Races.findById(racesId);
            if (race) {
                if (race.usersLikesRaces.includes(username)) {
                    res.status(400).send('User already liked this race.');
                }
                else {
                    race.usersLikesRaces.push(username);
                    yield race.save();
                    res.status(200).send(race);
                }
            }
            else {
                res.status(404).send('Race not found.');
            }
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    }));
    // Dislike Race
    router.put('/dislike_races/:racesId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { racesId } = req.params;
        if (req.isAuthenticated()) {
            const username = new UsersLikesRaces_1.UsersLikesRaces({ username: req.user.email });
            const race = yield Races_1.Races.findById(racesId);
            if (race) {
                const index = race.usersLikesRaces.findIndex(user => user.username === username.username);
                if (index !== -1) {
                    race.usersLikesRaces.splice(index, 1);
                    yield race.save();
                    res.status(200).send(race);
                }
                else {
                    res.status(400).send('User has not liked this race.');
                }
            }
            else {
                res.status(404).send('Races not found.');
            }
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    }));
    // Comment endpoints
    // My comments in the Races
    router.get('/my_comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { author } = req.body;
        const races = yield Races_1.Races.find();
        if (races) {
            /*const userComments = races.reduce((acc, races) => {
                const comments: any = races.comments.filter(comment => comment.author === author);
                return acc.concat(comments);
            }, []);
            console.log(userComments);*/
            const userRaces = races.map(races => {
                const userComments = races.comments.filter(comment => comment.author === author);
                if (userComments.length > 0) {
                    return Object.assign(Object.assign({}, races.toObject()), { comments: userComments });
                }
                else {
                    return null;
                }
            }).filter(races => races !== null);
            res.status(200).send(userRaces);
        }
        else {
            res.status(404).send('No comments found.');
        }
    }));
    // New Comment
    router.post('/new_comment/:racesId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.isAuthenticated()) {
            const racesId = req.params.racesId;
            const { comment } = req.body;
            const newComment = new Comment_1.Comment({ author: req.user.email, comment: comment, timestamp: new Date() });
            const race = yield Races_1.Races.findById(racesId);
            if (!race) {
                res.status(404).send('Race not found');
            }
            else {
                race.comments.push(newComment);
                race.save();
                console.log('Comment successfully created.');
                res.status(200).send(newComment);
            }
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    }));
    // Delete comment
    router.delete('/delete_comment/:racesId/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { racesId, commentId } = req.params;
        const race = yield Races_1.Races.findById(racesId);
        if (race) {
            const updatedRace = yield Races_1.Races.findByIdAndUpdate(racesId, { $pull: { comments: { _id: commentId } } }, { new: true });
            res.status(200).send('Comment successfully deleted.');
        }
        else {
            res.status(404).send('Comment not found.');
        }
    }));
    // Edit comment
    router.put('/edit_comment/:racesId/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { racesId, commentId } = req.params;
        const { comment } = req.body;
        const race = yield Races_1.Races.findById(racesId);
        if (race) {
            const updatedRace = yield Races_1.Races.findOneAndUpdate({ _id: racesId, 'comments._id': commentId }, { $set: { 'comments.$.comment': comment } }, { new: true });
            res.status(200).send('Comment successfully edited.');
        }
        else {
            res.status(404).send('Race or Comment not found.');
        }
    }));
    // Like Comment
    // router.put('/like_comment/:topicId/:commentId', async (req: Request, res: Response) => {
    //     const { topicId, commentId } = req.params;
    //     if (req.isAuthenticated()) {
    //         const topic = await Topic.findById(topicId);
    //         if (topic) {
    //             const userWhoLiked = new UsersLikesComment({ username: req.user.email });
    //             const updatedTopic = await Topic.findOneAndUpdate(
    //                 { _id: topicId, 'comments._id': commentId },
    //                 { $push: { 'comments.$[comment].usersLikesComment': userWhoLiked } },
    //                 { 
    //                     new: true,
    //                     arrayFilters: [{ 'comment._id': commentId, 'comment.usersLikesComment.username': { $nin: [req.user.email] } }]
    //                 }
    //             );
    //             if (updatedTopic) {
    //                 console.log('Comment successfully liked.');
    //                 res.status(200).send(updatedTopic);
    //             } else {
    //                 res.status(200).send(topic);
    //             }
    //         }
    //     } else {
    //         res.status(500).send('User is not logged in.');
    //     }
    // });
    // Dislike Comment
    // router.put('/dislike_comment/:topicId/:commentId', async (req: Request, res: Response) => {
    //     const { topicId, commentId } = req.params;
    //     if (req.isAuthenticated()) {
    //         const topic = await Topic.findById(topicId);
    //         if (topic) {
    //             const updatedTopic = await Topic.findOneAndUpdate(
    //                 { _id: topicId, 'comments._id': commentId, 'comments.usersLikesComment.username': req.user.email },
    //                 { $pull: { 'comments.$[comment].usersLikesComment': { username: req.user.email } } },
    //                 {
    //                     new: true,
    //                     arrayFilters: [{ 'comment._id': commentId }]
    //                 }
    //             );
    //             if (updatedTopic) {
    //                 console.log('Comment successfully disliked.');
    //                 res.status(200).send(updatedTopic);
    //             } else {
    //                 res.status(200).send(topic);
    //             }
    //         }
    //     } else {
    //         res.status(500).send('User is not logged in.');
    //     }
    // });
    router.get('/results/:raceId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const wikiUrl = req.query.wikiUrl;
        if (!wikiUrl) {
            return res.status(400).json({ message: 'wikiUrl query param missing' });
        }
        try {
            // lehívjuk a teljes HTML-t
            const { data: html } = yield axios_1.default.get(wikiUrl);
            const $ = cheerio.load(html);
            // 1. Megkeressük a <h2 id="Futam"> elemet
            const heading = $('h2#Futam').first();
            if (!heading.length) {
                return res.status(404).json({ message: '„Futam” szekció nem található' });
            }
            // Lekérjük a teljes divet, amiben a h2 van
            const headingDiv = heading.closest('div.mw-heading');
            if (!headingDiv.length) {
                return res.status(404).json({ message: '„Futam” címsor konténer nem található' });
            }
            // A div testvérei közül az első table-t keressük
            const resultsTable = headingDiv.nextAll('table').first();
            if (!resultsTable.length) {
                return res.status(404).json({ message: '„Futam” táblázat nem található' });
            }
            // 3. Feldolgozzuk a sorokat
            const results = [];
            /*
                resultsTable.find('tr').each((i, tr) => {
                  const cols = $(tr).find('td');
                  // Csak azokat a sorokat dolgozzuk fel, ahol legalább 6 cella van
                  if (cols.length >= 6) {
                    results.push({
                      position: $(cols[0]).text().trim(),
                      driver:   $(cols[1]).text().trim(),
                      team:     $(cols[2]).text().trim(),
                      time:     $(cols[4]).text().trim(),
                      laps:     $(cols[3]).text().trim()
                    });
                  }
                });*/
            resultsTable.find('tr').each((i, tr) => {
                // vegyük ki a <th> és a <td> cellákat is
                const cells = $(tr).children('th, td');
                // ha ez a sor csak header (minden cella <th>), akkor kihagyjuk
                const thCount = $(tr).find('th').length;
                if (thCount === cells.length) {
                    return;
                }
                // csak akkor, ha legalább 6 cella van (így a 0,2,3,5 indexek biztosan léteznek)
                if (cells.length >= 6) {
                    results.push({
                        position: $(cells[0]).text().trim(),
                        driver: $(cells[2]).text().trim(),
                        team: $(cells[3]).text().trim(),
                        time: $(cells[5]).text().trim(),
                        laps: $(cells[4]).text().trim()
                    });
                }
            });
            return res.json(results);
        }
        catch (err) {
            console.error('Wikipedia feldolgozási hiba:', err);
            return res.status(500).json({ message: 'Hiba a Wikipedia feldolgozásakor' });
        }
    }));
    return router;
};
exports.configureRoutes = configureRoutes;
