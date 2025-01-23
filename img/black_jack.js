//Firefox44.0，如果再來一局功能用location.reload()實現，則必須帶上這兩句話
//document.getElementById("hit").disabled = false;
//document.getElementById("stand").disabled = false;


//遊戲邏輯：ＪＱＫ接當作10點，Ａ可當作１點或是11點，點數大者獲勝，若超過21則直接判定為輸

let counter = 0; //發牌次數，用於計算抽牌庫的第幾張牌
let winner = ''; //記錄勝利者 player1為電腦;player2為玩家
let hasStood = false; //標記玩家是否已經不要牌

//所有的牌 club:梅花，diamond菱形，heart愛心，spade黑桃
let cards = [
    'club01', 'club02', 'club03', 'club04', 'club05', 'club06', 'club07',
    'club08', 'club09', 'club10', 'club11', 'club12', 'club13', 'diamond01',
    'diamond02', 'diamond03', 'diamond04', 'diamond05', 'diamond06', 'diamond07',
    'diamond08', 'diamond09', 'diamond10', 'diamond11', 'diamond12', 'diamond13',
    'heart01', 'heart02', 'heart03', 'heart04', 'heart05', 'heart06', 'heart07',
    'heart08', 'heart09', 'heart10', 'heart11', 'heart12', 'heart13',
    'spade01', 'spade02', 'spade03', 'spade04', 'spade05', 'spade06', 'spade07',
    'spade08', 'spade09', 'spade10', 'spade11', 'spade12', 'spade13'
];

//生成1~52亂數
let getRand = function (begin, end) {
    return Math.floor(Math.random() * (end - begin)) + begin;
}
console.log(Math.floor);
//洗牌
let rand, tmp;
for (let i = 0; i < 1000; i++) {
    rand = getRand(1, 52);
    tmp = cards[0];
    cards[0] = cards[rand];
    cards[rand] = tmp;
}

//玩家手牌
let cards1 = [getNewCard(), getNewCard()]; //電腦兩張手牌
let cards2 = [getNewCard(), getNewCard()]; //玩家兩張手牌


//將手牌顯示於畫面中
let table = document.getElementById('tableboard');
table.rows[0].cells[1].innerHTML = '<img src="resource/cardback.jpg">'; //第一張牌必須是蓋排的
table.rows[0].cells[2].innerHTML = '<img src="resource/' + cards1[1] + '.jpg">';
table.rows[1].cells[1].innerHTML = '<img src="resource/' + cards2[0] + '.jpg">';
table.rows[1].cells[2].innerHTML = '<img src="resource/' + cards2[1] + '.jpg">';
showScore();

//獲取一張新牌
function getNewCard(player) {
    let card = cards[counter++]; //抽取的卡為牌堆中第(發牌的次數加1)張卡


    //這段只有按加牌會執行
    if (player == 'player1') { //電腦抽牌
        let len = cards1.length;
        cards1[len] = card; //將抽的卡塞在最後一個位置
        table.rows[0].cells[len + 1].innerHTML =
            '<img src="resource/' + cards1[len] + '.jpg">';
    } else if (player == 'player2') { //玩家抽牌
        let len = cards2.length;
        cards2[len] = card;
        table.rows[1].cells[len + 1].innerHTML =
            '<img src="resource/' + cards2[len] + '.jpg">';
    }


    return card;
}




//玩家再要一張牌
function hit() {
    getNewCard('player2');

    if (checkBust('player2')) {
        document.getElementById('bulletin').innerHTML = '你爆了 (You BUST!)';
        document.getElementById('hit').disabled = true;
        document.getElementById('stand').disabled = true;
        winner = 'player1';
    }

    showScore();
}


//判斷當前情況是否爆掉，回傳true表示爆掉
function checkBust(player) {
    let result = 0;
    if (player == 'player1') {
        for (let i = 0; i < cards1.length; i++) {
            //parseInt一定要指定10進制，否則IE8下報錯
            let c = parseInt(cards1[i].substring(cards1[i].length - 2), '10');
            if (c > 10) {
                c = 10;
            }
            result += c;
        }
        if (result > 21) {
            return true;
        } else {
            return false;
        }
    } else if (player == 'player2') {
        for (let i = 0; i < cards2.length; i++) {
            let c = parseInt(cards2[i].substring(cards2[i].length - 2), '10');
            if (c > 10) {
                c = 10;
            }
            result += c;
        }
        if (result > 21) {
            return true;
        } else {
            return false;
        }
    }
}

//計算一名玩家的得分分數
function calcResult(player) {
    let result = 0;
    let countOfA = 0;
    if (player == 'player1') {
        for (let i = 0; i < cards1.length; i++) {
            let c = parseInt(cards1[i].substring(cards1[i].length - 2), '10'); //從倒數第二位開始取值
            if (c > 10) {
                c = 10;
            } else if (c == 1) {
                countOfA++;
            }
            result += c;
        }
        for (let i = 0; i < countOfA; i++) {
            if (result + 10 <= 21) {
                result += 10;
            } else {
                break;
            }
        }
    } else if (player == "player2") {
        for (let i = 0; i < cards2.length; i++) {
            let c = parseInt(cards2[i].substring(cards2[i].length - 2), "10"); //從第cards2[i].length - 2個位置開始擷取
            if (c > 10) {
                c = 10;
            } else if (c == 1) {
                countOfA++;
            }
            result += c;
        }
        for (let i = 0; i < countOfA; i++) {
            if (result + 10 <= 21) {
                result += 10;
            } else {
                break;
            }
        }
    }
    return result;
}

