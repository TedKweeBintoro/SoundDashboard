
let mic, fft, micLevel, octBands;
let octDiv = 12;
let bins = 512;
let smoothing = 0.3;
let threshold = 10000;
let bg = 240;
let strokeFill = 200;
let fr = 15;
let acc = 0.001;
let enabled = false;
let dark = false;
let logoColor = (76, 175, 80);

let analysis = [];
let logAnalysis = [];

let started = false;
let playing = false;

mic = new p5.AudioIn();
fft = new p5.FFT(smoothing, bins);
fft.setInput(mic);
octBands = fft.getOctaveBands(octDiv);
function start() {
  if (!enabled) {
    eq.userStartAudio();
    mic.start(() => enabled = true);
    started = true;
    document.getElementById("demo").disabled = true;
    document.getElementById("demo").style.cursor = "not-allowed";
  }
  if (dark) {
    document.getElementById("start").classList.toggle("darkbutton");
    document.getElementById("start").classList.toggle("deaddarkbutton");
    document.getElementById("pause").classList.toggle("darkbutton");
    document.getElementById("pause").classList.toggle("deaddarkbutton");
    document.getElementById("stop").classList.add("darkbutton");
    document.getElementById("stop").classList.remove("deaddarkbutton");
  } else {
    document.getElementById("start").classList.toggle("button");
    document.getElementById("start").classList.toggle("deadbutton");
    document.getElementById("pause").classList.toggle("button");
    document.getElementById("pause").classList.toggle("deadbutton");
    document.getElementById("stop").classList.add("button");
    document.getElementById("stop").classList.remove("deadbutton");
  }
  playing = true;
}
function stop() {
  if (started) {
    mic.stop();
    window.location.href = './Results.html';
  }
}
function pause() {
  mic.stop();
  enabled = false;
  if (dark) {
    document.getElementById("start").classList.toggle("deaddarkbutton");
    document.getElementById("start").classList.toggle("darkbutton");
    document.getElementById("pause").classList.toggle("darkbutton");
    document.getElementById("pause").classList.toggle("deaddarkbutton");
  } else {
    document.getElementById("start").classList.toggle("deadbutton");
    document.getElementById("start").classList.toggle("button");
    document.getElementById("pause").classList.toggle("button");
    document.getElementById("pause").classList.toggle("deadbutton");
  }
  playing = false;
}
function darkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
  document.getElementById("dmIcon").classList.toggle("fa-sun");
  document.getElementById("dmIcon").classList.toggle("fa-moon");
  dark = !dark;
  if (dark) {
    bg = 40;
    strokeFill = 55;
    document.getElementById("help").style.color = "White"
    x = document.querySelectorAll(".button");
    for (b = 0; b < x.length; b++) {
      x[b].classList.toggle("button");
      x[b].classList.toggle("darkbutton");
    }
    x = document.querySelectorAll(".deadbutton");
    for (b = 0; b < x.length; b++) {
      x[b].classList.toggle("deadbutton");
      x[b].classList.toggle("deaddarkbutton");
    }
    logoColor = (0, 0, 139);
  } else {
    bg = 240;
    strokeFill = 200;
    document.getElementById("help").style.color = "Blue"
    x = document.querySelectorAll(".darkbutton");
    for (b = 0; b < x.length; b++) {
      x[b].classList.toggle("button");
      x[b].classList.toggle("darkbutton");
    }
    x = document.querySelectorAll(".deaddarkbutton");
    for (b = 0; b < x.length; b++) {
      x[b].classList.toggle("deadbutton");
      x[b].classList.toggle("deaddarkbutton");
    }
    logoColor = (76, 175, 80);
  }
}
function demo() {
  var checkBox = document.getElementById("demo");
  checkBox.checked ? acc = 1 : acc = 0.001;
}

let wsketch = function (s) {
  let img;

  function preload() {
    s.textFont("Montserrat");
    img = loadImage('Images/logo.PNG');
  }

  function setup() {
    canvas = s.createCanvas(300, 300);
    s.resizeCanvas(s.windowWidth, s.windowHeight * 0.3);
    canvas.position = (0, 0)
  }

  function draw() {
    // Displays the image at point (0, height/2) at half size
    image(img, canvas.width / 2, 0)
    s.canvas.color = 'DarkBlue';
  } 
};

