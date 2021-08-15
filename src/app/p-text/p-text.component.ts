import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalService } from 'src/app/services/global.service';
import {ColorObj, CssColorObj, MappedPixel, MouseObj, TextParticle, TextParticleSettings } from 'src/app/common/models/';

@Component({
  selector: 'app-p-text',
  templateUrl: './p-text.component.html',
  styleUrls: ['./p-text.component.scss']
})
export class PTextComponent implements AfterViewInit, OnDestroy {

  @ViewChild('Canvas')
  private canvas!: ElementRef<HTMLCanvasElement>;
  private context?: CanvasRenderingContext2D | null = null;
  canvasClass: string = 'canvasPoisitionText';

  private animationId: number = 0;

  private image: HTMLImageElement = new Image();
  private particlesArray: TextParticle[] = [];
  private mappedImage: MappedPixel[][] = [];

  // some default values
  private mouseRadius = 75;
  private mouse: MouseObj = new MouseObj(this.mouseRadius);

  /**
   * this section is for testing font settings
   */
  private fontSize: string = '36px';
  private fonts: string[] = this.globalService.fonts;
  private selectedFont: string = this.fontSize +' '+ this.fonts[0];

  @ViewChild('UsePresetCB')
  private usePresetCB!: ElementRef<HTMLInputElement>;
  private usePresetFlag: boolean = true;

  /**
   * Preset option sets
   * selectedTextParticleSettings sets various dependent settings
   *    -3 : Experiment with 2 imported images
   *    -2 : Experiment with an imported image
   *    -1 : "Star filled sky" and "moving black hole" effect
   *    0+ : Various text constellation effects
   */
  selectedTextParticleSettings: number = environment.text_selectedTextObj;
  canvasHeaderOffset: number = environment.canvasHeaderOffset;
  canvasSidebarOffset: number = 0;
  textParticleSettings: TextParticleSettings[] = [
    {
      color: 'white',
      font: this.selectedFont,
      text: 'Demo T',
      x: 5,
      y: 50,
      mapX: 0,
      mapY: 0,
      name: 'Demo',
      width: (window.innerWidth / 12),
      height: (window.innerHeight / 11),
      scale: 10,
      resultOffsetX: 10,  // negate the (x * scale)
      resultOffsetY: 10,
      constellationDistance: 20,
      constellationEffect: true,
    },
  ];

  availableCrayolaColors: CssColorObj[] = this.globalService.availableCrayolaColors;
  availableCssColors: CssColorObj[] = this.globalService.availableCssColors;
  selectedCssColorObject: CssColorObj = this.availableCssColors[0];

  customColorObj: ColorObj = new ColorObj();
  customTextParticleSettings!: TextParticleSettings;

  mouseMoveEventCallbackMethod = this.mouseMoveMethod.bind(this);

  // -------------------------------
  constructor(
    private globalService: GlobalService,) {
    this.matchCustomSettingsToPreset();
    this.customTextParticleSettings.name = "Custom Settings";
  }// ==============================

  ngAfterViewInit(): void {
    this.setupMouse();

    this.usePresetCB.nativeElement.checked = this.usePresetFlag;

    this.setupCanvas();
  }// ==============================

