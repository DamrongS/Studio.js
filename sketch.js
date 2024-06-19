let part1;

let xOff = 0;

function setup() {
  createCanvas(800, 800);
  let root = new Instance();
  root.Name = "Root";

  part1 = new Part(root);
  part1.Name = "Part1";
  part1.Position = createVector(200, 200);
  part1.Size = createVector(30, 30);
  part1.Orientation = createVector(0, 0, 0);
  part1.Shape = "Sphere";


}

function draw() 
{
  background(51);
  part1.draw();
  part1.Orientation = createVector(xOff, xOff, xOff);
  xOff += 0.01;
}