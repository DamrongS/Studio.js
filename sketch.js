let workspace;
let part1;

function setup() 
{
  createCanvas(800, 800);
  workspace = new Workspace();

}

function draw() 
{
  background(51);
  WorkspacePhysicsHandler();
}

function WorkspacePhysicsHandler()
{
  for (let child of workspace.children) {
    let pointOfApplication = computeDynamicPoint(child);
    child.applyForce(workspace.gravity, pointOfApplication);
    child.rotate(); // Update rotation based on angular velocity
  }

  workspace.updatePhysics();
  workspace.draw();
}