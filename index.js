//Dentro do Projeto:
// npm init
// npm install express
// nodemon "name"."ext"
// nodemon --experimental-modules index.js      //se o comando de cima nao funcionar, usar esse!

/* OBS: O Nodemon buga no json ao ser alterado, recomendando criar um arquivo:
nodemon.json com o conteúdo:
{   "ignore" : ["*.json"]   } */


const express = require("express");
const fs = require("fs").promises; //As funções fs sempre retornarão promises
const app = express();