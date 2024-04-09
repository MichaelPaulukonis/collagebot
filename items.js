
class ItemCore {
  constructor(image) {
    this.image = image.get()
    this.size = {
      w: this.image.width,
      h: this.image.height
    }
    this.x = 0
    this.y = 0
    this.mode = null
  }

  clone() {
    let cloned = Object.assign(new this.constructor(), this)
    cloned.image = this.image.get()
    cloned.size = { w: this.size.w, h: this.size.h }
    cloned.x = this.x
    cloned.y = this.y
    cloned.mode = this.mode
    return cloned
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
    this.size = resize(this.image.width, this.image.height, random(40, 512));
    this.x = random(-(this.size.w / 2), width - 40);
    this.y = random(-(this.size.h / 2), height - 40);
    this.mode = random(modes);
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
  }

  postdisplay() {
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

  clone() {
    let cloned = super.clone()
    cloned.tint = this.tint
    return cloned
  }
}

class ItemCircle extends ItemRandomImage {
  constructor() {
    super()
    this.customMask = createGraphics(this.image.width, this.image.height);
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

class ItemTextMasked extends ItemRandomImage {
  getText = () => {
    return (Math.random() + 1).toString(36).substring(1)
  }

  constructor() {
    super()
    let customMask = createGraphics(this.image.width, this.image.height);
    customMask.noStroke();
    customMask.fill(255);
    customMask.textSize(512)
    customMask.text(this.getText(), this.image.width / 2, this.image.height / 2)
    this.image.mask(customMask);
    this.mode = BLEND
  }

  clone() {
    let cloned = super.clone()
    cloned.text = this.getText()
    return cloned
  }
}

// test/letters
// letter mask
// some shapes (no masks)