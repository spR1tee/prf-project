"use strict";
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
const user_1 = require("../model/user");
const content_1 = require("../model/content");
const prom_client_1 = __importDefault(require("prom-client"));
// Kérés időtartam mérése histogrammal
const httpRequestDurationMicroseconds = new prom_client_1.default.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code']
});
const configureRoutes = (passport, router) => {
    // Middleware a metrikák gyűjtéséhez 
    router.use((req, res, next) => {
        const end = httpRequestDurationMicroseconds.startTimer();
        res.on('finish', () => {
            var _a;
            end({ route: ((_a = req.route) === null || _a === void 0 ? void 0 : _a.path) || '', method: req.method, status_code: res.statusCode });
        });
        next();
    });
    router.get('/', (req, res) => {
        res.status(200).send('Hello, World!');
    });
    router.get('/metrics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.set('Content-Type', prom_client_1.default.register.contentType);
            res.end(yield prom_client_1.default.register.metrics());
        }
        catch (ex) {
            res.status(500).end(ex);
        }
    }));
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
        console.log("helo");
        const email = req.body.email;
        const password = req.body.password;
        const user = new user_1.User({ email: email, password: password });
        console.log("hello");
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
            console.log("error check auth");
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
