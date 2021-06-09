import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
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
      this.globalService.debug("experiment-constructor");
      this.image = new Image();
      this.image.src = environment.imageSrc;
  }// ==============================

  ngAfterViewInit(): void {
    this.image.src = environment.imageSrc;
    this.canvas.nativeElement.height = this.image.height * 2;
    this.canvas.nativeElement.width = this.image.width * 2;

    this.context = this.canvas.nativeElement.getContext('2d');
    this.context!.drawImage(this.image, 0, 0);

    this.introductionExample();
  }// ==============================

  updateAverageModifier(value: any) {
    this.averageModifier = value;
  }// ==============================

  updateRedModifier(value: any) {
    this.redModifier = value;
  }// ==============================

  updateGreenModifier(value: any) {
    this.greenModifier = value;
  }// ==============================

  updateBlueModifier(value: any) {
    this.blueModifier = value;
  }// ==============================

  private blankListenerWrapper() {
    this.image.addEventListener('load', () => {
      this.context!.drawImage(this.image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    });
  }// ==============================

  private introductionExample() {
    this.image.addEventListener('load', () => {
      this.context!.drawImage(this.image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

      let scannedImage = this.context!.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      let scannedData = scannedImage!.data;
      this.globalService.debug(scannedData);
      for(let i = 0; i < scannedData!.length; i += 4) {
          const total = scannedData[i] + scannedData[i + 1] + scannedData[i + 2];
          const averageColorValue = (total / 3) + this.averageModifier;
          scannedData[i] = averageColorValue + this.redModifier;
          scannedData[i + 1] = averageColorValue + this.greenModifier;
          scannedData[i + 2] = averageColorValue + this.blueModifier + 30;
      }
      scannedImage!.data.set(scannedData);
      this.context?.putImageData(scannedImage!, 0, 0);
    });
  }// ==============================

}// ==============================
