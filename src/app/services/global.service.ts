import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  applyInvert(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
    this.debug("GlobalService", "applyInvert");
    context!.drawImage(image, 0, 0, width, height);
    const imageData = context!.getImageData(0, 0, width, height);
    const data = imageData!.data;
  	for (var i = 0; i < data.length; i += 4) {
  		data[i]     = 255 - data[i];     // red
  		data[i + 1] = 255 - data[i + 1]; // green
  		data[i + 2] = 255 - data[i + 2]; // blue
  	}
    context!.putImageData(imageData!, 0, 0);
  }// ==============================

  applyGrayscale(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
    this.debug("GlobalService", "applyGrayscale");
    context!.drawImage(image, 0, 0, width, height);
    const imageData = context!.getImageData(0, 0, width, height);
    const data = imageData!.data;
  	for (var i = 0; i < data.length; i += 4) {
  		var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
  		data[i]     = avg; // red
  		data[i + 1] = avg; // green
  		data[i + 2] = avg; // blue
  	}
    // imageData!.data.set(data);
    context!.putImageData(imageData!, 0, 0);
  }// ==============================

  applySepia(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
    this.debug("GlobalService", "applySepia");
    context!.drawImage(image, 0, 0, width, height);
    const imageData = context!.getImageData(0, 0, width, height);
    const data = imageData!.data;
  	for (var i = 0; i < data.length; i += 4) {
  		let red = data[i], green = data[i + 1], blue = data[i + 2];

  		data[i] = Math.min(Math.round(0.393 * red + 0.769 * green + 0.189 * blue), 255);
  		data[i + 1] = Math.min(Math.round(0.349 * red + 0.686 * green + 0.168 * blue), 255);
  		data[i + 2] = Math.min(Math.round(0.272 * red + 0.534 * green + 0.131 * blue), 255);
  	}
  	context!.putImageData(imageData, 0, 0);
  }// ==============================

  /**
   * The formula used here is found on the internet for this purpose.
   * @param red number 0-255
   * @param green number 0-255
   * @param blue number 0-255
   * @returns 
   */
  calculatePixelRelativeBrightness(red: number, green: number, blue: number): number {
    return Math.sqrt(
      (red * red) * 0.299 +
      (green * green) * 0.587 +
      (blue * blue) * 0.114
    )/100;
  }// ==============================

  /**
   * Wrapper method around console.log to output only when in debugging mode.
   * It's parameters are set up just like console.log for ease of use.
   * @param message 
   * @param optionalParams 
   */
  debug(message?: any, ...optionalParams: any[]): void {
    if(environment.debugging) {
      console.log(message, optionalParams);
    }
  }// ==============================

  drawImage(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
    this.debug("GlobalService", "drawImage");
    context!.drawImage(image, 0, 0, width, height);
  }// ==============================
}
