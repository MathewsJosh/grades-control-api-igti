//Dentro do Projeto:
// npm init
// npm install express
// nodemon "name"."ext"
// nodemon --experimental-modules index.js      //se o comando de cima nao funcionar, usar esse!

/* OBS: O Nodemon buga no json ao ser alterado, recomendo criar um arquivo: nodemon.json com o conteúdo:
{   "ignore" : ["*.json"]   } */

//Importamos o express, fs para leitura e escrita de arquivos e o arquivo grades.js
const express = require("express");
const fs = require("fs").promises; //Nesse caso, a fs sempre retornará promises
const gradesRouter = require("./routes/grades.js");

//Variáveis fixas
const filePath = "./json/grades.json";
const portaHTTP = 3000;

//Com essa linha, poderemos editar responses para o método post a partir de qualquer requisiçao
const app = express();
app.use(express.json());

//Rotas
app.use("/", gradesRouter);

//Código que fica "ouvindo" a porta 3000 esperando alguma requisição ser executada
app.listen(portaHTTP, ()=>{
});