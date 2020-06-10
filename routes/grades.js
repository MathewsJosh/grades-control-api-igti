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

        grade = {
            id: json.nextId++,
            ...grade
        };
        grade.timestamp = `${new Date().toISOString()}`;

        json.grades.push(grade);
        await fs.writeFile(filePath, JSON.stringify(json));
        res.send(grade);
    } catch (error) {
        res.status(500).send(err.message);
    }
});

/** 2 - Crie um endpoint para atualizar uma grade. Esse endpoint deverá receber como parâmetros o id da grade a ser alterada 
 * e os campos student, subject, type e value. O endpoint deverá validar se a grade informada existe, caso não exista deverá 
 * retornar um erro. Caso exista, o endpoint deverá atualizar as informações recebidas por parâmetros no registro, e realizar sua 
 * atualização com os novos dados alterados no arquivo grades.json.
 */
router.put("/updatestudent", async (req, res) => {
    try {
        let grade = req.body;
        let data = await fs.readFile(filePath, "utf8");
        const json = JSON.parse(data);

        let index = json.grades.findIndex(ac => ac.id === grade.id);

        if (index !== undefined && index<=json.grades.length && index!==-1) { 
            //Não especificou se era para manter o timestamp antigo ou setar um novo
            //então foi colocado um novo
            grade.timestamp = `${new Date().toISOString()}`;

            json.grades[index] = grade;
            await fs.writeFile(filePath, JSON.stringify(json));
            res.send(grade);
        } else{
            res.status(404).send("Registro não encontrado");
        }

    } catch (error) {
        res.status(500).send(err.message);
    }
});


/** 3 - Crie um endpoint para excluir uma grade. Esse endpoint deverá receber como parâmetro o id da grade 
 * e realizar sua exclusão do arquivo grades.json.
 */
router.delete("/:id", async (req, res) => {
    try{
        let data = await fs.readFile(filePath, "utf8");
        const json = JSON.parse(data);

        const grade = json.grades.find(c => c.id === parseInt(req.params.id));

        if (grade === undefined)
            res.status(404).send("Registro não encontrado");
        
        json.grades = json.grades.filter(gr => gr.id != grade.id);

        await fs.writeFile(filePath, JSON.stringify(json));

        res.send(`Registro ${grade.id} excluído`);
    }catch (err) {
        res.status(500).send(err.message);
    }
});

/** 4 - Crie um endpoint para consultar uma grade em específico. Esse endpoint deverá receber como parâmetro o id da grade 
 * e retornar suas informações. 
 */
router.get("/:id", async (req, res) => {
    try {
        let data = await fs.readFile(filePath, "utf8");
        const json = JSON.parse(data);

        const grade = json.grades.find(c => c.id === parseInt(req.params.id));

        if (grade === undefined)
            res.status(404).send("Registro não encontrado");

        res.send(JSON.stringify(grade));

    } catch (err) {
        res.status(500).send(err.message);
    }
});

/** 5 - Crie um endpoint para consultar a nota total de um aluno em uma disciplina. O endpoint deverá receber como parâmetro 
 * o student e o subject, e realizar a soma de todas as notas de atividades correspondentes àquele subject, para aquele student. 
 * O endpoint deverá retornar a soma da propriedade value dos registros encontrados.
 */
router.post("/consultgrade", async (req, res) => {
    try {
        const grade = req.body;

        let data = await fs.readFile(filePath, "utf8");
        const json = JSON.parse(data);           

        var grades = json.grades.filter(gr =>
            gr.student.toLowerCase() === grade.student.toLowerCase()
            && gr.subject.toLowerCase() === grade.subject.toLowerCase()
        );
        
        const soma  = grades.reduce((acc, cur)=>acc + cur.value, 0);        
        res.send(`Nota encontrada: ${soma}`);
    } catch (err) {
        res.status(500).send(err.message+"Ex5");
    }
});

/** 6 - Crie um endpoint para consultar a média das grades de determinado subject e type. 
 * O endpoint deverá receber como parâmetro um subject e um type, e retornar a média. 
 * A média é calculada somando o registro value de todos os registros que possuem o subject e type informados, 
 * dividindo pelo total de registros que possuem este mesmo subject e type.
 */
router.post("/averagegrade", async (req, res) => {
    try {
        const grade = req.body;

        let data = await fs.readFile(filePath, "utf8");
        const json = JSON.parse(data);    

         var grades = json.grades.filter(gr =>
            gr.subject.toLowerCase() === grade.subject.toLowerCase()
            && gr.type.toLowerCase() === grade.type.toLowerCase()
        );
        
        const soma  = grades.reduce((acc, cur)=>acc + cur.value, 0);
        
        const media = soma / grades.length;
        
        res.send(`Média encontrada: ${media}`); 

    } catch (err) {
        res.status(500).send(err.message+"Ex6");
    }
});

/** 7 - Crie um endpoint para retornar as três melhores grades de acordo com determinado subject e type. 
 * O endpoint deve receber como parâmetro um subject e um type, e retornar um array com os três registros de maior value 
 * daquele subject e type. A ordem deve ser do maior para o menor.
 */
router.post("/better3grades", async (req, res) => {
    try {
        const grade = req.body;

        let data = await fs.readFile(filePath, "utf8");
        const json = JSON.parse(data); 

        var grades = json.grades.filter(gr =>
            gr.subject.toLowerCase() === grade.subject.toLowerCase()
            && gr.type.toLowerCase() === grade.type.toLowerCase()
        );

        grades = grades.sort((a, b) => b.value - a.value).slice(0, 3);

        res.send(JSON.stringify(grades));

    } catch (err) {
        res.status(500).send(err.message);
    }
});

//exporta o arquivo para permitir a importação dele lá em index.js
module.exports = router;