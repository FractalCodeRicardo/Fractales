var maxIterations=100;
var lastIterationsTaken=95;
var currentIteration=0;


var manSet= new MandelbrotSet();
var isColorDark=true;
var colors=createColorsDarker();


function setup() {
	createCanvas(window.innerWidth, window.innerHeight);  
	stroke(255);     // Set line drawing color to white
	//frameRate(10000);
	background(0); 
}



function draw() {

	var pnts=manSet.points[currentIteration];


	var color=colors[currentIteration];
	stroke(color.r, color.g, color.b);

	for(var i=0;i<pnts.length;i++){
		var p=toScreenCoordinates(pnts[i]);

		point(p.x,p.y);
	}

	if(currentIteration==lastIterationsTaken-1){

		if(isColorDark){
			
			colors=createColorsLighter();
			background(0);
		}
		else{
			colors=createColorsDarker();
			background(255);
		}

		isColorDark=!isColorDark;

		currentIteration=0;
	}
	else
		currentIteration++;


}



  


function createColorsDarker(){
	var step=255/lastIterationsTaken;

	var colors=new Array(lastIterationsTaken);
	var color=255;
	for(var i=0;i<lastIterationsTaken;i++){
		colors[i]={r:color,g:color,b:color};
		color=color-step;
	}

	return colors;
}



function createColorsLighter(){
	var step=255/lastIterationsTaken;


	var colors=new Array(lastIterationsTaken);
	var color=0;
	for(var i=0;i<lastIterationsTaken;i++){
		colors[i]={r:color,g:color,b:color};
		color=color+step;
	}

	return colors;
}






function toScreenCoordinates(p){
	var centerx=(window.innerWidth)/2;
	var centery=(window.innerHeight)/2;


	var scaleX=150;
	var scaleY=150;

	var x=centerx+ p.x*scaleX;
	var y=centery - p.y*scaleY;

	return {x:x, y:y};
}




function MandelbrotSet(){
	

	var maxX=1;
	var maxY=1;
	var step=0.03;
	var centerx=-0.2;
	var distance=Math.sqrt((maxX*maxX) + (maxY*maxY));



	this.points=createPoints();



	function createPoints(){

		var pnts=new Array(lastIterationsTaken);

		for(var i=0;i<pnts.length;i++)
			pnts[i]=[];

			for(var r=distance;r>0;r=r-0.007){
				for(var angle=0;angle<=360;angle=angle+0.1){
					var rads=Math.PI * angle / 180
					var y=r * Math.sin(rads);
					var x= r * Math.cos(rads)+centerx;

					var znReal=0.0;
					var znImaginary=0.0;
					var temp=0;
					var i=0;



					while(i<maxIterations){

			  			temp=znReal;

						//zn^2
			  			znReal=(znReal*znReal) - (znImaginary*znImaginary);
			  			znImaginary=2*temp*znImaginary;

			  			//zn2 + c 
			  			znReal=znReal+x;
			  			znImaginary=znImaginary+y;

						if(checkDivergence(znReal, znImaginary))
			 			 break;
			
						i++;
					}

					if(i<maxIterations && i>maxIterations-lastIterationsTaken){
						var index=i-(maxIterations-lastIterationsTaken+1)

						pnts[index].push({x:x,y:y,i:index});
					}


				}

			}


			return pnts;
		}

		function checkDivergence(real, imaginary){
			var d1=Math.sqrt((real*real) + (imaginary*imaginary));
		     return d1>distance;
		}

	


}

		