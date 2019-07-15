function SubdivisionRule(pentagon, proportion){

	var pentagonProportion=proportion || 0.5;
	var pentagon=pentagon;

	this.getPentagons =function(){

		var pens=[];

		pens.push(createCenterPentagon(pentagon));

		var adjs=createAdjacentPentagons(pentagon);

		var l=adjs.length;

		for(var i=0;i<5;i++){
			pens.push(adjs[i]);
		}
		return pens;
	}



	function getMidPoint(p1, p2){
		var x=(p1.x+p2.x)/2;
		var y=(p1.y+p2.y)/2;
		return new Vector(x, y);
	}


	function getCenterMidPoint(p1,p2, center){
		var pm=getMidPoint(p1,p2);
		
		var nCenter=getCenterDirection(pm, center);

		return nCenter;

	}

	function getCenterDirection(direction, oldCenter){
		var dist=direction.distance(oldCenter);
		var dir= direction.substract(oldCenter);
		dir=dir.unitVector().scalarProduct(dist*pentagonProportion);

		return  direction.substract(dir);
	}


	function createCenterPentagon(pParent){
		var index1=0;
		var index2=0;
		var j=3;
		var points=new Array(5);
		for(var i=0;i<5;i++){

			index1=i;
			index2=i+1>4? 0: i+1;

			points[j]=getCenterMidPoint(pParent.points[index1], pParent.points[index2],pParent.center)
			j=getNextIndex(j);
		}

		var center=calculateCenter(points);
		var pentagon=new Pentagon(points, center);

		return pentagon;
	}

	function createAdjacentPentagons(pParent){
		var arr=new Array(5);

		for(i=0;i<5;i++){
			arr[i]=createAdjacentPentagon(i,pParent);
		}

		return arr;
	}



	function createAdjacentPentagon(index, pParent){
		var point=new Array(5);

		var index1=index;
		var index2=getNextIndex(index);
		var index3=getPreviusIndex(index);

		point[0]=pParent.points[index1];
		point[1]=getMidPoint(pParent.points[index1], pParent.points[index2]);
		point[2]=getCenterDirection(point[1],pParent.center);

		point[4]=getMidPoint(pParent.points[index1], pParent.points[index3]);
		point[3]=getCenterDirection(point[4],pParent.center);

		var center=calculateCenter(point);
		var pentagon=new Pentagon(point, center);

		return pentagon;
	}


	function getNextIndex(index){
		return index==4? 0:index+1;
	}

	function getPreviusIndex(index){
		return index==0? 4:index-1;
	}


	function calculateCenter(points){
		var midBase=getMidPoint(points[2],points[3]);
		var upVertext=points[0];
		var mid=getMidPoint(midBase,upVertext);

		return mid;
	}


}