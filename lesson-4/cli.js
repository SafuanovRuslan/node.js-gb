import fs from 'fs';
import path from 'path';
import readline from 'readline';
import inquirer from 'inquirer';
import commonjsVariables from 'commonjs-variables-for-esmodules';
 
const { __dirname } = commonjsVariables(import.meta); // type: module, почему-то в таком режиме нет __dirname


let curentPath = __dirname
let list; 

updateList(curentPath);


function updateList(newPath) {
    curentPath = newPath;
    if ( !fs.lstatSync(curentPath).isFile() ) {
        list = fs.readdirSync(curentPath);
    }
}

async function search() {
    inquirer
        .prompt([
                {
                    type: 'list',
                    name: 'path',
                    message: 'Выберите файл или директорию: ',
                    choices: ['../', ...list],
                },
            ])
        .then((answer) => {
            updateList(path.resolve(curentPath, answer.path));

            if ( fs.lstatSync(curentPath).isFile() ) {
                inquirer
                    .prompt([
                            {
                                type: 'input',
                                name: 'pattern',
                                message: 'Укажите искомую строку: ',
                            },
                        ])
                    .then((answer) => {
                        readFile(curentPath, answer.pattern)
                    });
            } else {
                console.log(curentPath);
                search();
            }
        });
}

search();

async function readFile(curentPath, pattern) {
    // запускаем поток чтения файла с логами
    const fileStream = fs.createReadStream(curentPath);
    // открываем интерфейс построчного чтения
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let reg = RegExp(pattern, 'ig');
    
    // Нашел подобный цикл в документации, я так понял это тот 
    // самый асинхронный цикл, о котором вы упоминали на уроке
    for await (const line of rl) {
        const string = line.match(reg);
        if (string) {
            console.log(line);
        }
    }
}