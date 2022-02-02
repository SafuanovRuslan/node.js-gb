import colors from 'colors';

function showSimples(min, max) {
    if (isNaN(+min) || isNaN(+max)) {
        console.log(new Error('function takes only numbers'));
        return;
    }

    let simpleExist = false;

    for (let i = min; i <= max; i++) {
        if (isSimple(i)) {
            console.log(highlightNumber(i));
            simpleExist = true;
        }
    }

    if (!simpleExist) {
        console.log(colors.red('No simple numbers in this range'));
    }
}

function isSimple(num) {
    for (let i = 2; i < num; i++) {
        if (num % i == 0) return false;
    }

    return true;
}

function highlightNumber(num) {
    switch (highlightNumber.count % 3) {
        case 0:
            highlightNumber.count++;
            return colors.red(num);
        case 1:
            highlightNumber.count++;
            return colors.yellow(num);
        case 2:
            highlightNumber.count++;
            return colors.green(num);
    }
}

highlightNumber.count = 0;

showSimples(process.argv[2], process.argv[3]);