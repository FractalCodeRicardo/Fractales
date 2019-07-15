

function getParameters(){
	var params=[];




	for (var iPolygon = 3; iPolygon <= 8; iPolygon++) {
		for (var iparalel = 0.3; iparalel <= 0.55; iparalel=iparalel+0.05) {
			for (var iperpen = 0.45; iperpen <= 0.5; iperpen=iperpen+0.05) {
				
					var p1={
							paralelProportion:iparalel,
							perpendicularProportion:iperpen,
							maxIteration:7,
							sizePolygon:iPolygon,
							maxColor:{r:0, g:255, b:4},
							minColor:{r:183,g:0,b:0}
						}
				params.push(p1);	
			}
		}
	}


	

	return params;

}