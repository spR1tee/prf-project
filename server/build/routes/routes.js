"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const user_1 = require("../model/user");
const content_1 = require("../model/content");
const configureRoutes = (passport, router) => {
    router.get('/', (req, res) => {
        res.status(200).send('Hello, World!');
    });
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (error, user) => {
            if (error) {
                console.log(error);
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
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });
    router.post('/logout', (req, res) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.post('/register', (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const user = new user_1.User({ email: email, password: password });
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    router.post('/saveNewContent', (req, res) => {
        const owner = req.body.owner;
        const title = req.body.title;
        const content = req.body.content;
        let editors = req.body.editors;
        const splitted = editors.toString().split(",");
        let viewers = req.body.viewers;
        const splitted_2 = viewers.toString().split(",");
        const c_content = new content_1.Content({ owner: owner, title: title, content: content, editors: splitted, viewers: splitted_2 });
        c_content.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    router.post('/updateContent', (req, res) => {
        const owner = req.body.owner;
        const title = req.body.title;
        const content = req.body.content;
        let editors = req.body.editors;
        const splitted = editors.toString().split(",");
        let viewers = req.body.viewers;
        const splitted_2 = viewers.toString().split(",");
        const id = req.query.id;
        const c_content = new content_1.Content({ owner: owner, title: title, content: content, editors: splitted, viewers: splitted_2 });
        const query = content_1.Content.updateOne({ id: id }, { $set: {
                owner: owner,
                title: title,
                content: content,
                editors: splitted,
                viewers: splitted_2
            } });
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send('Internal server error.');
        });
    });
    router.get('/getAllContent', (req, res) => {
        if (req.isAuthenticated()) {
            const query = content_1.Content.find();
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
    router.get('/getAllUsers', (req, res) => {
        if (req.isAuthenticated()) {
            const query = user_1.User.find();
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
    router.delete('/deleteContent', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = content_1.Content.deleteOne({ title: id });
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
    router.get('/checkAuth', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        }
        else {
            res.status(500).send(false);
        }
    });
    router.get('/getUser', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send([req.user]);
        }
        else {
            res.status(500).send("User is not authenticated");
        }
    });
    router.get('/getUserById', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = user_1.User.findOne({ _id: id });
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
    router.get('/getOwnedContent', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = content_1.Content.find({ owner: id });
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
    router.get('/getEditContent', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = content_1.Content.find({ editors: { $in: [id] } });
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
    router.get('/getViewContent', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = content_1.Content.find({ viewers: { $in: [id] } });
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
    return router;
};
exports.configureRoutes = configureRoutes;
