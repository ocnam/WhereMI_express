var express = require('express');
var app = express();

var cloudinary = require('cloudinary').v2;  //integrazione clip audio (cloudinary.com)

//Setup per metodo POST
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb', extended: true})); // support json encoded bodies
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); // support encoded bodies

// DOVE CERCARE I FILE STATICI
app.use(express.static( __dirname + "/public" ));

// ROUTE PER PAGINA INDEX
app.get('/', (req, res)=>{
  res.sendFile('Index.html', {root: __dirname + "/views"});
});

/// ROUTE PER PAGINA BROWSER.HTML
app.get('/browser', (req, res)=>{
  res.sendFile( 'Browser.html', {root: __dirname + "/views"});
});

/// ROUTE PER PAGINA EDITOR.HTML
app.get('/editor', (req, res)=>{
  res.sendFile( 'Editor.html', {root: __dirname + "/views"});
});

// START SERVER
app.listen(3000, function () {
  console.log('Sto ascoltando sulla porta 3000!\n\n\n');
});

cloudinary.config({
  cloud_name: 'tecweb19',
  api_key: '169481168225682',
  api_secret: 'o7d9GsJ0A-jWNUogb4vPSnpT6EA'
});

// API Upload to cloudinary (POST /api/audioclip)
app.post('/api/audioclip', function(req, res) {
  var rawClip = req.body.clip;
  var durata = req.body.durata;
  var orario = req.body.orario;
  var data = req.body.data;
  var titolo = req.body.titolo;
  var metadati = req.body.metadati;
  var posizione = req.body.posizione;

  console.log(orario);

  //upload su server cloudinary
  cloudinary.uploader.upload(rawClip, {
    resource_type: "video",
    upload_preset: "toMp4",
    tags: [metadati],
    public_id: titolo + ":8FPHFC5J+7W",
    context: {
      alt: metadati,
      caption: titolo
    }
  },
  function(error, result) {
    console.log(result, error);
    if(!error){
      res.send ({
        ack:"200 OK",
        url: result.secure_url,
        titolo: result.public_id
      });
    }else{
      res.send ("error upload to cloud server");
    }
  });
});
