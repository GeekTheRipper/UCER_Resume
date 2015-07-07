//定义点相关属性
pt_quantity			= 180;
pt_size				= 2;
pt_color			= "#cccccc";
pt_color_range		= 15;
pt_halation_size	= 5;
pt_halation_color	= "#ffffff";

//定义连线相关属性
lk_min_length		= 61.8;
lk_color			= "#cccccc";

//定义背景相关属性
bg_width	= document.body.scrollWidth;
bg_height	= document.body.scrollHeight;
bg_color	= "#dddddd";

interval_time = 50;

//点数自适应
pt_quantity = Math.abs(bg_width*bg_height/10000);

//初始化canvas
var background_canvas = document.getElementById("background_canvas");
background_canvas.width		= bg_width;
background_canvas.height	= bg_height;

var bg_ = background_canvas.getContext("2d");
bg_.globalAlpha=0.7;
//背景填色
//bg_.fillStyle = bg_color;
//bg_.fillRect(0,0,bg_width,bg_height);

function Point(){
	this.id_ 				= 0;
//	this.size_ 				= 0;
//	this.halation_size_		= 0;
	this.color_ 			= "";
	this.halation_color_	= "";
	this.x_					= 0;
	this.y_					= 0;
	this.distance_to_center	= 0;
//	this.text_				= "";
	this.speed_x			= 0;
	this.speed_y			= 0;
	
}
Point.prototype.size_			= pt_size;
Point.prototype.halation_size_	= pt_halation_size;

//Point.prototype.color_			= pt_color;
Point.prototype.base_color_			= pt_color;
//Point.prototype.halation_color_	= pt_halation_color;
Point.prototype.base_halation_color_= pt_halation_color;
Point.prototype.color_range			= pt_color_range;

Point.prototype.line_color_			= lk_color;

Point.prototype.background_			= bg_;
Point.prototype.background 			= new Array();
Point.prototype.background.width	= bg_width;
Point.prototype.background.height	= bg_height;
Point.prototype.background.color	= bg_color;

Point.prototype.update_interval		= interval_time/1000;

//随机生成点的位置和速度数据 以及随机配色
Point.prototype.reset=function(){
	this.x_ = Math.round(Math.random()*bg_width);
	this.y_ = Math.round(Math.random()*bg_height);
	this.distance_to_center = Math.sqrt(Math.pow(this.x_-this.background.width/2,2)+Math.pow(this.y_-this.background.height/2,2));
	this.speed_x = 8 - Math.random()*16;
	this.speed_y = 8 - Math.random()*16;
	this.color_				= this.random_color(this.base_color_,			this.color_range);
	this.halation_color_	= this.random_color(this.base_halation_color_,	this.color_range);
}
//计算下一时间点点的位置和速度
Point.prototype.update=function(){
	this.x_ = this.x_ + this.update_interval * this.speed_x;
	if (this.x_ <= 0) {
		this.x_ = - this.x_;
		this.speed_x = - this.speed_x;
	}else if(this.x_ >= this.background.width){
		this.x_ = this.background.width*2 - this.x_;
		this.speed_x = - this.speed_x;
	}
	
	this.y_ = this.y_ + this.update_interval * this.speed_y;
	if (this.y_ <= 0) {
		this.y_ = - this.y_;
		this.speed_y = - this.speed_y;
	}else if(this.y_ >= this.background.height){
		this.y_ = this.background.height*2 - this.y_;
		this.speed_y = - this.speed_y;
	}
}
//绘晕
Point.prototype.halation_draw=function(){
	this.background_.fillStyle=this.halation_color_;
	this.background_.beginPath();
	this.background_.arc(this.x_,this.y_,this.halation_size_,0,Math.PI*2,true);
	this.background_.closePath();
	this.background_.fill();
}
//绘点
Point.prototype.point_draw=function(){
	this.background_.fillStyle=this.color_;
	this.background_.beginPath();
	this.background_.arc(this.x_,this.y_,this.size_,0,Math.PI*2,true);
	this.background_.closePath();
	this.background_.fill();
}
//绘点和晕
Point.prototype.draw=function(){
	this.halation_draw();
	this.point_draw();
}
//渐变绘线（失败）
//Point.prototype.link_to=function(target){
//	var my_gradient=this.background_.createLinearGradient(this.x_,this.y_,target.x_,target.y_);
//	my_gradient.addColorStop(0,this.halation_color_);
//	my_gradient.addColorStop(1,target.halation_color_);
//	this.background_.strokeStyle=my_gradient;
//	this.background_.moveTo(this.x_,this.y_);
//	this.background_.lineTo(target.x_,target.y_);
//	this.background_.stroke();
//}
//绘线
Point.prototype.link_to=function(target){
	this.background_.strokeStyle=this.line_color_;
	this.background_.moveTo(this.x_,this.y_);
	this.background_.lineTo(target.x_,target.y_);
	this.background_.stroke();
}
//计算点距
Point.prototype.distance_to=function(target){
	return Math.sqrt(Math.pow(this.x_-target.x_,2)+Math.pow(this.y_-target.y_,2));
}
//随机颜色
Point.prototype.random_color=function(color_,range_){
	range_ = Math.round(range_ - Math.random() * range_ * 2);
	var color_range = function(color_){
		if (color_>= 255) {
			color_=255;
		}else{
			color_=Math.abs(color_);
		}
		return color_;
	}
	r=color_range(parseInt(color_.substr(1,2),16)+range_);
	g=color_range(parseInt(color_.substr(3,2),16)+range_);
	b=color_range(parseInt(color_.substr(5,2),16)+range_);
	return "#" + r.toString(16) + g.toString(16) + b.toString(16); 
}


//生成点集
var points = new Array();
for(i=0;i<=pt_quantity;i++){
	points[i] = new Point();
	points[i].id=i;
	points[i].reset();
}

//重绘页面
bg_redarw=function(){
	
//	bg_.fillStyle=bg_color;
	bg_.clearRect(0,0,bg_width,bg_height);
	
	for(i=0;i<=pt_quantity;i++){
		points[i].update();
	}
	points = quicksort(points);
	
	//距离中心距离的绘线条件判断
	for(i=0;i<pt_quantity;i++){
		for(j=i+1;j<=pt_quantity;j++){
			if(Math.abs(points[i].distance_to_center) - Math.abs(points[j].distance_to_center)>lk_min_length){
				break;
			}else if(points[i].distance_to(points[j])<=lk_min_length){
				points[i].link_to(points[j]);
			}else{
				continue;
			}
		}
	}
	
	for(i=0;i<=pt_quantity;i++){
		points[i].draw();
	}
}

//快速排序函数
function quicksort(ranking){
	if(ranking.length<=1){return ranking;}
	var s = new Array;
	var l = new Array;
	var m = new Array;
	m[0] = ranking[0];
	for(var i = 1; i < ranking.length; i++){
		if (ranking[i].distance_to_center<=m[0].distance_to_center) {
			s.push(ranking[i]);
		}else{
			l.push(ranking[i]);
		}
	}
	return quicksort(s).concat(m, quicksort(l));
}

setInterval("bg_redarw()",interval_time);

