class Part extends Instance {
    constructor(Parent = null) {
        super("Part", Parent);
        this.Name = "Part";
        this.Color = color(120, 120, 120)
        this.Position = createVector(0, 0);
        this.Size = createVector(5, 5, 5);
        this.Orientation = createVector(0, 0);
        this.Shape = "Block";
        this.Anchored = true;
        this.CanCollide = true;

        this.Physics = {
            acc: createVector(0, 0),
            vel: createVector(0, 0),
        }

        this.Part;
    }

    setPosition(x, y) {
        this.Position.set(x, y);
    }

    changeShape(Shape)
    {
        this.Shape = Shape;
    }

    draw()
    {
        push()
        translate(this.Position.x, this.Position.y)
        rectMode(CENTER);
        noStroke();
        switch(this.Shape)
        {
            case "Block":
                this.Block();
            break
            case "Sphere":
                this.Sphere();
            break

        }
        pop()
    }

    Physics()
    {

    }

    Block()
    {
        //Rotation Around X axis
        let cosX = cos(this.Orientation.x);
        let sinX = sin(this.Orientation.x);

        // Rotation around Y axis
        let cosY = cos(this.Orientation.y);
        let sinY = sin(this.Orientation.y);

        // Rotation around Z axis
        let cosZ = cos(this.Orientation.z);
        let sinZ = sin(this.Orientation.z);

        // Apply rotation to points
        let points = [
            createVector(-this.Size.x / 2, -this.Size.y / 2, -this.Size.z / 2),
            createVector(this.Size.x / 2, -this.Size.y / 2, -this.Size.z / 2),
            createVector(this.Size.x / 2, this.Size.y / 2, -this.Size.z / 2),
            createVector(-this.Size.x / 2, this.Size.y / 2, -this.Size.z / 2),
            createVector(-this.Size.x / 2, -this.Size.y / 2, this.Size.z / 2),
            createVector(this.Size.x / 2, -this.Size.y / 2, this.Size.z / 2),
            createVector(this.Size.x / 2, this.Size.y / 2, this.Size.z / 2),
            createVector(-this.Size.x / 2, this.Size.y / 2, this.Size.z / 2),
        ];

        for (let p of points) {
            // Rotate around X
            let y = p.y * cosX - p.z * sinX;
            let z = p.y * sinX + p.z * cosX;
            p.y = y;
            p.z = z;

            // Rotate around Y
            let x = p.z * sinY + p.x * cosY;
            z = p.z * cosY - p.x * sinY;
            p.x = x;
            p.z = z;

            // Rotate around Z
            x = p.x * cosZ - p.y * sinZ;
            y = p.x * sinZ + p.y * cosZ;
            p.x = x;
            p.y = y;
        }

        // Draw front face
        beginShape();
        vertex(points[0].x, points[0].y);
        vertex(points[1].x, points[1].y);
        vertex(points[2].x, points[2].y);
        vertex(points[3].x, points[3].y);
        endShape(CLOSE);

        // Draw back face
        beginShape();
        vertex(points[4].x, points[4].y);
        vertex(points[5].x, points[5].y);
        vertex(points[6].x, points[6].y);
        vertex(points[7].x, points[7].y);
        endShape(CLOSE);

        for (let i = 0; i < 4; i++) {
            line(points[i].x, points[i].y, points[i + 4].x, points[i + 4].y);
        }
    }

    Sphere() {
        let cosX = cos(this.Orientation.x);
        let sinX = sin(this.Orientation.x);
        let cosY = cos(this.Orientation.y);
        let sinY = sin(this.Orientation.y);
        let cosZ = cos(this.Orientation.z);
        let sinZ = sin(this.Orientation.z);

        let points = [];
        let steps = 100; // Number of points along the ellipse perimeter

        for (let i = 0; i < steps; i++) {
            let theta = map(i, 0, steps, 0, TWO_PI);
            let x = (this.Size.x / 2) * cos(theta);
            let y = (this.Size.y / 2) * sin(theta);
            let z = 0;
            points.push(createVector(x, y, z));
        }

        for (let p of points) {
            // Rotate around X
            let y = p.y * cosX - p.z * sinX;
            let z = p.y * sinX + p.z * cosX;
            p.y = y;
            p.z = z;

            // Rotate around Y
            let x = p.z * sinY + p.x * cosY;
            z = p.z * cosY - p.x * sinY;
            p.x = x;
            p.z = z;

            // Rotate around Z
            x = p.x * cosZ - p.y * sinZ;
            y = p.x * sinZ + p.y * cosZ;
            p.x = x;
            p.y = y;
        }

        beginShape();
        for (let p of points) {
            vertex(p.x, p.y);
        }
        endShape(CLOSE);
    }

}