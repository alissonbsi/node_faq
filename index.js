const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

// Database

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados.")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

//Para o Express usar o EJS como View Engine (Renderizador de HTML)
app.set('view engine', 'ejs')
app.use(express.static('public'));
// Body parser
app.use(bodyParser.urlencoded({extended: false})); //Permitirá enviar os dados do formulário decodificando os dados enviados pelo usuário.
app.use(bodyParser.json()); //permite ler dados dos usuários via json

// Rotas
app.get("/", (req, res) => {
    Pergunta.findAll({raw: true, order: [
        ['id', 'DESC']
    ]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    });    
});    

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});    

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
            });   
        });
        }else{
            res.render("notFound");
        }
    });
});    

app.post("/saveQuestion", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    })
});    

app.post("/saveAnswer", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.perguntaId;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);
    })
});

app.listen(8080, ()=>{
    console.log("App rodando!");
});