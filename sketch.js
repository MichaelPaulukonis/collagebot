this.focus();

let totalArt = 0;
let t = 0;

let defaultSize = {
  width: 800,
  height: 800,
};
let backgroundImage;
let backgroundColor;
let backgroundMode;
let elementImages = [];
let items = [];
let namer;
let modes = [];
let backgrounds = [];
let maxElements = 30;
let minElements = 5;
const backgroundModes = {
  Color: "color",
  Image: "image",
};
const itemModes = {
  Random: "random",
  Center: "center",
  Tinted: 'tinted',
  Masked: 'masked'
};
let itemMode = itemModes.Center;

// this function will load all media before setup()
function preload() {
  for (let i = 0; i <= 13; i++) {
    let fname = `./assets/backgrounds/background.${i.toString().padStart(5, "0")}.jpeg`;
    backgrounds[i] = loadImage(fname);
  }

  // load the rest of the images
  // change 5 to match your total number of images
  // alternatively (since this takes a while)
  // do a callback
  for (let i = 0; i <= 14; i++) {
    // let fname = `assets/transparent/${i.toString().padStart(6, "0")}.png`; // also the ones in images (non-transparent)
    let fname = `assets/menus/${i.toString().padStart(6, "0")}.jpg`;
    elementImages[i] = loadImage(fname);
  }
}

function setup() {
  modes = [
    "source-over", // if you use the underlying value, it can be outside of setup
    // see https://github.com/processing/p5.js/blob/v1.6.0/src/core/constants.js#LL451C22-L451C35
    BLEND,
    BLEND,
    BLEND,
    DARKEST,
    DARKEST,
    LIGHTEST,
    LIGHTEST,
    DIFFERENCE,
    MULTIPLY,
    MULTIPLY,
    MULTIPLY,
    EXCLUSION,
    SCREEN,
    SCREEN,
    OVERLAY,
    OVERLAY,
    HARD_LIGHT,
    SOFT_LIGHT,
    SOFT_LIGHT,
    SOFT_LIGHT,
    DODGE,
    DODGE,
    DODGE,
    BURN,
    BURN,
    ADD,
    ADD,
  ];

  // loading screen
  // createCanvas(defaultSize.width, defaultSize.height);
  // background('bisque')
  // textAlign(CENTER)
  // textSize(36)
  // text('... loading images ...', width/2, height / 2)

  reset();
  makeCollage();
}

const pickBackground = () => {
  backgroundMode = random(Object.values(backgroundModes));
  switch (backgroundMode) {
    case backgroundModes.Image:
      backgroundImage = random(backgrounds);
      break;

    case backgroundModes.Color:
    default:
      backgroundColor = color(random(255), random(255), random(255));
      break;
  }
};

const renderBackground = () => {
  switch (backgroundMode) {
    case backgroundModes.Image:
      image(
        backgroundImage,
        0,
        0,
        backgroundImage.width,
        backgroundImage.height
      );
      break;

    case backgroundModes.Color:
    default:
      background(backgroundColor);
      break;
  }
};

const reset = () => {
  namer = filenamer(datestring());
  pickBackground();
  if (backgroundImage) {
    createCanvas(backgroundImage.width, backgroundImage.height);
  } else {
    createCanvas(defaultSize.width, defaultSize.height);
  }
};

function makeCollage() {
  blendMode(BLEND);
  clear();
  renderBackground();
  let totalItems = random(minElements, maxElements);

  // item picks the image
  // but what if WE picked the image
  // and then a random number of them
  // BUT the blend mode was the same for all of the same image?
  items = [];
  for (let i = 0; i < totalItems; i++) {
    items.push(
      // itemMode === itemModes.Center ? new ItemCentered() : new ItemRandomImage()
      // new ItemTinted()
      new ItemMasked()
    );
  }

  items.forEach((item) => item.display());
}

function keyPressed() {
  // console.log(keyCode);
  if (keyCode === UP_ARROW) {
    maxElements++
  }
  else if (keyCode === DOWN_ARROW) {
    maxElements = Math.max(maxElements - 1, minElements)
  }
}

function keyTyped() {
  if (key === "d") {
    makeCollage();
  } else if (key === "s") {
    saveCanvas(namer(), "png");
  } else if (key === "r") {
    reset();
    makeCollage();
  } else if (key === "i") {
    const modeIndex = Object.values(itemModes).indexOf(itemMode);
    const nextIndex = (modeIndex + 1) % Object.keys(itemModes).length;
    itemMode = Object.values(itemModes)[nextIndex];
    makeCollage();
  }
  return false
}

const resize = (imgWidth, imgHeight, maxWidth) => ({
  w: maxWidth,
  h: (maxWidth / imgWidth) * imgHeight,
});

class ItemCore {
  constructor(image) {
    this.image = image;
    this.size = resize(this.image.width, this.image.height, random(40, 512));
    this.x = random(-(this.size.w / 2), width - 40);
    this.y = random(-(this.size.h / 2), height - 40);
    this.mode = random(modes);
  }

  predisplay() {
    // over-ridden
  }

  postdisplay() {
    // over-ridden
  }

  display() {
    this.predisplay()
    blendMode(this.mode);
    image(this.image, this.x, this.y, this.size.w, this.size.h);
    this.postdisplay()
  }
}

class ItemRandomImage extends ItemCore {
  // It's all random :person-shrugging:
  constructor() {
    super(random(elementImages));
  }
}

class ItemCentered extends ItemRandomImage {
  // everything is centered
  constructor() {
    super();
    this.x = width / 2 - this.size.w / 2;
    this.y = height / 2 - this.size.h / 2;
  }

  predisplay() {
    console.log('I will be centered!')
  }

  postdisplay() {
    console.log('i was centered!!!')
  }
}

class ItemTinted extends ItemRandomImage {
  constructor() {
    super()
    this.tint = random(['blue', 'yellow', 'red', 'orange'])
  }
  predisplay() {
    tint(this.tint)
  }

  postdisplay() {
    tint('white')
  }
}

class ItemMasked extends ItemRandomImage {
  constructor() {
    super()
    let customMask = createGraphics(this.image.width, this.image.height);
    customMask.noStroke();
    customMask.fill(255);
    customMask.circle(this.image.width / 2, this.image.height / 2, this.image.width);
    this.image.mask(customMask);
    // imageMode(CENTER);
  }
}
