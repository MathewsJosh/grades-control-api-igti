//Pega a dependencia importada e a instancia na linha seguinte
var express = require("express");
var router = express.Router();

var fs = require("fs").promises;
const filePath = "./json/grades.json";


/** 1 - Crie um endpoint para criar uma grade. Este endpoint deverá receber como parâmetros os campos student, subject, type e value conforme 
 * descritos acima. Essa grade deverá ser salva no arquivo grades.json, e deverá ter um id único associado. 
 * No campo timestamp deverá ser salvo a data e hora do momento da inserção. 
 * O endpoint deverá retornar o objeto da grade que foi criada. A API deverá garantir o incremento automático desse identificador, 
 * de forma que ele não se repita entre os registros. 
 * Dentro do arquivo grades.json que foi fornecido para utilização no desafio, o campo nextId já está com um valor definido. 
 * Após a inserção é preciso que esse nextId seja incrementado e salvo no próprio arquivo, de forma que na próxima inserção ele possa ser utilizado.
 */
router.post("/creategrade", async (req, res) => {
    try {
        let grade = req.body;
        let data = await fs.readFile(filePath, "utf8");
        const json = JSON.parse(data);

        grade = { id: json.nextId++, ...grade };
        grade.timestamp = `${new Date().toISOString()}`;

        json.grades.push(grade);
        await fs.writeFile(filePath, JSON.stringify(json));
        res.send(grade);
    } catch (error) {
        res.send("To chegando com os ERROR rapaziada!");
    }
});







//exporta o arquivo para permitir a importação dele lá em index.js
module.exports = router;