//Sketch for the equalizer at top of page
let gsketch = (s) => {
  let barWidth;
  let canvas;

  s.setup = () => {
    canvas = s.createCanvas(300, 300);
    let y = s.windowHeight - s.windowHeight / 5;
    s.resizeCanvas(s.windowWidth - 20, s.windowHeight / 5 - 20);
    canvas.position(10, y + 10);
    s.noStroke();
    s.frameRate(fr);
    s.textFont("Montserrat");
  };

  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth - 20, s.windowHeight / 5 - 20);
    let y = s.windowHeight - s.windowHeight / 5;
    canvas.position(10, y + 10);
  };

  s.draw = () => {
    let scale = s.width / 300 < s.height / 300 ? s.width / 300 : s.height / 300;
    s.scale(scale);
    let width = (s.width * 1) / scale;
    let height = (s.height * 1) / scale;
    s.background(bg);
    analysis = fft.analyze(bins, 'dB');
    logAnalysis = fft.logAverages(octBands).map((x) => x + 140);
    barWidth = width / logAnalysis.length;
    for (i = 0; i < logAnalysis.length; i++) {
      s.fill(
        s.map(logAnalysis[i], 0, 140, 0, 512),
        s.map(logAnalysis[i], 0, 140, 512, 0),
        0
      );
      s.rect(
        i * barWidth,
        height,
        barWidth,
        s.map(logAnalysis[i], 0, 140, 0, -height)
      );
    }
    // axix labels
    s.fill(150);
    s.textSize(20);
    s.textAlign(s.LEFT, s.TOP);
    s.text('140dB', 0, 0);
    s.textAlign(s.LEFT);
    s.text('70dB', 0, height / 2);
    s.textAlign(s.LEFT, s.BOTTOM);
    s.text('0', 0, height);
    s.textAlign(s.CENTER);
    s.text(
      s.floor(octBands[30].lo) + 'Hz',
      width * 30 / 128,
      height
    );
    s.text(
      s.floor(octBands[48].hi) + 'Hz',
      width * 48 / 128,
      height
    );
    s.textAlign(s.RIGHT);
    s.text(s.floor(octBands[octBands.length - 1].hi) + 'Hz', width, height);
  };
};

