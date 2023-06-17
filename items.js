
class ItemCore {
  constructor(image) {
    this.image = image.get()
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

class ItemCircle extends ItemRandomImage {
  constructor() {
    super()
    let customMask = createGraphics(this.image.width, this.image.height);
    customMask.noStroke();
    customMask.fill(255);
    customMask.circle(this.image.width / 2, this.image.height / 2, this.image.width);
    this.image.mask(customMask);
  }
}

// NOTE: if image and mask are different size ratios, things will be weird
class ItemMasked extends ItemRandomImage {
  constructor() {
    super()
    let customMask = random(transparentImages)
    this.image.mask(customMask);
    this.mode = BLEND
  }
}