function showScore() {
    let result1 = calcResult('player1');
    let result2 = calcResult('player2');
    document.getElementById('score').innerHTML =
        '[Computer : You = ' + (hasStood == true ? result1 : '?') + ' : ' + result2 + ']';
    // hasStood == true 成立時顯示result1，否則顯示問號  
}

//玩家選擇不要了
function stand() {
    hasStood = true;
    document.getElementById('hit').disabled = true; //將加牌按鈕禁用
    document.getElementById('stand').disabled = true; //將不要加牌按鈕禁用
    table.rows[0].cells[1].innerHTML = '<img src="resource/' + cards1[0] + '.jpg">';
    //電腦開始要牌
    while (calcResult('player1') < getRand(16, 19)) {
        getNewCard('player1');
        if (checkBust('player1')) {
            document.getElementById('bulletin').innerHTML = '電腦爆了 (Computer BUST!)';
            winner = 'player2';
        }
    }
    //如兩名玩家都未爆掉，則以分數高者為勝
    if (winner == '') {
        let result1 = calcResult('player1');
        let result2 = calcResult('player2');

        if (result1 == result2) {
            document.getElementById('bulletin').innerHTML = '平局 (PUSH!)';
        } else if (result1 > result2) {
            document.getElementById('bulletin').innerHTML = '你輸了 (You LOSE)';
        } else if (result1 < result2) {
            document.getElementById('bulletin').innerHTML = '你贏了 (You WIN!)';
        }
    }
    showScore();
}




function restart() {
    document.getElementById('hit').disabled = false;
    document.getElementById('stand').disabled = false;
    counter = 0; //發牌次數
    winner = ''; //勝利者 player1 - 電腦/player2 - 玩家
    hasStood = false; //標記玩家是否已經不要牌
    cards = [
        'club01', 'club02', 'club03', 'club04', 'club05', 'club06', 'club07',
        'club08', 'club09', 'club10', 'club11', 'club12', 'club13', 'diamond01',
        'diamond02', 'diamond03', 'diamond04', 'diamond05', 'diamond06', 'diamond07',
        'diamond08', 'diamond09', 'diamond10', 'diamond11', 'diamond12', 'diamond13',
        'heart01', 'heart02', 'heart03', 'heart04', 'heart05', 'heart06', 'heart07',
        'heart08', 'heart09', 'heart10', 'heart11', 'heart12', 'heart13',
        'spade01', 'spade02', 'spade03', 'spade04', 'spade05', 'spade06', 'spade07',
        'spade08', 'spade09', 'spade10', 'spade11', 'spade12', 'spade13'
    ];
    //洗牌
    for (let i = 0; i < 1000; i++) {
        rand = getRand(1, 52);
        tmp = cards[0];
        cards[0] = cards[rand];
        cards[rand] = tmp;
    }
    //玩家手牌
    cards1 = [getNewCard(), getNewCard()];
    cards2 = [getNewCard(), getNewCard()];
    table.rows[0].cells[1].innerHTML = '<img src="resource/cardback.png">'; //第一張牌必須是蓋排的
    table.rows[0].cells[2].innerHTML = '<img src="resource/' + cards1[1] + '.jpg">';
    table.rows[1].cells[1].innerHTML = '<img src="resource/' + cards2[0] + '.jpg">';
    table.rows[1].cells[2].innerHTML = '<img src="resource/' + cards2[1] + '.jpg">';
    //清空牌桌
    for (let i = 3; i < table.rows[0].cells.length; i++) {
        table.rows[0].cells[i].innerHTML = '';
        table.rows[1].cells[i].innerHTML = '';
    }
    showScore();
    document.getElementById('bulletin').innerHTML = '請做出選擇 (Please make a choice.)';
}

/*
//播放背景音樂 - Chrome46.0.2490.80m有效，Firefox44.0無效
let mp3snd = "./bgm.ogg";
let bkcolor = "000000";
if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
    document.write('<bgsound src="' + mp3snd + '" loop="-1">');
} else if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1) {
    document.write('<object data="' + mp3snd + '" type="application/x-mplayer2" width="0" height="0">');
    document.write('<param name="filename" value="' + mp3snd + '">');
    document.write('<param name="autostart" value="1">');
    document.write('<param name="playcount" value="infinite">');
    document.write('</object>');
} else {
    document.write('<audio src="' + mp3snd + '" autoplay="autoplay" loop="loop">');
    document.write('<object data="' + mp3snd + '" type="application/x-mplayer2" width="0" height="0">');
    document.write('<param name="filename" value="' + mp3snd + '">');
    document.write('<param name="autostart" value="1">');
    document.write('<embed height="2" width="2" src="' + mp3snd + '" pluginspage="http://www.apple.com/quicktime/download/" type="video/quicktime" controller="false" controls="false" autoplay="true" autostart="true" loop="true" bgcolor="#' + bkcolor + '"><br>');
    document.write('</embed></object>');
    document.write('</audio>');
}*/