//Prototype used for the 3x3 grid of dial graphs
let sketchPrototype = function (p) {
  // "public" variables
  p.bandRange = { start: 0, end: octBands.length };
  p.energyRange = { min: 0, max: 140 };
  p.maxDose = 360;
  p.graph = '';
  p.graphDescription = '';
  p.curDose = 0;
  let curAngle = 271;
  let canvas;

  p.setup = function () {
    p.textFont("Montserrat");
    canvas = p.createCanvas(300, 300);
    p.resizeCanvas(p.windowWidth / 3, p.windowHeight / 2);
    let y = p.windowHeight * 0.3
    switch (p.graph) {
      case 'low':
        canvas.x = 0;
        p.graphDescription = "C₀-F₂";
        break;
      case 'mid':
        canvas.x = p.windowWidth / 3;
        p.graphDescription = "F₂-B₃";
        break;
      case 'hi':
        canvas.x = p.windowWidth / 3 * 2;
        p.graphDescription = "B₃-D♯₇";
        break;
    }
    canvas.position(canvas.x, y);
    p.angleMode(p.DEGREES);
    p.frameRate(fr);
    document.getElementById('alert').style.visibility = 'hidden';
    p.scAlert = 0;
    update();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth / 3, p.windowHeight / 2);
    let y = p.windowHeight * 0.3
    switch (p.graph) {
      case 'low':
        canvas.x = 0;
        break;
      case 'mid':
        canvas.x = p.windowWidth / 3;
        break;
      case 'hi':
        canvas.x = p.windowWidth / 3 * 2;
        break;
    }
    canvas.position(canvas.x, y);
  };

  p.draw = function () {
    if (playing) {
      let avgEnergy = 0;

      // calculate average energy
      for (i = p.bandRange.start; i < p.bandRange.end; i++) {
        avgEnergy += logAnalysis[i];
      }
      avgEnergy = avgEnergy / (p.bandRange.end - p.bandRange.start);

      // increment timer and update arc angle
    
      //formula for calculating max time is y = 8(1/2)^((x-85)/3)
      //coincidentally, formula for dose is 1/y
      //since at 94db max time is 1 hr = 360 sec
      //maxDose set to 360, curDose set to 1 so after 1 hour it will go over
      p.curDose += (p.deltaTime * acc) / (8 * Math.pow(.5, (avgEnergy - 85) / 3));
      curAngle = p.map(p.curDose, 0, p.maxDose, 271, 630);
    }
    update();
  };

  function update() {
    let scale = p.width / 300 < p.height / 300 ? p.width / 300 : p.height / 300;
    p.scale(scale);
    let width = (p.width * 1) / scale;
    let height = (p.height * 1) / scale;
    let iteration = 0;
    p.background(bg);
    // draw chart
    p.strokeWeight(25);
    p.strokeCap(p.SQUARE);
    p.noFill();
    p.stroke(strokeFill);
    p.circle(width / 2, height / 2, 200);
    // color
    p.stroke(
      p.map(p.curDose, 0, p.maxDose, 0, 512), // red
      p.map(p.curDose, 0, p.maxDose, 512, 0), // green
      0
    );
    p.noFill();
    p.arc(
      width / 2,
      height / 2,
      200,
      200,
      270,
      p.constrain(curAngle, 270, 630)
    );

    /* attempt to display sound intensities within arc- broken
    p.stroke(
      p.map(avgEnergy, 0, 140, 0, 512), // red
      p.map(avgEnergy, 0, 140, 512, 0), // green
      0
    );
    p.noFill();
    if (started) {
      p.arc(
        width / 2,
        height / 2,
        200,
        200,
        270 + p.prevAngle,
        p.constrain(271 + p.curDose, 270, 630)
      );
      p.prevAngle = p.curDose;
    }*/

    // outside arc
    if (p.curDose >= p.maxDose) {
      if (p.scAlert === 0) {
        let text = document.createTextNode('ALERT\n' + p.graphDescription);
        let alDiv = document.getElementById('alert');
        alDiv.appendChild(text);
        alDiv.style.height = p.canvas.height * 0.3;
        alDiv.style.visibility = 'visible';
        setTimeout(function () {
          alDiv.style.visibility = 'hidden';
          alDiv.textContent = '';
        }, 5000);
      }
      p.scAlert++;
      p.stroke(200);
      p.circle(width / 2, height / 2, 250);
      p.stroke(p.map(p.curDose, p.maxDose, p.maxDose * 2, 250, 0), 0, 0);
      p.arc(
        width / 2,
        height / 2,
        250,
        250,
        270,
        p.constrain(curAngle, 630, 990)
      );
    }

    // draw text
    // percent
    p.noStroke();
    p.textSize(50);
    p.fill(127);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(p.floor((p.curDose / p.maxDose) * 100) + '%', width / 2, height / 2);
    // time
    p.textSize(10);
    // frequency range
    let lowFrequency = p.floor(octBands[p.bandRange.start].lo);
    let hiFrequency = p.floor(octBands[p.bandRange.end].hi);
    p.textAlign(p.CENTER);
    p.text(lowFrequency + 'Hz - ' + hiFrequency + 'Hz\n' + p.graphDescription, width / 2, height / 2 + 50);
  }
};

//not currently used- could be reimplemented in future
function formatTime(seconds) {
  let date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

let divs = document.querySelectorAll('div.graph');

//based on human vocal range
let lBandCap = 30;
let mBandCap = 48;
let hBandCap = octBands.length;

let eq = new p5(gsketch, document.querySelector('div.eq'));
let low = new p5(sketchPrototype, divs[0]);
low.bandRange = { start: 0, end: lBandCap - 1 };
low.graph = 'low';

let mid = new p5(sketchPrototype, divs[1]);
mid.bandRange = { start: lBandCap, end: mBandCap - 1 };
mid.graph = 'mid';

let hi = new p5(sketchPrototype, divs[2]);
hi.bandRange = { start: mBandCap, end: hBandCap - 1 };
hi.graph = 'hi';

let warning = new p5(wsketch, document.querySelector('div.warning'));