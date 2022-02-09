import fs from 'fs';
import readline from 'readline';

const searchingIPs = [
    '89.123.1.41',
    '34.48.240.111',
];

async function readLogs() {
    // запускаем поток чтения файла с логами
    const fileStream = fs.createReadStream('access.log');
    // открываем интерфейс построчного чтения
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    
    // Нашел подобный цикл в документации, я так понял это тот 
    // самый асинхронный цикл, о котором вы упоминали на уроке
    for await (const line of rl) {
        const ip = line.match(/\d+\.\d+\.\d+\.\d+/)?.[0];
        if (searchingIPs.includes(ip)) {
            fs.writeFile(`${ip}_requests.log`, line + '\n', {flag: 'a'}, () => {});
        }
    }
}
  
  readLogs();