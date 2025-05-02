import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic, deserializeUser } from 'passport';
import { User } from '../model/User';
import { Races } from '../model/Races';
import { Comment } from '../model/Comment';
import { json } from 'body-parser';
import { UsersLikesRaces } from '../model/UsersLikesRaces';

export const configureRoutes = (passport: PassportStatic, router: Router): Router => {    

    router.get('/', (req: Request, res: Response) => {
        res.write('The server is available at the moment.');
        res.status(200).end(`Wow it's working`);
    });

    // User endpoints
    // Log in
    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: Express.User) => {
            if (error) {
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send('User not found.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        } else {
                            console.log('Successful login.');
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    // Register
    router.post('/register', async (req: Request, res: Response ) => {
        const { email, username, name, password, isAdmin } = req.body;
        console.log('Registering user...');
        const user = new User({email: email, username: username, name: name, password: password, isAdmin: isAdmin});
        const isExists = await User.findOne( {email: email} );
        console.log('Checking if user exists...');
        if (isExists) {
            console.log('This email is already taken.');
            res.status(500).send('This email is already taken.');
        } else {
            user.save().then(data => {
                console.log('Successfully registration.');
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            });
        }
    });

    // Log out
    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error');
                }
                console.log('Successfully logged out.');
                res.status(200).send('Successfully log out.');
            });
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    // Delete user
    router.delete('/delete_user/:userId', async (req: Request, res: Response) => {
        const userId = req.params.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (deletedUser) {
            res.status(200).send('User successfully deleted.')
        } else {
            res.status(404).send('User not found.');
        }
    });

    // Get All Users
    router.get('/getAllUsers', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    // Check user is authenticated
    router.get('/checkAuth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        } else {
            res.status(500).send(false);
        }
    });

    // Check user is admin
    router.get('/isAdmin', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin) {
                res.status(200).send(true);
            } else {
                res.status(500).send(false);
            }
        } else {
            res.status(500).send(false);
        }
    });

    // Get current user
    router.get('/currentUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(req.user);
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    // Race endpoints
    // One specific Race
    router.get('/races/:racesId', async (req: Request, res: Response) => {
        const { racesId } = req.params;
        try {
            const race = await Races.findById(racesId);
            if (race) {
                console.log('Specific race found.');
                res.status(200).send(race);
            } else {
                res.status(404).send('Race not found.');
            }
        } catch (error) {
            res.status(500).send('Internal server error.');
        }
        /*const topic = await Topic.findById(topicId);
        if (topic) {
            console.log('Specific topic found.');
            res.status(200).send(topic);
        } else {
            res.status(404).send('Topic not found.');
        }*/
    });

    // All Races
    router.get('/all_races', async (req: Request, res: Response) => {
        const races = await Races.find();
        if (races) {
            console.log('All the Races successfully retrieved.');
            res.status(200).send(races);
        } else {
            res.status(404).send('No races found.');
        }
    });

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
     router.post('/new_races', (req: Request, res: Response) => {
         const { trackName, locationName, date} = req.body;
         if (req.isAuthenticated()) {

             const race = new Races({trackName: trackName, locationName: locationName, date: date});
             console.log("Create");
             console.log(race);

             race.save().then(data => {
                 console.log('Race successfully created.');
                 res.status(200).send(data);
             }).catch(error => {
                 res.status(500).send(error);
             });
         } else {
             res.status(500).send('User is not logged in.');
         }
     });

    // Delete Race
    router.delete('/delete_race/:racesId', async (req: Request, res: Response) => {
        const racesId = req.params.racesId;
        const deletedRace = await Races.findByIdAndDelete(racesId);
        if (deletedRace) {
            res.status(200).send('Race successfully deleted.')
        } else {
            res.status(404).send('Race not found.');
        }
    });
    
    // Edit Topic
    // router.put('/edit_topic/:topicId', async (req: Request, res: Response) => {
    //     const { topicId } = req.params;
    //     const { title } = req.body;
    //     if (req.isAuthenticated()) {
    //         const topic = await Topic.findById(topicId);
    //         if (topic) {
    //             const updatedTopic = await Topic.findOneAndUpdate(
    //                 { _id: topicId },
    //                 { $set: { 'title': title } },
    //                 { new: true }
    //             );
    //             res.status(200).send('Topic successfully edited.');
    //         } else {
    //             res.status(404).send('Topic not found.');
    //         }
    //     } else {
    //         res.status(500).send('User is not logged in.');
    //     }
    // });

    // Like Race
    router.put('/like_races/:racesId', async (req: Request, res: Response) => {
        const { racesId } = req.params;

        if (req.isAuthenticated()) {
            const username = new UsersLikesRaces({ username: req.user.email });
            const race = await Races.findById(racesId);
            if (race) {
                if (race.usersLikesRaces.includes(username)) {
                    res.status(400).send('User already liked this race.');
                } else {
                    race.usersLikesRaces.push(username);
                    await race.save();
                    res.status(200).send(race);
                }
            } else {
                res.status(404).send('Race not found.');
            }
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    // Dislike Race
    router.put('/dislike_races/:racesId', async (req: Request, res: Response) => {
        const { racesId } = req.params;

        if (req.isAuthenticated()) {
            const username = new UsersLikesRaces({ username: req.user.email });
            const race = await Races.findById(racesId);
            if (race) {
                const index = race.usersLikesRaces.findIndex(user => user.username === username.username);
                if (index !== -1) {
                    race.usersLikesRaces.splice(index, 1);
                    await race.save();
                    res.status(200).send(race);
                } else {
                    res.status(400).send('User has not liked this race.');
                }
            } else {
                res.status(404).send('Races not found.');
            }
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    // Comment endpoints
    // My comments in the Races
    router.get('/my_comments', async (req: Request, res: Response) => {
        const { author } = req.body;

        const races = await Races.find();
        if (races) {
            /*const userComments = races.reduce((acc, races) => {
                const comments: any = races.comments.filter(comment => comment.author === author);
                return acc.concat(comments);
            }, []);
            console.log(userComments);*/

            const userRaces = races.map(races => {
                const userComments = races.comments.filter(comment => comment.author === author);
                if (userComments.length > 0) {
                    return { ...races.toObject(), comments: userComments };
                } else {
                    return null;
                }
            }).filter(races => races !== null);
            
            res.status(200).send(userRaces);
        } else {
            res.status(404).send('No comments found.');
        }
    });

    // New Comment
    router.post('/new_comment/:racesId', async (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const racesId = req.params.racesId;
            const { comment } = req.body;
            const newComment = new Comment({ author: req.user.email, comment: comment, timestamp: new Date() });

            const race = await Races.findById(racesId)
            if (!race) {
                res.status(404).send('Race not found');
            } else {
                race.comments.push(newComment);
                race.save();
                console.log('Comment successfully created.');
                res.status(200).send(newComment);
            }
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    // Delete comment
    router.delete('/delete_comment/:racesId/:commentId', async (req: Request, res: Response) => {
        const { racesId, commentId } = req.params;

        const race = await Races.findById(racesId);
        if (race) {
            const updatedRace = await Races.findByIdAndUpdate(
                racesId,
                { $pull: { comments: { _id: commentId } } },
                { new: true }
            );
            res.status(200).send('Comment successfully deleted.');
        } else {
            res.status(404).send('Comment not found.');
        }
        
    });

    // Edit comment
    router.put('/edit_comment/:racesId/:commentId', async (req: Request, res: Response) => {
        const { racesId, commentId } = req.params;
        const { comment } = req.body;

        const race = await Races.findById(racesId);
        if (race) {
            const updatedRace = await Races.findOneAndUpdate(
                { _id: racesId, 'comments._id': commentId },
                { $set: { 'comments.$.comment': comment } },
                { new: true }
            );
            res.status(200).send('Comment successfully edited.');
        } else {
            res.status(404).send('Race or Comment not found.');
        }
    });

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

    return router;
}