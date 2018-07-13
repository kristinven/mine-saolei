// 1. 点击开始游戏，游戏开始，动态生成10x10棋盘，显示当前剩余雷数；生成10个雷，随机分布在不同的格子里
// 2. 点击每个格子，左键点击：如果是雷，显示所有的雷，弹出结束框，游戏结束；
//                          如果不是雷，显示以当前格为中心，周围8个格子里的雷数；如果雷数为0，查找范围显示范围向周围扩散，直至某格周围雷数不为0，停止扩散。
//                 右键点击：如果已经左键点击过为数字，不操作；如果没有插旗，插上小旗，如果插旗，取消插旗，并计算更新当前剩余雷数；最多只能插旗10个
// 3. 弹出结束框，点击关闭，关闭结束框。
// 特点：数组存储每个小格位置和对应雷数，结合id查找对应dom；遍历查询每个小格周围雷数；递归扩散周围雷数为0的小格周围的每格周围雷数
// v3.0-防作弊版，flagNum限制
var startBtn = document.getElementById('startBtn');
var flagBox = document.getElementById('flagBox');
var box = document.getElementById('box');
var alertBox = document.getElementById('alertBox');
var alertImg = document.getElementById('alertImg');
var score = document.getElementById('score');
var close = document.getElementById('close');
var minesNum = 0;
var mineover = 0;
var flagNum = 0;
var minesMap = [];
var minesArr = [];
var startGameBool = true;

bindEvent();
// 集中绑定事件
function bindEvent() {
    startBtn.onclick = function () {
        if (!startGameBool) {
            return false;
        }
        flagBox.style.display = 'block';
        box.style.display = 'block';
        startGameBool = false;
        init();
    }
    box.oncontextmenu = function () {
        return false;
    }
    alertBox.oncontextmenu = function () {
        return false;
    }
    box.onmousedown = function (e) {
        var target = e.target;
        if (e.button == 0) {
            leftClick(target);
        } else if (e.button == 2) {
            rightClick(target);
        }
    }
    close.onclick = function () {
        alertBox.style.display = 'none';
        box.style.display = 'none';
        flagBox.style.display = 'none';
        startGameBool = true;
    }
}
// 初始化游戏
function init() {
    minesNum = 10;
    mineover = 10;
    flagNum = 10;
    box.innerHTML = '';
    score.innerHTML = mineover;
    // 生成棋盘
    for (var i = 0; i < 10; i++) {
        minesMap.push([]);
        for (var j = 0; j < 10; j++) {
            var block = document.createElement('div');
            block.classList.add('block');
            block.setAttribute('id', 'p' + i + '-' + j);
            minesMap[i].push({
                mine: 0
            });
            box.appendChild(block);
        }
    }
    // 随机生成10个雷
    var block = document.getElementsByClassName('block');
    var num = minesNum;
    while (num) {
        var mineX = Math.floor(Math.random() * 10);
        var mineY = Math.floor(Math.random() * 10);
        if (minesMap[mineX][mineY].mine == 0) {
            minesMap[mineX][mineY].mine = 1;
            minesArr.push({
                x: mineX,
                y: mineY
            });
            num--;
        }
    }
}

// 点击左键
function leftClick(dom) {
    var posX = +dom.id.slice(1).split('-')[0];
    var posY = +dom.id.slice(1).split('-')[1];
    if (minesMap[posX][posY].mine) {
        for (var i = 0; i < minesNum; i++) {
            var mineblock = document.getElementById('p' + minesArr[i].x + '-' + minesArr[i].y);
            mineblock.style.backgroundImage = 'url(./img/dilei.jpg)';
            mineblock.style.backgroundSize = '100% 100%';
        }
        setTimeout(function () {
            alertBox.style.display = 'block';
            alertImg.style.backgroundImage = 'url(./img/over.jpg)';
        }, 500);
    } else if (dom.classList.contains('flag')) {
        return;
    } else {
        var num = 0;
        for (var i = posX - 1; i <= posX + 1; i++) {
            for (var j = posY - 1; j <= posY + 1; j++) {
                var nearBox = document.getElementById('p' + i + '-' + j);
                if (nearBox && minesMap[i][j].mine == 1) {
                    num++;
                }
            }
        }
        dom.classList.add('num');
        dom.innerHTML = num;

        if (num == 0) {
            for (var i = posX - 1; i <= posX + 1; i++) {
                for (var j = posY - 1; j <= posY + 1; j++) {
                    var nearBox = document.getElementById('p' + i + '-' + j);
                    if (nearBox && !nearBox.classList.contains('check') && !nearBox.classList.contains('flag')) {
                        nearBox.classList.add('check');
                        leftClick(nearBox);
                    }
                }
            }
        }
    }
}
// v2.0: flagNum限制<=10
// 点击右键
function rightClick(dom) {
    var posX = +dom.id.slice(1).split('-')[0];
    var posY = +dom.id.slice(1).split('-')[1];
    if (dom.classList.contains('num')) {
        return;
    } else {
        if (flagNum > 0) {
            if (dom.classList.toggle('flag')) {
                if (minesMap[posX][posY].mine) {
                    mineover--;
                }
                flagNum--;
            } else {
                if (minesMap[posX][posY].mine) {
                    mineover++;
                }
                flagNum++;
            }
        } else if (flagNum == 0) {
            if (dom.classList.contains('flag')) {
                dom.classList.remove('flag');
                flagNum++;
                if (minesMap[posX][
                        [posY].mine
                    ]) {
                    mineover++;
                }
            }
        }

        score.innerHTML = mineover;

        if (mineover == 0) {
            success();
        }
    }
}
// 成功结束
function success() {
    alertBox.style.display = 'block';
    alertImg.style.backgroundImage = 'url(./img/success.png)';
}