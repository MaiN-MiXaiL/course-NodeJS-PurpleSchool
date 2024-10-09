const builder = require('xmlbuilder');
const fs = require('fs');
const path = require('path');

var root = builder.create('gameList', {version: '1.0', encoding: 'UTF-8'});

const TypeBoxEnum = {
    nes: 'nes', 
    sega: 'sega',
    ps1: 'ps1',
}

// !!!НАСТРОЙКИ ВНОСИМЫЕ ВРУЧНУЮ!!!
let i = 1260; // Начальный идентификатор
const typeBox = TypeBoxEnum.ps1; // Тип приставки
const dir = 'H:/Install/Игры на приставку/reserv/ps1'; // Путь к директории с играми
const dirImg = 'H:/Install/Игры на приставку/reserv/ps1/images'; // Путь к изображениям

// !!!ДАЛЕЕ НЕ ТРОГАЕМ!!!
let videoId, classType, gameType;

switch (typeBox) {
    case 'nes':
        extFile = ['.nes'];
        videoId = 0;
        classType = 0;
        gameType = 2;
        timer = 'nes';
        break;
    case 'ps1':
        extFile = ['.img', '.bin']; 
        videoId = 7;
        classType = 7;
        gameType = 0;
        // videoId = 9;
        // classType = 9;
        // gameType = 0;
        timer = 'psx';
        break;
}

const files = fs.readdirSync(dir);
const images = fs.readdirSync(dirImg);

// Чтение всех файлов в директории
files.forEach(file => {
    const { name, ext } = path.parse(file);
    const fnExt = extFile.find(x => x === ext);

    if (!fnExt) return;

    const imgName = images.find(x => path.parse(x).name === name);
    const numStr = i.toString().padStart(5, '0');

    var game = root.ele('game');
    game.ele('gameid', numStr);
    game.ele('path', name + fnExt);
    game.ele('image', imgName ? `./images/${imgName}` : undefined);
    game.ele('video_id', videoId);
    game.ele('class_type', classType);
    game.ele('game_type', gameType);
    game.ele('timer', timer);
    game.ele('en_US', `${numStr} ${name}`);
    game.ele('ru_RU', `${numStr} ${name}`);
    game.ele('name', `${numStr} ${name}`);
    i++;
});

var xml = root.end({ pretty: true});

fs.writeFileSync("./gamelist.xml", xml, function (err) {
    if (err) throw err;
});
