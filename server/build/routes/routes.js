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
        const editors = req.body.editors;
        const viewers = req.body.viewers;
        const c_content = new content_1.Content({ owner: owner, title: title, content: content, editors: editors, viewers: viewers });
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
        const editors = req.body.editors;
        const viewers = req.body.viewers;
        const c_content = new content_1.Content({ owner: owner, title: title, content: content, editors: editors, viewers: viewers });
        c_content.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
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
    router.delete('/deleteUser', (req, res) => {
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
    return router;
};
exports.configureRoutes = configureRoutes;
