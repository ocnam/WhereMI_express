var express = require('express');
var app = express();


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


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

