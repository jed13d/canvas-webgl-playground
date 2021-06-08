import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalService } from 'src/app/services/global.service';
import { MappedPixel, MouseObj, TextParticle } from 'src/app/common/models/';

@Component({
  selector: 'app-p-text',
  templateUrl: './p-text.component.html',
  styleUrls: ['./p-text.component.scss']
})
export class PTextComponent implements AfterViewInit {

  @ViewChild('Canvas')
  private canvas!: ElementRef<HTMLCanvasElement>;
  private context?: CanvasRenderingContext2D | null = null;
  canvasClass: string = 'canvasPoisitionText';

  private image: HTMLImageElement = new Image();
  private particlesArray: TextParticle[] = [];
  private mappedImage: MappedPixel[][] = [];

  // some default values
  private mouseRadius = 75;
  private mouse: MouseObj = new MouseObj(this.mouseRadius);

  /**
   * this section is for testing font settings
   */
  private fontSize: string = '20px';
  private fonts: string[] = [
    'Arial',                'Verdana',
    'Tahoma',               'Trebuchet MS',
    'Impact',               'Times New Roman',
    'Didot',                'Georgia',
    'American Typewriter',  'Andalé Mono',
    'Courier',              'Lucida Console',
    'Monaco',               'Bradley Hand',
    'Brush Script MT',      'Luminari',
    'Comic Sans MS',
  ];
  private demoFont: string = this.fontSize +' '+ this.fonts[0];

  /**
   * Preset option sets
   * selectedTextObj sets various dependent settings
   *    -3 : Experiment with 2 imported images
   *    -2 : Experiment with an imported image
   *    -1 : "Star filled sky" and "moving black hole" effect
   *    0+ : Various text constellation effects
   */
  selectedTextObj: number = environment.text_selectedTextObj;
  canvasHeaderOffset: number = environment.canvasHeaderOffset;
  private textObjs: {
    color: string;
    font: string;
    text: string;
    x: number;
    y: number;
    mapX: number;
    mapY: number;
    width: number;
    height: number;
    scale: number;
    resultOffsetX: number;
    resultOffsetY: number;
    constellationDistance: number;
    constellationEffect: boolean;
  }[] = [
    {
      color: 'white',
      font: this.demoFont,
      text: 'A',
      x: 5,
      y: 50,
      mapX: 0,
      mapY: 0,
      width: (window.innerWidth / 11) + 15,
      height: (window.innerHeight / 11),
      scale: 10,
      resultOffsetX: 10,  // negate the (x * scale)
      resultOffsetY: 10,
      constellationDistance: 20,
      constellationEffect: true,
    },
  ];

  // -------------------------------
  constructor(
    private globalService: GlobalService,) { }

  ngAfterViewInit(): void {
    this.setupMouse();

    this.setupCanvas();
  }// ==============================

  private animate() {
    this.context!.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    for(let i = 0; i < this.particlesArray.length; i++) {
      switch(this.selectedTextObj) {
        // ----------
        case -1:
          this.particlesArray[i].draw(this.context!);
          break;

        // ----------
        case 0:
        default:
          this.particlesArray[i].draw(this.context!);
          break;
      }// =====
      this.particlesArray[i].update(this.context!, this.mouse);
    }// =====

    if(this.textObjs[this.selectedTextObj].constellationEffect) {
      this.constellationEffect();
    }// =====

    if(this.selectedTextObj >= 0) {
      this.debugTextSpace();
    }// =====

    requestAnimationFrame(() => {
      this.animate();
    });
  }// ==============================

