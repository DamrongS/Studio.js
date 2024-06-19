class Part extends Instance {
    constructor(Parent = null) {
        super("Part", Parent);
        this.Name = "Part";
        this.Color = color(120, 120, 120);
        this.Transparency = 0;
        this.Position = createVector(0, 0);
        this.Size = createVector(5, 5, 5);
        this.Orientation = createVector(0, 0);
        this.Shape = "Block";
        this.Anchored = true;
        this.CanCollide = true;
        this.Mass = 1;
        this.Massless = false;

        this.Physics = {
            acc: createVector(0, 0),
            vel: createVector(0, 0),
            angularAcc: 0,
            angularVel: 0
        };

        this.FrictionCoeff = {
            static: 0.2,
            dynamic: 0.1,
            ground: 0.2,
            rotational: 0.01
        };

        if(this.Parent == workspace)
        {
            this.Parent.addPart(this);
        }

        this.isGrounded = false;
    }

    setPosition(x, y) {
        this.Position.set(x, y);
    }

    changeShape(Shape) {
        this.Shape = Shape;
    }

    draw() {
        this.updatePhysics();

        push();
        translate(this.Position.x, this.Position.y);
        rotate(this.Orientation.z);
        rectMode(CENTER);
        noStroke();
        switch (this.Shape) {
            case "Block":
                this.drawBlock(); // Renamed to drawBlock() to avoid naming conflict
                break;
            case "Sphere":
                this.drawSphere(); // Renamed to drawSphere() to avoid naming conflict
                break;
        }
        pop();
    }

    rotate() {
        this.Orientation.z += this.Physics.angularVel;
    }

    applyForce(force, point) {
        if (!this.Anchored) {
            // Apply linear force
            this.Physics.acc.add(force);
    
            // Apply torque (angular force)
            let torque = p5.Vector.cross(point, force);
            this.Physics.angularAcc += torque.z / this.Mass;
        }
    }

    updatePhysics() {
        if (!this.Anchored) {
            // Apply linear motion
            this.Physics.vel.add(this.Physics.acc);
            this.Position.add(this.Physics.vel);
            this.Physics.acc.set(0, 0);
    
            // Apply rotational motion
            this.Physics.angularVel += this.Physics.angularAcc;
            this.Orientation.z += this.Physics.angularVel;
            this.Physics.angularAcc = 0;
    
            // Apply friction
            if (this.isGrounded) {
                // Linear friction
                if (abs(this.Physics.vel.x) > 0.1) {
                    this.Physics.vel.x -= Math.sign(this.Physics.vel.x) * this.FrictionCoeff.ground;
                } else {
                    this.Physics.vel.x = 0;
                }
    
                // Rotational friction
                if (abs(this.Physics.angularVel) > 0.1) {
                    this.Physics.angularVel -= Math.sign(this.Physics.angularVel) * this.FrictionCoeff.rotational;
                } else {
                    this.Physics.angularVel = 0;
                }
            }
    
            // Handle ground collision with elastic bounce and friction
            if (this.Position.y + this.Size.y / 2 > height && this.CanCollide) {
                this.Position.y = height - this.Size.y / 2;
                if (!this.Massless) {
                    this.Physics.vel.y *= -0.3; // Reverse and dampen velocity
                }
                this.isGrounded = true;
            } else {
                this.isGrounded = false;
            }
        }
    }

    handleCollisionWith(part) {
        // Example: Handle collision response with another part
    
        // Calculate relative velocity
        let relativeVel = p5.Vector.sub(part.Physics.vel, this.Physics.vel);
    
        // Calculate relative velocity in terms of the normal direction
        let normal = p5.Vector.sub(part.Position, this.Position).normalize();
        let velAlongNormal = p5.Vector.dot(relativeVel, normal);

        // Do not resolve if velocities are separating
        if (velAlongNormal > 0) {
            return;
        }
    
        // Calculate restitution
        let e = 0.3; // coefficient of restitution
        let j = -(1 + e) * velAlongNormal;
        j /= 1 / this.Mass + 1 / part.Mass;
    
        // Apply impulse
        let impulse = p5.Vector.mult(normal, j);
        this.Physics.vel.sub(p5.Vector.mult(impulse, 1 / this.Mass));
        part.Physics.vel.add(p5.Vector.mult(impulse, 1 / part.Mass));
    
        // Apply friction based on relative motion
        let tangent = p5.Vector.sub(relativeVel, p5.Vector.mult(normal, velAlongNormal)).normalize();
        let jt = -p5.Vector.dot(relativeVel, tangent);
        jt /= 1 / this.Mass + 1 / part.Mass;
    
        // Coulomb's law of friction
        let mu = 0.3; // coefficient of friction
        let frictionImpulse;
        if (abs(jt) < j * mu) {
            frictionImpulse = p5.Vector.mult(tangent, jt);
        } else {
            frictionImpulse = p5.Vector.mult(tangent, -j * mu);
        }
        this.Physics.vel.sub(p5.Vector.mult(frictionImpulse, 1 / this.Mass));
        part.Physics.vel.add(p5.Vector.mult(frictionImpulse, 1 / part.Mass));
    
        // Apply rotational impulse
        let r1 = p5.Vector.sub(part.Position, this.Position);
        let r2 = p5.Vector.sub(part.Position, this.Position); // adjust this accordingly based on where you apply the force
        let rn1 = p5.Vector.cross(r1, normal);
        let rn2 = p5.Vector.cross(r2, normal); // adjust this accordingly based on where you apply the force
    
        let rotationalImpulse = (1 / this.Mass + 1 / part.Mass) * (p5.Vector.dot(p5.Vector.sub(part.Physics.vel, this.Physics.vel), normal) - (rn1 - rn2));
    
        // Update angular velocities
        this.Physics.angularVel += rotationalImpulse / this.Mass;
        part.Physics.angularVel -= rotationalImpulse / part.Mass;
    }

    handleCollisionWithGround() {
        // Reverse velocity and adjust position
        this.Physics.vel.y *= -0.5; // Adjust damping factor as needed
        this.Position.y = height - this.Size.y / 2; // Ensure the part rests on the ground
        this.isGrounded = true;
    }

    drawBlock() {
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
            createVector(-this.Size.x / 2, this.Size.y / 2, this.Size.z / 2)
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

    drawSphere() {
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
