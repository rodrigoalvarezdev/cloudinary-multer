const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const { create } = require('express-handlebars');

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs')

const exphbs = create({
    extname: '.hbs',
    layoutsDir: path.join(app.get('views'), 'layout'),
    partialsDir: path.join(app.get('views'), 'partials'),
    defaultLayout: 'main'
});

app.engine('.hbs', exphbs.engine);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/upload'),
    filename: (req, file, cb)=>{
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});
app.use(multer({
    storage
}).single('image'));

app.use(require('./routes/index.routes'));

module.exports = app;