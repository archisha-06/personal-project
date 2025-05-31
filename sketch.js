 let pg;
let lines = [
  "It begins in silence...",
  "You look around…",
  "Everything is pitch dark.",
  "Your head hurts.",
  "You don’t remember anything.",
  "Who are you?",
  "Where are you?",
  "You see a floating note.",
  "Somewhere far from Earth, closer to thought.",
  "They left messages in the dark..."
];
let displayLines = [];
let currentLine = 0;
let charIndex = 0;
let typingInterval = 100;

let lightZ = -40000; // After the last plane
let crossedLight = false;
let finalMessageShown = false;
let finalMessage = "You made it through the dark. You are light.";


let stars = [];
let camZ = 0;
let showGalaxy = false;

let typingStarted = false;  // NEW - flag for typing
let glitchIntervalId;       // NEW - to hold glitch cursor interval
let glowTexture;
let gradientOverlay;

let confessions = [
  "I miss them every day.",
    "I’m scared of my future.",
    "I lied to protect them.",
    "I want to disappear for a while.",
    "I wish I said yes.",
    "I still dream about that night."
];

let planesGraphics = [];

function wrapText(pg, text, x, y, maxWidth, lineHeight) {
  let words = text.split(' ');
  let line = '';
  let lines = [];
  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let testWidth = pg.textWidth(testLine);
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  let totalHeight = lines.length * lineHeight;
  let startY = y - totalHeight / 2 + lineHeight / 2;

  for (let i = 0; i < lines.length; i++) {
    pg.text(lines[i], x, startY + i * lineHeight);
  }
}


  function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

   gradientOverlay = createGraphics(width, height);
  for (let y = 0; y < gradientOverlay.height; y++) {
    let inter = map(y, 0, gradientOverlay.height, 0, 1);
    let c = lerpColor(color(10, 0, 20, 50), color(30, 0, 40, 180), inter);
    gradientOverlay.stroke(c);
    gradientOverlay.line(0, y, gradientOverlay.width, y);
  }

  // Create textures for each confession
  for (let i = 0; i < confessions.length; i++) {
    let pgTemp = createGraphics(300, 200);
    pgTemp.clear();
pgTemp.noStroke();
// Set a translucent black background
pgTemp.fill(0, 0, 0, 180);
pgTemp.rect(0, 0, pgTemp.width, pgTemp.height);
pgTemp.textSize(20);
pgTemp.textAlign(CENTER, CENTER);
// Set white text
pgTemp.fill(255);
wrapText(pgTemp, confessions[i], pgTemp.width / 2, pgTemp.height / 2, 260, 24);

    planesGraphics.push(pgTemp);
  }

  for (let i = 0; i < lines.length; i++) {
    displayLines.push("");
  }

  // Start the glitch cursor effect on the typewriter text before typing starts
  startGlitchCursor();

  // Delay typing start by a few seconds after loading screen is gone
    setTimeout(() => {
    document.getElementById("loading-screen").classList.add("fade-out");
setTimeout(() => {
  document.getElementById("loading-screen").style.display = "none";
}, 1000); // after fade-out transition

    stopGlitchCursor();
    startTyping();
  }, 3500); // 3.5 seconds delay


  // Create spiral galaxy stars (unchanged)
  let arms = 5;
  let starCount = 3000;
  let spread = 1700;
  // Update this inside setup():
for (let i = 0; i < starCount; i++) {
  let arm = i % arms;
  let angle = (i / starCount) * TWO_PI * arms + random(-0.3, 0.3);
  let radius = sqrt(random(1)) * spread;
  let x = cos(angle + arm * TWO_PI / arms) * radius + random(-100, 100);
  let y = sin(angle + arm * TWO_PI / arms) * radius + random(-100, 100);
  let z = random(-80000, 0);

  let starColor = color(
    random(180, 255), // R: more variety
    random(100, 200), // G
    random(200, 255), // B
    random(100, 255)  // Alpha
  );

  let size = random(0.5, 2.5);

  stars.push({ pos: createVector(x, y, z), col: starColor, size });
}


  glowTexture = createGraphics(512, 512);
glowTexture.noStroke();
for (let r = 256; r > 0; r--) {
  let alpha = map(r, 256, 0, 0, 255);
  glowTexture.fill(255, 255, 255, alpha * 0.15); // soft white light
  glowTexture.ellipse(256, 256, r * 2);
}

}

