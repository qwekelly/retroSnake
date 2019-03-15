//================================
//游戏参数设置
//================================
//游戏界面刷新的间隔时间，(数字越大，蛇的速度越慢)
var time = 500;//毫秒
//蛇的身长
var t = 3;
//记录蛇的运行轨迹，用数组记录每一个坐标点
var snakeMap = [];
//蛇身单元大小
var w = 10;
//设置方向代码：左37 上38 右39 下40
var direction = 37;
//蛇的初始坐标
var x = 0;
var y = 0;
//画布的宽和高
var width = 400;
var height = 400;
//食物的初始化位置
var foodx = 0;
var foody = 0;
//当前得分
var score = 0;
//历史最高分记录
var bestScore = 0;
//根据id找到指定的画布
var myCanvas = document.getElementById('myCanvas');
//创建2D的context对象
var ctx = myCanvas.getContext("2d");

showBestScore();
gameStart();

//==============================
//显示历史最高分记录
//==============================
function showBestScore(){
	//通过HTML5 API获取本地存取内容
	bestScore = localStorage.getItem('bestScore');
	//如果尚未记录最高分，则重置为0
	if(bestScore == null){
		bestScore = 0;
	}
	//将历史最高分更新到状态栏中
	var best = document.getElementById('bestScore');
	best.innerHTML = bestScore;
}
//==============================
//绘制贪吃蛇函数
//==============================
function drawSnake(){
	//设置蛇身颜色
	ctx.fillStyle = "lightblue";
	//设置蛇身矩形
	ctx.fillRect(x, y, w, w);

	//数组只保留蛇身长度的数据，如果蛇前进了则删除最旧的坐标数据
	if(snakeMap.length > t){
		//删除数组的第一项，即蛇的尾部的最后一个位置的坐标记录
		var lastBox = snakeMap.shift();
		//清除蛇的尾部的最后一个位置，从而实现移动效果
		ctx.clearRect(lastBox['x'], lastBox['y'], w, w);
	}
}

//==============================
//改变蛇方向的按键监听
//==============================
document.onkeydown = function(e){
	if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
		direction = e.keyCode;
	}
}

//==============================
//碰撞检测函数
//==============================
function detectCollision(){
	if(x>width || y>height || x<0 || y<0){
		return 1;
	}
	for(i=0;i<snakeMap.length;i++){
		if(snakeMap[i].x == x && snakeMap[i].y == y){
			return 2;
		}
	}
	return 0;
}

//==============================
//绘制食物函数
//==============================
function drawFood(){
	//产生随机食物坐标
	foodx = Math.floor(Math.random() * width / w) * w;
	foody = Math.floor(Math.random() * height / w) * w;
	//内部填充颜色
	ctx.fillStyle = "#ff0000";
	//绘制矩形
	ctx.fillRect(foodx, foody, w, w);
}

//==============================
//启动函数
//==============================
function gameStart(){
	//调用函数，随机生成一个食物
	drawFood();

	//随机生成蛇头坐标
	x = Math.floor(Math.random() * width / w) * w;
	y = Math.floor(Math.random() * height / w) * w;
	//随机生成蛇的前进方向
	direction = 37 + Math.floor(Math.random() * 4);

	//每隔time毫秒刷新一次游戏内容
	setInterval("gameRefresh()",time);
}

//==============================
//游戏画面刷新函数
//==============================
function gameRefresh(){
	//将当前坐标数据添加到贪吃蛇的运动轨迹坐标数组中
	snakeMap.push({
		'x': x,
		'y': y
	});

	//绘制贪吃蛇
	drawSnake();

	//根据方向移动蛇头的位置
	switch(direction) {
		case 37:
			x -= w;
			break;
		case 38:
			y -= w;
			break;
		case 39:
			x += w;
			break;
		case 40:
			y += w;
			break;
	}

	//检测碰撞，返回值0表示没有撞到障碍物
	var code = detectCollision();
	//如果返回值不为0，则游戏失败
	if(code != 0){
		//比较当前分数与历史最高分，刷新最高分
		if(score > bestScore){
			localStorage.setItem('bestScore',score);
		}
		if(code == 1){
			//alert("撞到了墙壁，游戏失败，当前得分为：" + score);
			if(prompt("撞到了墙壁，游戏失败，当前得分为：" + score))
			{
				window.location.reload();//重新加载页面
			}
		}
		else if(code == 2){
			alert("撞到了蛇身，游戏失败，当前得分为：" +  score);
		}
		//重新加载页面
		window.location.reload();
	}

	//吃到食物的判定
	if(foodx == x && foody == y){
		//吃一个食物加10分
		score += 10;
		//更新当前分数
		var currentScore = document.getElementById('currentScore');
		currentScore.innerHTML = score;
		//吃完之后，在随机产生食物
		drawFood();
		//蛇身加长1
		t++;
	}
}