  private constellationEffect() {
    let effectRange = this.textObjs[this.selectedTextObj].constellationDistance;
    let particleCount = this.particlesArray.length;
    for(let a = 0; a < particleCount; a++) {
      for(let b = a; b < particleCount; b++) {
        let dx = this.particlesArray[a].getX() - this.particlesArray[b].getX();
        let dy = this.particlesArray[a].getY() - this.particlesArray[b].getY();
        let distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < effectRange) {
          let opacityValue = 1;
          this.context!.strokeStyle = 'rgba(255,255,255,'+ opacityValue +')';
          this.context!.lineWidth = 2;
          this.context!.beginPath();
          this.context!.moveTo(this.particlesArray[a].getX(), this.particlesArray[a].getY());
          this.context!.lineTo(this.particlesArray[b].getX(), this.particlesArray[b].getY());
          this.context!.stroke();
        }
      }
    }

  }// ==============================

  // used to find selector space of text
  private debugTextSpace() {
    switch(this.selectedTextObj) {
      // ----------
      case -2:
        this.globalService.drawRect(this.context!, 'white', 0, (0 + this.canvasHeaderOffset), 750, 750);
        break;

      // ----------
      case 0:
        this.globalService.drawRect(this.context!, 'white',
          this.textObjs[this.selectedTextObj].mapX,
          (this.textObjs[this.selectedTextObj].mapY + this.canvasHeaderOffset),
          this.textObjs[this.selectedTextObj].width,
          this.textObjs[this.selectedTextObj].height);
        this.globalService.drawText(
          this.context!,
          this.textObjs[this.selectedTextObj].text,
          this.textObjs[this.selectedTextObj].x,
          this.textObjs[this.selectedTextObj].y + this.canvasHeaderOffset,
          this.textObjs[this.selectedTextObj].color,
          this.textObjs[this.selectedTextObj].font);
        break;
      default:
        this.globalService.drawRect(this.context!, 'white', 0, (0 + this.canvasHeaderOffset), 100, 100);
        break;
    }// =====
  }// ==============================

  /**
   * Different cavas settings based on 'selectedTextObj' value
   */
  private setupCanvas() {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    this.globalService.debug("Inner width & height:", window.innerWidth, window.innerHeight);

    switch(this.selectedTextObj) {
      // ----------
      case -2:
        this.image.src = environment.imageSrc;
        this.image.addEventListener('load', () => {
          this.globalService.drawImage(this.context!, this.image, this.image.width, this.image.height);
          this.setupMappedImage();
          this.animate();
        });
        break;

      // ----------
      case -1:
        this.setupParticleStars();
        this.animate();
        break;

      // ----------
      case 0:
      default:
        this.debugTextSpace();
        this.setupMappedText();
        this.animate();
        break;
    }// =====

  }// ==============================

  /**
   * Generates image data of entire canvas area.
   * Used with imported images.
   */
  private setupMappedImage() {
    let pixels = this.context!.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    for(let y = 0; y < this.canvas.nativeElement.height; y+=2) {
      // let row: MappedPixel[] = [];
      for(let x = 0; x < this.canvas.nativeElement.width; x+=2) {
        let red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
        let green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
        let blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
        if(red > 0 || green > 0 || blue > 0) {
          let brightness = this.globalService.calculatePixelRelativeBrightness(red, green, blue);
          let tempMappedPixel = new MappedPixel(
            brightness,
            "rgb("+ red +", "+ green +", "+ blue +")"
          );
          // row.push(tempMappedPixel);// =====
          this.particlesArray.push(new TextParticle(x*3, (y*3 + this.canvasHeaderOffset), tempMappedPixel));
        }// =====
      }// =====
      // this.mappedImage.push(row);
    }// =====
  }// ==============================

  private setupMappedText() {
    let pixels = this.context!.getImageData(
      this.textObjs[this.selectedTextObj].mapX,
      (this.textObjs[this.selectedTextObj].mapY + this.canvasHeaderOffset),
      this.textObjs[this.selectedTextObj].width,
      this.textObjs[this.selectedTextObj].height);
    this.globalService.debug("pixels:", pixels);

    for(let y = 0, y2 = pixels.height; y < y2; y++) {
      // let row: MappedPixel[] = [];
      for(let x = 0, x2 = pixels.width; x < x2; x++) {
        let alpha = pixels.data[(y * 4 * pixels.width) + (x * 4) + 3];
        if(alpha > 128) {
          let red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
          let green = pixels.data[(y * 4 * pixels.width) + (x * 4) + 1];
          let blue = pixels.data[(y * 4 * pixels.width) + (x * 4) + 2];
          let brightness = this.globalService.calculatePixelRelativeBrightness(red, green, blue);
          let tempMappedPixel = new MappedPixel(
            brightness,
            "rgb("+ red +", "+ green +", "+ blue +")"
          );
          // row.push(tempMappedPixel);// =====
          this.particlesArray.push(new TextParticle(
            (x * this.textObjs[this.selectedTextObj].scale) + this.textObjs[this.selectedTextObj].resultOffsetX,
            (y * this.textObjs[this.selectedTextObj].scale) + this.textObjs[this.selectedTextObj].resultOffsetY
             + this.canvasHeaderOffset,
            tempMappedPixel));
        }// =====
      }// =====
      // this.mappedImage.push(row);
    }// =====
    this.globalService.debug("particles:", this.particlesArray, "mapped:", this.mappedImage);
  }// ==============================

  /**
   * Link mousemove listener to update mouse object
   */
  private setupMouse() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = event.x;
      this.mouse.y = event.y;
      this.globalService.debug(this.mouse);
    });// =====
  }// ==============================

  /**
   * Generates pixels in random locations within the canvas space
   */
  private setupParticleStars() {
    let numberOfParticles = 1000
    let tempMappedPixel = new MappedPixel(
      255,
      "rgb("+ 255 +", "+ 255 +", "+ 255 +")"
    );
    for(let i = 0; i < numberOfParticles; i++) {
      let x = Math.random() * this.canvas.nativeElement.width;
      let y = Math.random() * this.canvas.nativeElement.height;
      this.particlesArray.push(new TextParticle(x, y, tempMappedPixel));
    }// =====
  }// ==============================
}// ==============================
