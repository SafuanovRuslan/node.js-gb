'use strict';

// Импорт events
import EventEmitter from 'events';
const emitter = new EventEmitter();

// регистрация обработчиков
emitter.on('timerStart', () => {
    const timer = process.argv[2];
    const timestamp = getSeconds(timer);

    tick(timestamp);
});

emitter.on('timerStop', () => {
    console.log('Время вышло');
});

// генерация события timerStart
emitter.emit('timerStart');


/**
 * Ежесекундно выводит текущее состояние таймера
 * При окончании времени таймера генерирует событие timerStop
 * @param {number} timestamp общее количество секунд на таймере
 */
function tick(timestamp) {
        if (timestamp) {
            console.log( makeTimer(timestamp) );
            setTimeout(tick, 1000, timestamp - 1);
        } else {
            emitter.emit('timerStop');
        }
}

/**
 * Преобразует переданный таймер в таймстамп
 * @param {string} строка формата 'ss-mm-hh-dd-MM-YYYY'
 * @returns {number} число, равное общему количеству секунд в полученном таймере
 */
function getSeconds(timer) {
    let [s, m, h, d, M, Y] = timer.split('-');

    // переводим всё в секунды и получаем таймстамп
    let time = +s +
            +m * 60 +
            +h * 3600 +
            +d * 24 * 3600 +
            +M * 30 * 24 * 3600 + // принимаем 1 мес равным 30 дням
            +Y * 365 * 24 * 3600  // принимаем 1 год равным 365 дням

    return time;
}

/**
 * Преобразует таймстамп (в секундах) в формат ss-mm-hh-dd-MM-YYYY
 * @param {num} time время в виде числа секунд
 * @returns {string} ss-mm-hh-dd-MM-YYYY
 */
function makeTimer(time) {
    let Y = Math.floor(time / (365 * 24 * 3600));
    Y = formatTime(Y, 4);
    time -= Y * 365 * 24 * 3600;

    let M = Math.floor(time / (30 * 24 * 3600));
    M = formatTime(M, 2);
    time -= M * 30 * 24 * 3600;

    let d = Math.floor(time / (24 * 3600));
    d = formatTime(d, 2);
    time -= d * 24 * 3600;

    let h = Math.floor(time / (3600));
    h = formatTime(h, 2);
    time -= h * 3600;

    let m = Math.floor(time / (60));
    m = formatTime(m, 2);
    time -= m * 60;

    let s = time;
    s = formatTime(s, 2);

    const timer = [s, m, h, d, M, Y].join('-');

    return timer;
}

/**
 * Добавляет числу ведущие нули при необходимости
 * @param {number, string} num целевое число для форматирования
 * @param {number} length длина итоговой строки
 * @returns {string} число в виде строки с ведущими нулями '0003'
 */
function formatTime(num, length) {
    num = String(num);

    while (num.length < length) {
        num = '0' + num;
    }

    return num;
}