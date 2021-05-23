import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { MouseObj } from 'src/app/common/models/';

@Component({
  selector: 'app-p-text',
  templateUrl: './p-text.component.html',
  styleUrls: ['./p-text.component.scss']
})
export class PTextComponent implements AfterViewInit {

  @ViewChild('Canvas')
  private canvas!: ElementRef<HTMLCanvasElement>;
  private context?: CanvasRenderingContext2D | null = null;

  private particleArray = [];
  private mouse: MouseObj = new MouseObj(150);

  constructor(
    private globalService: GlobalService,) { }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;

    this.setupMouse();
    this.context!.fillStyle = "white";
    this.context!.font = "48px Arial";
    this.context!.fillText("Test", 150, 150);
  }

  setupMouse() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = event.x;
      this.mouse.y = event.y;
      this.globalService.debug(this.mouse);
    })
  }

}