function startGlitchCursor() {
  const typewriter = document.getElementById("typewriter");
  let visible = true;
  glitchIntervalId = setInterval(() => {
    // toggle '|' visible or invisible with glitch colors
    if (visible) {
      typewriter.innerText = "|";
      typewriter.style.color = randomGlitchColor();
    } else {
      typewriter.innerText = "";
    }
    visible = !visible;
  }, 150);
}

function stopGlitchCursor() {
  clearInterval(glitchIntervalId);
  const typewriter = document.getElementById("typewriter");
  typewriter.style.color = "white";
  typewriter.innerText = "";
}

function randomGlitchColor() {
  const colors = ["#ff005c", "#00fff7", "#ff00a9", "#00ffd2"];
  return colors[floor(random(colors.length))];
}

function startTyping() {
  typingStarted = true;
  let typeInterval = setInterval(() => {
    if (currentLine < lines.length) {
      displayLines[currentLine] += lines[currentLine][charIndex] || "";
      charIndex++;
      if (charIndex >= lines[currentLine].length) {
        currentLine++;
        charIndex = 0;
      }
      document.getElementById("typewriter").innerText = displayLines.join("\n");
    } else {
      clearInterval(typeInterval);
      // Show scroll hint after typing is done
      document.getElementById("scrollHint").style.display = "block";
    }
  }, typingInterval);
}
let glowPulse = 0;
let portalActivated = false;

function drawNebulae() {
  push();
  noStroke();
  for (let i = 0; i < 8; i++) {
    push();
    let x = random(-1500, 1500);
    let y = random(-1500, 1500);
    let z = random(-30000, 0);
    translate(x, y, z);
    fill(random(100, 255), random(50, 200), random(150, 255), 30); // Pastel nebula
    rotateZ(random(TWO_PI));
    rotateX(random(TWO_PI));
    ellipse(0, 0, random(500, 1200), random(400, 1000));
    pop();
  }
  pop();
}

function draw() {
  background(0);

  if (showGalaxy) {
    translate(0, 0, camZ);
    drawNebulae();
    image(gradientOverlay, -width / 2, -height / 2);

    // Galaxy rotation and rendering (unchanged)
    push();
    rotateZ(frameCount * 0.0002);

    push();
    translate(0, 0, -1000);
    noStroke();
    for (let i = 400; i > 0; i -= 10) {
      fill(255, 180, 255, map(i, 400, 0, 0, 60));
      ellipse(0, 0, i, i);
    }
    pop();

for (let s of stars) {
  push();
  let sparkle = sin(frameCount * 0.05 + s.pos.z * 0.001) * 0.5;
  stroke(s.col);
  strokeWeight(s.size + sparkle);
  translate(s.pos.x, s.pos.y, s.pos.z);
  point(0, 0);
  pop();
}



    //planes
    let planeDistances = [-10000, -18000, -20000, -26000, -32000, -36000];
for (let i = 0; i < planesGraphics.length; i++) {
  let glowScale = 2 + sin(frameCount * 0.03 + i) * 0.2; // subtle pulse


  push();
  translate(0, 0, planeDistances[i]);

  // Glowing background light
  push();
   rotateZ(frameCount * 0.005);
  rotateY(-rotationY);
  rotateX(-rotationX);
  texture(glowTexture);
  noStroke();
  plane(400 * glowScale, 400 * glowScale);
  pop();

  // Main image plane
  push();
   rotateZ(frameCount * 0.005);
  rotateY(-rotationY);
  rotateX(-rotationX);
  texture(planesGraphics[i]);
  noStroke();
  plane(300, 200);
  pop();

  pop();
}


   // Draw glowing light portal after all planes:
    push();
    translate(0, 0, lightZ);
    noStroke();

    let glowPulse = 20 + sin(frameCount * 0.05) * 20;

noStroke();
for (let i = 400 + glowPulse; i > 0; i -= 10) {
  fill(255, 255, 255, map(i, 400 + glowPulse, 0, 0, 150));
  ellipse(0, 0, i, i);
}

    fill(255);
    ellipse(0, 0, 80, 80);
    pop();

if (!portalActivated && camZ > -lightZ + 200) {
  portalActivated = true;

  // Fade out
  document.body.style.transition = "opacity 1.5s ease";
  document.body.style.opacity = 0;

  setTimeout(() => {
    window.location.href = "space.html";
  }, 1500);
}
  }
}

function mouseWheel(event) {
  if (!showGalaxy) {
    showGalaxy = true;
    document.getElementById("start").style.display = "none";
    document.getElementById("scrollHint").style.display = "none";
  }
  camZ += event.delta;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}