function Pentagon(points, center, level, radius){

	this.level=level||0;
	this.radius=radius||10;
	this.points=points || DefaultPoints(this.radius);
	this.center=center||new Vector(0,0);

	

	function DefaultPoints(radius){
		var pnts=new Array(5);
		pnts[0]=toCartesianSystem(90+0,radius);
		
		pnts[1]=toCartesianSystem(90+72,radius);
		
		pnts[2]=toCartesianSystem(90+144,radius);
		
		pnts[3]= toCartesianSystem(90+216,radius);
		
		pnts[4]=toCartesianSystem(90+288,radius);

		return pnts;
	}





	function toCartesianSystem(angle, distance){
		var radians= (Math.PI * angle) / 180 ;

		var vector= new Vector(Math.cos(radians)*distance, Math.sin(radians)*distance);

		return vector;

	}




}