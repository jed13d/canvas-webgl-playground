import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-p-intro',
  templateUrl: './p-intro.component.html',
  styleUrls: ['./p-intro.component.scss']
})
export class PIntroComponent implements AfterViewInit {

  @ViewChild('Canvas')
  private canvas!: ElementRef<HTMLCanvasElement>;
  private context?: CanvasRenderingContext2D | null = null;
  private image: HTMLImageElement = new Image();

  public averageModifier: number = 0;
  public redModifier: number = 0;
  public greenModifier: number = 0;
  public blueModifier: number = 0;

  constructor(
    private globalService: GlobalService,) {
      this.debug("constructor");
      this.image = new Image();
      this.image.src = environment.imageSrc;
  }// ==============================

  ngAfterViewInit(): void {
    this.debug("ngAfterViewInit");
    this.image.src = environment.imageSrc;
    this.canvas.nativeElement.height = this.image.height * 2;
    this.canvas.nativeElement.width = this.image.width * 2;

    this.context = this.canvas.nativeElement.getContext('2d', { alpha: false });

    this.setupLoadListener();
  }// ==============================

  updateAverageModifier(value: string) {
    this.globalService.debug("updateAverageModifier - value:".concat(' ', value));
    this.averageModifier = parseInt(value);
    this.updateImage();
  }// ==============================

  updateRedModifier(value: any) {
    this.globalService.debug("updateRedModifier - value:", value);
    this.redModifier = value;
    this.updateImage();
  }// ==============================

  updateGreenModifier(value: any) {
    this.globalService.debug("updateGreenModifier - value:", value);
    this.greenModifier = value;
    this.updateImage();
  }// ==============================

  updateBlueModifier(value: any) {
    this.globalService.debug("updateBlueModifier - value:", value);
    this.blueModifier = value;
    this.updateImage();
  }// ==============================

  private blankListenerWrapper() {
    this.image.addEventListener('load', () => {
      this.context!.drawImage(this.image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    });
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
        this.globalService.debug("PIntroComponent:\n", message);
      }// =====
    }// =====
  }// ==============================

  private stringifyObject(obj: any): string {
    return JSON.parse(JSON.stringify(obj));
  }// ==============================

  private setupLoadListener() {
    this.image.addEventListener('load', () => {
      this.updateImage();
    });
  }// ==============================

  private updateImage() {
    this.context!.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.context!.drawImage(this.image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    let scannedImage = this.context!.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    let scannedData = scannedImage!.data;
    this.globalService.debug("Scanned Image Data:", scannedData);

    for(let i = 0; i < scannedData!.length; i += 4) {
        const total = scannedData[i] + scannedData[i + 1] + scannedData[i + 2];
        const averageColorValue = (total / 3) + this.averageModifier;
        scannedData[i] = averageColorValue + this.redModifier;
        scannedData[i + 1] = averageColorValue + this.greenModifier;
        scannedData[i + 2] = averageColorValue + this.blueModifier;
    }
    scannedImage!.data.set(scannedData);
    this.context?.putImageData(scannedImage!, 0, 0);
  }// ==============================

}// ==============================
