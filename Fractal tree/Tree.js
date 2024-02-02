function Tree(param) {

	this.parameters = param;
	this.branches = [];


	var self = this;

	function createTree(point, level) {

		point = point ? point : param.initialPoint;
		level = level ? level : 1;

		if (level > param.level)
			return;

		var next = getBranches(point, param.getLineDistance(level), level);

		for (var i = 0; i < next.length; i++) {
			var branch = next[i];
			self.branches.push(branch);
			createTree(branch.p2, level + 1);
		}


	}


	function getBranches(point, distance, oldLevel) {

		var branches = [];
		var r = param;

		for (var i = 0; i < r.angles.length; i++) {
			var nPoint = getNextPoint(point, distance, r.angles[i]);
			branches.push(new Branch(point, nPoint, oldLevel + 1))
		}

		return branches;
	}


	function getNextPoint(point, distance, radians) {
		return {
			x: point.x + (distance * Math.sin(radians)),
			y: point.y + (distance * Math.cos(radians))
		};

	}





	createTree();




}





function Branch(p1, p2, level) {

	this.p1 = p1;
	this.p2 = p2;
	this.level = level;



}
