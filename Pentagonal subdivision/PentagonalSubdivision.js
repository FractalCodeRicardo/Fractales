
function PentagonalSubdivision(level,radius, proportion){

	var maxLevel=level;
	var initialRadius=radius;
	var pentagonProportion=proportion;

	var pentagons=[];


	function createPentagons(penagonParent){

			if( !penagonParent){	
			    var pen=new Pentagon(null, null,null, initialRadius);
			    pen.level=1;	
			    pentagons.push(pen);		
			    createPentagons(pen);
			    return;
			}

			if(penagonParent.level==maxLevel)
			     return;

			var rule=new SubdivisionRule(penagonParent,pentagonProportion);
			var pens=rule.getPentagons(penagonParent);

			for(var i in pens){
				pens[i].level=penagonParent.level+1;
				pentagons.push(pens[i]);
			}

			for(var i in pens)
				createPentagons(pens[i]);

		}



	this.getPentagons=function(){
		createPentagons();
		return pentagons;

	}
}

