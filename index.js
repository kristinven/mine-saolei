// 1. 点击开始游戏，游戏开始，动态生成10x10棋盘，显示当前剩余雷数；生成10个雷，随机分布在不同的格子里
// 2. 点击每个格子，左键点击：如果是雷，显示所有的雷，弹出结束框，游戏结束；
//                          如果不是雷，显示以当前格为中心，周围8个格子里的雷数；如果雷数为0，查找范围显示范围向周围扩散，直至某格周围雷数不为0，停止扩散。
//                 右键点击：如果已经左键点击过为数字，不操作；如果没有插旗，插上小旗，如果插旗，取消插旗，并计算更新当前剩余雷数；最多只能插旗10个
// 3. 弹出结束框，点击关闭，关闭结束框。
// v1.0-基础版，无flagNum限制
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
var startGameBool = true;

bindEvent();
// 统一绑定事件
function bindEvent() {
    // 开始游戏，显示棋盘和积分器
    startBtn.onclick = function() {
        if(!startGameBool) {
            return false;
        }
        flagBox.style.display = 'block';
        box.style.display = 'block';
        startGameBool = false;
        init();
        console.log(minesNum);    }
    box.oncontextmenu = function() {
        return false;
    }
    alertBox.oncontextmenu = function() {
        return false;
    }
    // 左右键判断点击或插旗
    box.onmousedown = function(e) {
        var target = e.target;
        if(e.button == 0) {
            leftClick(target);
        }else if(e.button == 2) {
            rightClick(target);
        }
    }
    // 关闭游戏结束提示框
    close.onclick = function() {
        alertBox.style.display = 'none';
        box.style.display = 'none';
        flagBox.style.display = 'none';
        startGameBool = true;
    }
}
// 初始化游戏基本参数设置
function init() {
    minesNum = 10;
    mineover = 10;
    flagNum = 10;
    box.innerHTML = '';
    score.innerHTML = mineover;
    // 生成棋盘
    for(var i = 0; i < 10; i++) {
        for(var j = 0; j < 10; j++) {
            var block = document.createElement('div');
            block.classList.add('block');
            block.setAttribute('id', 'p' + i + '-' + j);
            minesMap.push({mine: 0});
            box.appendChild(block);
        }
    }
    // 随机生成10个雷
    var block = document.getElementsByClassName('block');
    var num = minesNum;
    while(num) {
        var mineIndex = Math.floor(Math.random() * 100);
        if(minesMap[mineIndex].mine == 0) {
            block[mineIndex].classList.add('isLei');
            minesMap[mineIndex].mine = 1;
            num--;
        }
    } 
}

// 点击左键
function leftClick(dom) {
    if(dom.classList.contains('isLei')) {
        var mineblocks = document.getElementsByClassName('isLei');
        for(var i = 0; i < minesNum; i++) {
            mineblocks[i].style.backgroundImage = 'url(./img/dilei.jpg)';
            mineblocks[i].style.backgroundSize = '100% 100%';
        }
        setTimeout(function() {
            alertBox.style.display = 'block';
            alertImg.style.backgroundImage = 'url(./img/over.jpg)';
        }, 500);
    }else if(dom.classList.contains('flag')) {
        return;
    }else{
        var num = 0;
        var pos = {};
        pos.x = +dom.id.slice(1).split('-')[0];
        pos.y = +dom.id.slice(1).split('-')[1];
        for(var i = pos.x-1; i <= pos.x+1; i++) {
            for(var j = pos.y-1; j <= pos.y+1; j++) {
                var nearBox = document.getElementById('p' + i + '-' + j);
                if(nearBox && nearBox.classList.contains('isLei')) {
                    num++;
                }
            }
        }
        dom.classList.add('num');
        dom.innerHTML = num;

        if(num == 0) {
            for(var i = pos.x-1; i <= pos.x+1; i++) {
                for(var j = pos.y-1; j <= pos.y+1; j++) {
                    var nearBox = document.getElementById('p' + i + '-' + j);
                    if(nearBox && !nearBox.classList.contains('check') && !nearBox.classList.contains('flag')) {
                        nearBox.classList.add('check');
                        leftClick(nearBox);
                    }
                }
            }
        } 
    }
}
// 基础版：无flagNum限制
function rightClick(dom) {
    if(dom.classList.contains('num')) {
        return;
    }else {
        if(dom.classList.toggle('flag')) {
            if(dom.classList.contains('isLei')) {
                mineover--;
            }
        }else {
            if(dom.classList.contains('isLei')) {
                mineover++;
            }
        }
        score.innerHTML = mineover;

        if(mineover == 0) {
            success();
        }
    }
}
// 成功
function success() {
    alertBox.style.display = 'block';
    alertImg.style.backgroundImage = 'url(./img/success.png)';
}