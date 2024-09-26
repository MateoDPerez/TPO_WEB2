const express = require('express');
const translate = require('node-google-translate-skidz');
const {Translate} = require("node-google-translate-skidz");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json())

app.get("/traducir/:texto", (req, res)=>{
    const cultura = req.body.cultura;
    const titulo = req.body.titulo;
    const dinastia = req.body.dinastia;
    translate({
        text: req.params.texto,
        source: "en",
        target: "es"
    }, function(result){
        console.log(result);
    });

    res.json({textoTraducido: result.trasnslatedText});
});

app.listen(port, () =>{
    console.log('Server is running on port $(port)');
});