import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalService } from 'src/app/services/global.service';
import { MappedPixel, RainParticle } from 'src/app/common/models';

@Component({
  selector: 'app-p-rain',
  templateUrl: './p-rain.component.html',
  styleUrls: ['./p-rain.component.scss']
})
export class PRainComponent implements AfterViewInit {

  @ViewChild('Canvas')
  private mainCanvas!: ElementRef<HTMLCanvasElement>;
  private context?: CanvasRenderingContext2D | null = null;
  private image: HTMLImageElement = new Image();

  private particlesArray: RainParticle[] = [];
  private numberOfParticles = 10000;
  private mappedImage: MappedPixel[][] = [];

  constructor(
    private globalService: GlobalService,) {}

  ngAfterViewInit(): void {
    this.image.src = environment.imageSrc;

    this.context = this.mainCanvas.nativeElement.getContext('2d');

    this.pixelRain();
  }// ==============================

  private pixelRain() {
    this.image.addEventListener('load', () => {
      this.globalService.drawImage(this.context!, this.image, this.mainCanvas.nativeElement.width, this.mainCanvas.nativeElement.height);
      this.rpInit();
      this.rpAnimate();
    });
  }// ==============================

  private rpAnimate() {
    this.context!.globalAlpha = 0.05;

    this.context!.fillStyle = 'rgb(0, 0, 0)';
    this.context!.fillRect(0, 0, this.mainCanvas.nativeElement.width, this.mainCanvas.nativeElement.height);

    let alphaModifier = 0.05;
    for(let i = 0; i < this.particlesArray.length; i++) {
      this.particlesArray[i].update(this.context!, this.mappedImage);
      this.context!.globalAlpha = (this.particlesArray[i].getSpeed() * alphaModifier);
    }// =====
    requestAnimationFrame(() => {
      this.rpAnimate();
    });
  }// ==============================

  private rpInit() {
    /**
     * Initialize this.mappedImage with MappedPixels
     */
    let pixels = this.context!.getImageData(0, 0, this.mainCanvas.nativeElement.width, this.mainCanvas.nativeElement.height);
    for(let y = 0; y < this.mainCanvas.nativeElement.height; y++) {
      let row: MappedPixel[] = [];
      for(let x = 0; x < this.mainCanvas.nativeElement.width; x++) {
        let red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
        let green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
        let blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
        let brightness = this.globalService.calculatePixelRelativeBrightness(red, green, blue);
        row.push(new MappedPixel(
          brightness,
          "rgb("+ red +", "+ green +", "+ blue +")"
        ));
      }// =====
      this.mappedImage.push(row);
    }// =====

    for(let i = 0; i < this.numberOfParticles; i++) {
      this.particlesArray.push(new RainParticle(this.mainCanvas.nativeElement.width, this.mainCanvas.nativeElement.height))
    }// =====
  }// ==============================

}// ==============================