  ngOnDestroy(): void {
    this.globalService.clearCanvas(this.context!, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    cancelAnimationFrame(this.animationId);

    window.removeEventListener('mousemove', this.mouseMoveEventCallbackMethod);
  }// ==============================

  selectPresetTextParticleSettings(event: Event): void  {
    // this.debug("Preset selected: ".concat((<HTMLSelectElement>event.target).value));
    if(!this.usePresetFlag) {
      this.usePresetFlag = this.usePresetCB.nativeElement.checked = true;
    }// =====
    this.selectedTextParticleSettings = parseInt((<HTMLSelectElement>event.target).value);
    this.matchCustomSettingsToPreset();
    this.setTextParticleSettings();
  }// ==============================

  // selectCustomDirection(event: Event): void {
  //   this.debug((<HTMLSelectElement>event.target).value);
  //   this.customTextParticleSettings.direction = (<HTMLSelectElement>event.target).value;
  //   this.selectCustomRainParticleSettings();
  // }// ==============================

  toggleUsePresetFlag(): void {
    this.debug("toggleUsePresetFlag: ", this.usePresetCB.nativeElement.checked);
    this.usePresetFlag = this.usePresetCB.nativeElement.checked;
    if(this.usePresetFlag) {
      this.matchCustomSettingsToPreset();
    }
    this.setTextParticleSettings();
  }// ==============================

  private animate(): void {
    this.context!.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    for(let i = 0; i < this.particlesArray.length; i++) {
      this.particlesArray[i].draw(this.context!);
      this.particlesArray[i].update(this.context!, this.mouse);
    }// =====

    if(this.textParticleSettings[this.selectedTextParticleSettings].constellationEffect) {
      this.constellationEffect();
    }// =====

    if(this.selectedTextParticleSettings >= 0) {
      this.debugTextSpace();
    }// =====

    this.animationId = requestAnimationFrame(() => {
      this.animate();
    });// =====
  }// ==============================

  private constellationEffect() {
    let effectRange = this.textParticleSettings[this.selectedTextParticleSettings].constellationDistance;
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

  /**
   * Wrapper method around console.log to output only when in debugging mode.
   * It's parameters are set up just like console.log for ease of use.
   * @param message
   * @param optionalParams
   */
  private debug(message?: any, ...optionalParams: any): void {
    if(environment.debugging) {
      if(optionalParams.length > 0) {
        this.globalService.debug("PTextComponent:\n".concat(message), optionalParams);
      } else {
        this.globalService.debug("PTextComponent:\n".concat(message));
      }// =====
    }// =====
  }// ==============================

  // 'Preview' space
  private debugTextSpace(): void {
    this.globalService.drawRect(
      this.context!,
      'white',
      (this.textParticleSettings[this.selectedTextParticleSettings].mapX + this.canvasSidebarOffset),
      (this.textParticleSettings[this.selectedTextParticleSettings].mapY + this.canvasHeaderOffset),
      this.textParticleSettings[this.selectedTextParticleSettings].width,
      this.textParticleSettings[this.selectedTextParticleSettings].height);
    this.globalService.drawText(
      this.context!,
      this.textParticleSettings[this.selectedTextParticleSettings].text,
      (this.textParticleSettings[this.selectedTextParticleSettings].x + this.canvasSidebarOffset),
      (this.textParticleSettings[this.selectedTextParticleSettings].y + this.canvasHeaderOffset),
      this.textParticleSettings[this.selectedTextParticleSettings].color,
      this.textParticleSettings[this.selectedTextParticleSettings].font);
  }// ==============================

  private matchCustomSettingsToPreset(): void {
    this.customTextParticleSettings = Object.assign({}, this.textParticleSettings[this.selectedTextParticleSettings]);
  }// ==============================

  private mouseMoveMethod(event: any) {
    this.mouse.x = event.x;
    this.mouse.y = event.y;
    this.globalService.debug(this.mouse);
  }// ==============================

  /**
   * Separated out so settings can be changed on the fly,
   * note: new settings aren't visible until the particle is reset
   */
  private setTextParticleSettings(): void {
    // let tempSettingsObj = this.usePresetFlag ? this.textParticleSettings[this.selectedTextParticleSettings] : this.customTextParticleSettings;
    // let particleCount = this.particlesArray.length;
    // for(let i = 0; i < particleCount; i++) {
    //   this.particlesArray[i].setTextParticleSettings(tempSettingsObj);
    // }// =====
  }// ==============================

  /**
   * Different cavas settings based on 'selectedTextParticleSettings' value
   */
  private setupCanvas() {
    this.context = this.canvas.nativeElement.getContext('2d');
    let sidebarWidth = ((window.innerWidth / 12) * 2);
    this.canvasSidebarOffset = sidebarWidth;
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    this.globalService.debug("Inner width & height:", this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    switch(this.selectedTextParticleSettings) {
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
          this.particlesArray.push(new TextParticle((x*3 + this.canvasSidebarOffset), (y*3 + this.canvasHeaderOffset), tempMappedPixel));
        }// =====
      }// =====
      // this.mappedImage.push(row);
    }// =====
  }// ==============================

  private setupMappedText() {
    let pixels = this.context!.getImageData(
      (this.textParticleSettings[this.selectedTextParticleSettings].mapX + this.canvasSidebarOffset + 1),
      (this.textParticleSettings[this.selectedTextParticleSettings].mapY + this.canvasHeaderOffset + 1),
      this.textParticleSettings[this.selectedTextParticleSettings].width,
      this.textParticleSettings[this.selectedTextParticleSettings].height);
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
            (x * this.textParticleSettings[this.selectedTextParticleSettings].scale) + this.textParticleSettings[this.selectedTextParticleSettings].resultOffsetX
             + this.canvasSidebarOffset,
            (y * this.textParticleSettings[this.selectedTextParticleSettings].scale) + this.textParticleSettings[this.selectedTextParticleSettings].resultOffsetY
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
    window.addEventListener('mousemove', this.mouseMoveEventCallbackMethod);
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
