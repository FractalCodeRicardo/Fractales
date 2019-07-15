function Vector(x,y){

	this.x=x;
	this.y=y;


	this.scalarProduct = function(scalar){
		var v=new Vector();
		v.x=this.x*scalar;
		v.y=this.y*scalar;

		return v;
	}


	this.sum=function(vector){
		var v=new Vector();

		v.x=this.x+vector.x;
		v.y=this.y+vector.y;

		return v;
	}

	this.unitVector=function(){
		var norm=1/this.L2Norm();

		return this.scalarProduct(norm)
	}

	this.L2Norm=function(){
		var x=this.x*this.x;
		var y=this.y*this.y;

		return Math.sqrt(x+y);
	}

	this.substract= function(vector){
		var nVector=vector.scalarProduct(-1);
		return this.sum(nVector);

	}


	this.distance=function(vector){
		var x=this.x-vector.x;
		var y=this.y-vector.y;

		x=x*x;
		y=y*y;

		return Math.sqrt(x+y);
	}




}