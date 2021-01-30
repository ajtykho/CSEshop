const path = require('path');
const PORT = process.env.PORT || 5000

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

 app.use((req, res, next) => {
     User.findById('6015d903dbfe5a4c38f4ded7')
      .then(user => {
        req.user = user;
         next();
       })
      .catch(err => console.log(err));
  });

app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://ajtykho:Winkie24@cluster0.efjkr.mongodb.net/shop?retryWrites=true&w=majority'
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
    app.listen(3000);
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

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://ajtykho:Winkie24@cluster0.efjkr.mongodb.net/Cluster0?retryWrites=true&w=majority";

// mongoConnect((client) => {
//     console.log("app is on local host");
//     app.listen(3000);
// });