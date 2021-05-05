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
  private mainCanvas!: ElementRef<HTMLCanvasElement>;
  private context?: CanvasRenderingContext2D | null = null;
  private image: HTMLImageElement;
  private updateInterval: any | undefined;

  public averageModifier: number = 0;
  public redModifier: number = 0;
  public greenModifier: number = 0;
  public blueModifier: number = 0;

  constructor(
    private globalService: GlobalService,
  ) {
    console.debug("experiment-constructor");
    this.image = new Image();
    this.image.src = environment.imageSrc;
  }// ==============================

  ngAfterContentChecked(): void {
    this.globalService.debug("experiment-AfterContentChecked");
    // this.globalService.debug("context:", (this.mainCanvas !== undefined) ? this.mainCanvas!.nativeElement.getContext('2d') : "mainCanvas == undefined, no context");
  }// ==============================

  ngAfterContentInit(): void {
    this.globalService.debug("experiment-AfterContentInit");
    // this.globalService.debug("context:", (this.mainCanvas !== undefined) ? this.mainCanvas!.nativeElement.getContext('2d') : "mainCanvas == undefined, no context");
  }// ==============================

  ngAfterViewChecked(): void {
    this.globalService.debug("experiment-AfterViewChecked");
    // this.globalService.debug("context:", (this.mainCanvas !== undefined) ? this.mainCanvas!.nativeElement.getContext('2d') : "mainCanvas == undefined, no context");
  }// ==============================

  /**
   * context doesn't exist until here
   */
  ngAfterViewInit(): void {
    this.globalService.debug("experiment-AfterViewInit");
    this.globalService.debug("context:", (this.mainCanvas !== undefined) ? this.mainCanvas!.nativeElement.getContext('2d') : "mainCanvas == undefined, no context");

    this.context = this.mainCanvas.nativeElement.getContext('2d');
    this.image.addEventListener('load', () => {

      this.mainExperiment();
      this.globalService.drawImage(this.context!, this.image, this.mainCanvas.nativeElement.width, this.mainCanvas.nativeElement.height);
      this.updateInterval = setInterval(() => {
        this.mainExperiment();
      }, 20000);

    });
  }// ==============================

  ngOnChanges(): void {
    this.globalService.debug("experiment-OnChanges");
    // this.globalService.debug("context:", (this.mainCanvas !== undefined) ? this.mainCanvas!.nativeElement.getContext('2d') : "mainCanvas == undefined, no context");
  }// ==============================

  ngOnDestroy(): void {
    this.globalService.debug("experiment-OnDestroy");
    // this.globalService.debug("context:", (this.mainCanvas !== undefined) ? this.mainCanvas!.nativeElement.getContext('2d') : "mainCanvas == undefined, no context");
    clearInterval(this.updateInterval);
  }// ==============================

  ngOnInit(): void {
    this.globalService.debug("experiment-OnInit");
    // this.globalService.debug("context:", (this.mainCanvas !== undefined) ? this.mainCanvas!.nativeElement.getContext('2d') : "mainCanvas == undefined, no context");
  }// ==============================

  /**
   * Meat and potatoes
   */
  private mainExperiment(): void {
    this.globalService.debug("experiment-mainExperiment");

    this.globalService.drawImage(this.context!, this.image, this.mainCanvas.nativeElement.width, this.mainCanvas.nativeElement.height);
    setTimeout(() => {
      this.globalService.applyGrayscale(this.context!, this.image, this.mainCanvas.nativeElement.width, this.mainCanvas.nativeElement.height);
    }, 5000);
    setTimeout(() => {
      this.globalService.applyInvert(this.context!, this.image, this.mainCanvas.nativeElement.width, this.mainCanvas.nativeElement.height);
    }, 10000);
    setTimeout(() => {
      this.globalService.applySepia(this.context!, this.image, this.mainCanvas.nativeElement.width, this.mainCanvas.nativeElement.height);
    }, 15000);

  }// ==============================

  private blank() {
    this.globalService.debug("experiment-");
    this.image.addEventListener('load', () => {
      this.context!.drawImage(this.image, 0, 0, this.mainCanvas.nativeElement.width, this.mainCanvas.nativeElement.height);

    });
  }// ==============================

}// ==============================
