import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-p-experiment',
  templateUrl: './p-experiment.component.html',
  styleUrls: ['./p-experiment.component.scss']
})
export class PExperimentComponent implements AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, OnChanges, OnDestroy, OnInit {

  @ViewChild('Canvas')
  private canvas!: ElementRef<HTMLCanvasElement>;
  private context?: CanvasRenderingContext2D | null = null;
  private image: HTMLImageElement = new Image();

  public averageModifier: number = 0;
  public redModifier: number = 0;
  public greenModifier: number = 0;
  public blueModifier: number = 0;

  private desiredNumberOfPixels: number = 250000;

  constructor(
    private globalService: GlobalService,) {
      this.debug("constructor");
      this.image.src = environment.imageSrc;
  }// ==============================

  ngAfterContentChecked(): void {
    this.debug("AfterContentChecked");
  }// ==============================

  ngAfterContentInit(): void {
    this.debug("AfterContentInit");
  }// ==============================

  ngAfterViewChecked(): void {
    this.debug("AfterViewChecked");
  }// ==============================

  /**
   * context doesn't exist until here
   */
  ngAfterViewInit(): void {
    this.debug("AfterViewInit");
    this.setupCanvas();
    this.setupLoadListener();
  }// ==============================

  ngOnChanges(): void {
    this.globalService.debug("experiment-OnChanges");
  }// ==============================

  ngOnDestroy(): void {
    this.globalService.debug("experiment-OnDestroy");
  }// ==============================

  ngOnInit(): void {
    this.globalService.debug("experiment-OnInit");
  }// ==============================

  selectInvert(): void {
    this.debug("selectInvert");

    // clear the canvas
    this.globalService.clearCanvas(this.context!, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // place a sepia
    this.globalService.applyInvert(this.context!, this.image, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }// ==============================

  selectOriginal(): void {
    this.debug("selectOriginal");

    // clear the canvas
    this.globalService.clearCanvas(this.context!, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // place a clean copy of the image on the canvas
    this.globalService.drawImage(this.context!, this.image, this.canvas!.nativeElement.width, this.canvas!.nativeElement.height);
  }// ==============================

  selectSepia(): void {
    this.debug("selectSepia");

    // clear the canvas
    this.globalService.clearCanvas(this.context!, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // place a sepia
    this.globalService.applySepia(this.context!, this.image, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }// ==============================

  updateAverageModifier(value: string): void {
    this.globalService.debug("updateAverageModifier - value:".concat(' ', value));
    this.averageModifier = parseInt(value);
    this.globalService.applyGrayscale(this.context!, this.image, this.canvas.nativeElement.width, this.canvas.nativeElement.height, this.averageModifier);
  }// ==============================

  updateRedModifier(value: string): void {
    this.globalService.debug("updateRedModifier - value:", value);
    this.redModifier = parseInt(value);
    this.updateImage();
  }// ==============================

  updateGreenModifier(value: string): void {
    this.globalService.debug("updateGreenModifier - value:", value);
    this.greenModifier = parseInt(value);
    this.updateImage();
  }// ==============================

  updateBlueModifier(value: string): void {
    this.globalService.debug("updateBlueModifier - value:", value);
    this.blueModifier = parseInt(value);
    this.updateImage();
  }// ==============================

  /**
   * Wrapper method around console.log to output only when in debugging mode.
   * It's parameters are set up just like console.log for ease of use.
   * @param message
   * @param optionalParams
   */
  private debug(message?: any, ...optionalParams: any) {
    if(environment.debugging) {
      if(optionalParams.length > 0) {
        this.globalService.debug("PIntroComponent:\n", message, optionalParams);
      } else {
        this.globalService.debug("PIntroComponent:\n".concat(message));
      }// =====
    }// =====
  }// ==============================

  private setupCanvas(): void {
    this.debug("setupCanvas");

    let pixelCount = this.image.width * this.image.height;
    let imageScaler: number = 1;
    if(pixelCount > this.desiredNumberOfPixels) {
      imageScaler = Math.floor(pixelCount / this.desiredNumberOfPixels) / 2;
      imageScaler = (imageScaler > 0) ? imageScaler : 1;
      this.canvas!.nativeElement.width = this.image.width / imageScaler;
      this.canvas!.nativeElement.height = this.image.width / imageScaler;
    } else if(pixelCount < this.desiredNumberOfPixels) {
      imageScaler = Math.floor(this.desiredNumberOfPixels / pixelCount) / 2;
      imageScaler = (imageScaler > 0) ? imageScaler : 1;
      this.canvas!.nativeElement.width = this.image.width * imageScaler;
      this.canvas!.nativeElement.height = this.image.width * imageScaler;
    }// =====
    
    this.context = this.canvas!.nativeElement.getContext('2d');
    this.debug("canvas: "+ this.canvas!.nativeElement.width +", "+ this.canvas!.nativeElement.height +", "+ imageScaler);
  }// ==============================

  private setupLoadListener() {
    this.image.addEventListener('load', () => {
      this.updateImage();
    });// =====
  }// ==============================

  private updateImage(): void {
    this.debug("updateImage");

    // clear the canvas
    this.globalService.clearCanvas(this.context!, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // place a clean copy of the image on the canvas
    this.globalService.drawImage(this.context!, this.image, this.canvas!.nativeElement.width, this.canvas!.nativeElement.height);

    // get the image data
    let scannedImage = this.context!.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    let scannedData = scannedImage!.data;
    this.debug("Scanned Image Data:", scannedData!);

    // manipulate the copied image data, averaging out the colors
    for(let i = 0; i < scannedData!.length; i += 4) {
        const total = scannedData[i] + scannedData[i + 1] + scannedData[i + 2];
        const averageColorValue = (total / 3) + this.averageModifier;
        scannedData[i] = averageColorValue + this.redModifier;
        scannedData[i + 1] = averageColorValue + this.greenModifier;
        scannedData[i + 2] = averageColorValue + this.blueModifier;
    }// =====

    // place modified image on the canvas
    scannedImage!.data.set(scannedData);
    this.context!.putImageData(scannedImage!, 0, 0);
  }// ==============================

}// ==============================
