class Workspace {
    constructor() 
    {
        this.children = [];
        this.gravity = createVector(0, 0.1);
    }

    addPart(child) 
    {
        this.children.push(child);
    }

    updatePhysics() {
        // Apply forces to all parts
        for (let child of this.children) {
            let gravityForce = p5.Vector.mult(this.gravity, child.Mass);
            let pointOfApplication = computeDynamicPoint(child);
            child.applyForce(gravityForce, pointOfApplication);
        }

        // Check for collisions and update positions
        for (let i = 0; i < this.children.length; i++) {
            let partA = this.children[i];
            // Check collision with other parts
            for (let j = i + 1; j < this.children.length; j++) {
                let partB = this.children[j];
                if (partA.CanCollide && partB.CanCollide && this.checkCollision(partA, partB)) {
                    this.resolveCollision(partA, partB);
                }
            }
            // Check collision with ground
            if (partA.Position.y + partA.Size.y / 2 >= height && partA.CanCollide) {
                partA.isGrounded = true;
                this.handleCollisionWithGround(partA);
            } else {
                partA.isGrounded = false;
            }
        }

        // Update positions and rotations of all parts
        for (let child of this.children) {
            child.updatePhysics();
        }
    }

    handleCollisionWithGround(part) {
        // Reverse velocity and adjust position
        part.Physics.vel.y *= -0.5; // Adjust damping factor as needed
        part.Position.y = height - part.Size.y / 2; // Ensure the part rests on the ground
    }

    checkCollision(partA, partB) {
        // Implement collision detection logic between partA and partB
        // Example: AABB collision detection
        let halfWidthA = partA.Size.x / 2;
        let halfHeightA = partA.Size.y / 2;
        let halfWidthB = partB.Size.x / 2;
        let halfHeightB = partB.Size.y / 2;

        let deltaX = abs(partA.Position.x - partB.Position.x);
        let deltaY = abs(partA.Position.y - partB.Position.y);

        if (deltaX < halfWidthA + halfWidthB && deltaY < halfHeightA + halfHeightB) {
            return true;
        }
        return false;
    }

    draw() 
    {
        for (let child of this.children) {
            child.draw();
        }
    }

    boundingBoxCollision(partA, partB) 
    {
        return (
            partA.Position.x - partA.Size.x / 2 < partB.Position.x + partB.Size.x / 2 &&
            partA.Position.x + partA.Size.x / 2 > partB.Position.x - partB.Size.x / 2 &&
            partA.Position.y - partA.Size.y / 2 < partB.Position.y + partB.Size.y / 2 &&
            partA.Position.y + partA.Size.y / 2 > partB.Position.y - partB.Size.y / 2
        );
    }

    resolveCollision(partA, partB) 
    {
        // Calculate relative velocity
        let relativeVelocity = p5.Vector.sub(partB.Physics.vel, partA.Physics.vel);

        // Calculate relative velocity in terms of the normal direction
        let normal = p5.Vector.sub(partB.Position, partA.Position);
        let distance = normal.mag();
        normal.normalize();

        // Relative velocity in terms of normal direction
        let velAlongNormal = p5.Vector.dot(relativeVelocity, normal);

        // Only resolve if they are moving towards each other
        if (velAlongNormal > 0) 
        {
            return;
        }

        // Calculate restitution (elasticity)
        let restitution = 0.3; // Adjust this value for different elasticity

        // Calculate impulse scalar
        let j = -(1 + restitution) * velAlongNormal;
        j /= 1 / partA.Mass + 1 / partB.Mass;

        // Apply impulse
        let impulse = p5.Vector.mult(normal, j);
        partA.Physics.vel.sub(p5.Vector.mult(impulse, 1 / partA.Mass));
        partB.Physics.vel.add(p5.Vector.mult(impulse, 1 / partB.Mass));

        // Friction
        let tangent = p5.Vector.sub(relativeVelocity, p5.Vector.mult(normal, velAlongNormal));
        tangent.normalize();

        // Calculate friction impulse magnitude
        let jt = -p5.Vector.dot(relativeVelocity, tangent);
        jt /= 1 / partA.Mass + 1 / partB.Mass;

        // Coulomb's law of friction
        let mu = Math.sqrt(partA.FrictionCoeff.static * partB.FrictionCoeff.static);
        let frictionImpulse;
        if (Math.abs(jt) < j * mu) 
        {
            frictionImpulse = p5.Vector.mult(tangent, jt);
        } 
        else 
        {
            let dynamicFriction = Math.sqrt(partA.FrictionCoeff.dynamic * partB.FrictionCoeff.dynamic);
            frictionImpulse = p5.Vector.mult(tangent, -j * dynamicFriction);
        }

        // Apply friction impulse
        partA.Physics.vel.sub(p5.Vector.mult(frictionImpulse, 1 / partA.Mass));
        partB.Physics.vel.add(p5.Vector.mult(frictionImpulse, 1 / partB.Mass));
    }
}

function computeDynamicPoint(part) {
    // Compute point relative to the part's center or base
    return createVector(0, part.Size.y / 2); // Adjust based on part's shape and desired force application point
  }