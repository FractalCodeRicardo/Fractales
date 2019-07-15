function Complex(real,imaginary){


	this.real=real||0;
	this.imaginary=imaginary||0;


	this.sum=function(complex){
		var real=this.real + complex.real;
		var imaginary=this.imaginary + complex.imaginary;

		return new Complex(real, imaginary);
	}


	this.multiply=function(complex){
		//(a+bi)(c+di)=(ac-bd)+(bc+ad)i

		var real=	  (this.real * complex.real) - (this.imaginary * this.imaginary);
		var imaginary=  (this.imaginary * complex.real) +  (this.real * complex.imaginary);

		return new Complex(real, imaginary);
	}


	this.test=function(){
		var c1=new Complex(3,2);
		var c2=new Complex(3,2);


		var c3=new Complex(2,3);
		var c4=new Complex(5,1);

		testSum(c1,c2);
		testMultiply(c1,c2);

		testSum(c1,c2);
		testMultiply(c1,c2);
			

	}

	function testSum(c1, c2){
		var r1=c1.sum(c2);
		console.log(c1 + "+" + c2 +"=" +r1);
	}

	function testMultiply(c1, c2){
		var r2=c1.multiply(c2);
		console.log(c1 + "x" + c2 +"=" +r2);
		
	}


}


Complex.prototype.toString = function()
{
    return "(" + this.real + "	" + this.imaginary + "i)";
}