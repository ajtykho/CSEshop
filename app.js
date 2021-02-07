const path = require('path');
const PORT = process.env.PORT || 5000

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');


const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://ajtykho:Winkie24@cluster0.efjkr.mongodb.net/Cluster0?retryWrites=true&w=majority';


const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
app.use('/', authRoutes);

app.use(errorController.get404);

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://ajtykho:Winkie24@cluster0.efjkr.mongodb.net/Cluster0?retryWrites=true&w=majority";

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};

mongoose
  .connect(
    MONGODB_URL,
    options
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Ali',
          email: 'ali@test.com',
          cart: {
            items: []
          }
        });
        req.user = user;
        user.save();
      }
    });
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });

//add-ins from prove04
const cors = require('cors') // Place this with other requires (like 'path' and 'express')

const corsOptions = {
    origin: "https://class-shop-341.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));




// mongoConnect((client) => {
//     console.log("app is on local host");
//     app.listen(3000);
// });