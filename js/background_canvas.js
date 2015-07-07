//定义点相关属性
pt_quantity=50;
pt_size=2.5;
pt_color="#ffcc66";
pt_halation_size=6;
pt_halation_color="#ffee77";

//定义连线相关属性
lk_min_length=50;
lk_color="#ffee77";

//定义背景相关属性
bg_width=document.body.scrollWidth;
bg_height=document.body.scrollHeight;
bg_color="#66ccff";

//初始化canvas
var background_canvas=document.getElementById("background_canvas");
background_canvas.width=bg_width;
background_canvas.height=bg_height;
var bg_=background_canvas.getContext("2d");

//背景填色
bg_.fillStyle=bg_color;
bg_.fillRect(0,0,bg_width,bg_height);

//生成随机点序列
var point = new Array();
for(i=0;i<pt_quantity;i++) {
//	console.log(i);
	point[i]=new Array();
	point[i]['x']=Math.round(Math.random()*bg_width);
	point[i]['y']=Math.round(Math.random()*bg_height);
}

//生成随机点待排序序列
var ranking = new Array;
for(i=0;i<pt_quantity;i++) {
	ranking[i]=new Array();
	ranking[i]["id"]=i;
	ranking[i]["value"]=Math.sqrt(Math.pow(point[i]['x']-bg_width/2,2)+Math.pow(point[i]['y']-bg_height/2,2));
}

//定义快速排序
function quicksort(ranking){
	if(ranking.length<=1){return ranking;}
	var s = new Array;
	var l = new Array;
	var m = new Array;
	m[0] = ranking[0];
	for(var i = 1; i < ranking.length; i++){
		if (ranking[i]["value"]<=m[0]["value"]) {
			s.push(ranking[i]);
		}else{
			l.push(ranking[i]);
		}
	}
	return quicksort(s).concat(m, quicksort(l));
}

//快速排序
ranking=quicksort(ranking);


//画线函数
function line(x1,y1,x2,y2,color_){
	bg_.strokeStyle=color_;
	bg_.lineCap="round";
	bg_.moveTo(x1,y1);
	bg_.lineTo(x2,y2);
	bg_.stroke();
}
//距离中心距离的绘线条件判断
for(i=0;i<pt_quantity;i++){
	for(j=i+1;j<pt_quantity;j++){
		var pt1 = ranking[i]["id"];
		var pt2 = ranking[j]["id"];
		if(Math.abs(ranking[j]["value"]-ranking[i]["value"])>lk_min_length){
			break;
		}else if(Math.sqrt(Math.pow(point[pt1]['x']-point[pt2]['x'],2)+Math.pow(point[pt1]['y']-point[pt2]['y'],2))<=lk_min_length){
			line(point[pt1]['x'],point[pt1]['y'],point[pt2]['x'],point[pt2]['y'],lk_color);
		}else{
			continue;
		}
	}
}

//绘制点
for(i=0;i<pt_quantity;i++) {
	bg_.fillStyle=pt_halation_color;
	bg_.beginPath();
	bg_.arc(point[i]['x'],point[i]['y'],pt_halation_size,0,Math.PI*2,true);
	bg_.closePath();
	bg_.fill();
	
	bg_.fillStyle=pt_color;
	bg_.beginPath();
	bg_.arc(point[i]['x'],point[i]['y'],pt_size,0,Math.PI*2,true);
	bg_.closePath();
	bg_.fill();
}


//var test = Array();
//test[0]=document.body.clientWidth;
//test[1]=document.body.clientHeight;
//test[2]=document.body.offsetWidth;
//test[3]=document.body.offsetHeight;
//test[4]=document.body.scrollWidth;
//test[5]=document.body.scrollHeight;
//test[6]=document.body.scrollTop;
//test[7]=document.body.scrollLeft;
//test[8]=window.screenTop;
//test[9]=window.screenLeft;
//test[10]=window.screen.height;
//test[11]=window.screen.width;
//test[12]=window.screen.availHeight;
//test[13]=window.screen.availWidth;
//test.forEach(function(i){
//	console.log(i+": "+test[i]);
//})
//for (i=0;i<=13;i++) {
//	console.log(i+": "+test[i]);
//}