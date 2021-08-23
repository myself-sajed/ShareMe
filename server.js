const express = require('express');
const path = require('path');
const multer = require('multer')
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config();

// Configurations for "body-parser"
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + Math.round(Math.random() * 10000000) + path.extname(file.originalname)) //Appending extension
    }
})

var upload = multer({ storage: storage });


// Public
app.use(express.static(path.join(__dirname, '/public')))


// Views
app.set('views', path.join(__dirname + '/views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})


app.post('/file/upload', upload.single('uploaded_file'), (req, res) => {
    console.log(req.file);
    if (req.file.size > 1000) {
        var size = req.file.size;
    }
    else {
        var size = req.file.size / 1024;
    }
    const fileInfo = {
        filename: req.file.filename,
        size: size,
        title: 'Your link is ready',
        svgName: 'downloadGet.svg'
    }
    res.render('show', { file: fileInfo })
})

app.get('/file/upload/download/:filename', (req, res) => {



    const fileInfo = {
        filename: req.params.filename,
        size: '',
        title: 'Download your file',
        svgName: 'downloadPost.svg'
    }
    res.render('show', { file: fileInfo })

})

app.get('/file/upload/downloadNow/:filename', (req, res) => {
    res.download(`./uploads/${req.params.filename}`)
})




app.listen(5000, function () {
    console.log('Listening on port 5000');
})