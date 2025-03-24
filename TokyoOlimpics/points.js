class Points {

    getPoints() {
        let theta = 0;
        let phi = 0;
        let step = 0.1;
        let r = 200;
        let points = [];

        while (theta <= Math.PI) {

            phi = 0;
            while (phi <= Math.PI * 2) {

                let p = {
                    x: r * Math.sin(theta) * Math.cos(phi),
                    y: r * Math.sin(theta) * Math.sin(phi),
                    z: r * Math.cos(theta)
                }

                if (!this.containsPoint(points, p)) {
                    points.push(p);
                }

                phi += step;
            }
            theta += step;
        }

        return points;
    }


    containsPoint(points, point) {
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            
            if (this.equals(p, point)) {
                return true;
            }
        }
        return false;
    }

    equals(p1, p2) {
        return p1.x == p2.x &&
        p1.y == p2.y &&
        p1.z == p2.z;
    }
}
