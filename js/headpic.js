//function object(father) {
//　　　　function child() {}
//　　　　child.prototype = father;
//　　　　return new child();
//}

function MoveableObj(){
	this.me	= 0;
	this.x	= 0;
	this.y	= 0;
	this.r	= 0;	
}

function Ucer(){
	var t = new MoveableObj();
}
Ucer.prototype = MoveableObj();

MoveableObj.prototype.reset=function(){
//	console.log(this.me);
	this.me.style.position	= "fixed";
	this.me.style.width		= (this.r * 2)		+ "px";
	this.me.style.height	= (this.r * 2)		+ "px";
	this.me.style.left		= (this.x-this.r)	+ "px";
	this.me.style.top		= (this.y-this.r)	+ "px";
}
MoveableObj.prototype.move_to=function(x_,y_,r_,speed_){
	this.me.style.left=x_;
	
}





var ucers = new Array;

$("#ucers_ul").children().each(function(index){
	ucers[index] = new Ucer();
	ucers[index].me = this;
//	console.log(this.offsetLeft);;
	ucers[index].r = this.offsetHeight / 2;
	ucers[index].x = this.offsetLeft + ucers[index].r;
	ucers[index].y = this.offsetTop + ucers[index].r;
});

for(index in ucers){
	ucers[index].reset();
}


