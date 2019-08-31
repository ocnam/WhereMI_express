var express = require('express');
var app = express();

var cloudinary = require('cloudinary').v2;  //integrazione clip audio (cloudinary.com)

//Setup per metodo POST
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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
  //dati della clip
  var rawClip = req.body.clip;
  var durata = req.body.durata;
  var orario = req.body.orario;

  //upload su server cloudinary
  cloudinary.uploader.upload(rawClip, { 
    resource_type: "video",
    public_id: "clipAudio/myClip_("+durata+"s)_h" + orario,
  },
  function(error, result) {
    console.log(result, error);
    if(error){
      res.send ("error upload to cloud server");
    }else{
      res.send ("200 OK - " + result.public_id);  //restituisce client esito positivo
    }
  });
});