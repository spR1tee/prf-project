import { Router, Request, Response, NextFunction } from "express";
import { PassportStatic } from 'passport';
import { User } from '../model/user';
import { Content } from '../model/content';
import client from 'prom-client'; // Importáljuk a prom-client csomagot
 
// Kérés időtartam mérése histogrammal
const httpRequestDurationMicroseconds = new client.Histogram({
     name: 'http_request_duration_ms', 
     help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code'] 
});

export const configureRoutes = (passport: PassportStatic, router: Router): Router => {
     // Middleware a metrikák gyűjtéséhez 
    router.use((req: Request, res: Response, next: NextFunction) => { 
        const end = httpRequestDurationMicroseconds.startTimer(); 
        res.on('finish', () => { 
            end({ route: req.route?.path || '', method: req.method, status_code: res.statusCode }); 
        }); 
        next(); 
    });

    // Metrikák végpontja
    router.get('/metrics', async (req: Request, res: Response) => { 
        try { 
            res.set('Content-Type', client.register.contentType); 
            res.end(await client.register.metrics()); 
        } catch (ex) { 
            res.status(500).end(ex); 
        }
    });
 
    router.get('/', (req: Request, res: Response) => {
        res.status(200).send('Hello, World!');
    });

    router.get('/', (req: Request, res: Response) => {
        res.status(200).send('Hello, World!');
    });

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User) => {
            if (error) {
                console.log(error);
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
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });


    router.post('/register', (req: Request, res: Response) => {
        console.log("helo");
        const email = req.body.email;
        const password = req.body.password;
        const user = new User({email: email, password: password});
        console.log("hello");
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        })
    });

    router.post('/saveNewContent', (req: Request, res: Response) => {
        const owner = req.body.owner;
        const title = req.body.title;
        const content = req.body.content;
        let editors = req.body.editors;
        const splitted = editors.toString().split(",");
        let viewers = req.body.viewers;
        const splitted_2 = viewers.toString().split(",");
        const c_content = new Content({owner: owner, title: title, content: content, editors: splitted, viewers: splitted_2});
        c_content.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        })
    });

    router.post('/updateContent', (req: Request, res: Response) => {
        const owner = req.body.owner;
        const title = req.body.title;
        const content = req.body.content;
        let editors = req.body.editors;
        const splitted = editors.toString().split(",");
        let viewers = req.body.viewers;
        const splitted_2 = viewers.toString().split(",");
        const id = req.query.id;
        const c_content = new Content({owner: owner, title: title, content: content, editors: splitted, viewers: splitted_2});
        const query = Content.updateOne(
            { id : id },
            { $set: { 
                owner : owner,
                title : title,
                content : content,
                editors : splitted,
                viewers : splitted_2    
            }}
        );
        query.then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.log(error);
            res.status(500).send('Internal server error.');
        })
    });

    router.get('/getAllContent', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = Content.find();
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

    router.delete('/deleteContent', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = Content.deleteOne({title: id});
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


    router.get('/checkAuth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);            
        } else {
            console.log("error check auth");
            res.status(500).send(false);
        }
    });

    router.get('/getUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send([req.user]);            
        } else {
            res.status(500).send("User is not authenticated");
        }
    });

    router.get('/getUserById', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = User.findOne({_id: id});
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

    router.get('/getOwnedContent', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = Content.find({owner: id});
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

    router.get('/getEditContent', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = Content.find({editors: { $in: [id] }});
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

    router.get('/getViewContent', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = Content.find({viewers: { $in: [id] }});
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

    return router;
}