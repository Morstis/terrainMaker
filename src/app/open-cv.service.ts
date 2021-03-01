import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
declare var cv: any;

@Injectable({
  providedIn: 'root',
})
export class OpenCVService {
  constructor() {}
  imageData$: Subject<ImageData> = new Subject();

  addImage(image: string): void {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);
      const data = context.getImageData(0, 0, img.width, img.height);
      this.imageData$.next(data);
    };
  }

  // addCanvas(canvas: HTMLCanvasElement): void {
  //   const ctx = canvas.getContext('2d');
  //   this.imageDataOut$.subscribe((data) => {
  //     console.log(data);
  //     canvas.width = data.width;
  //     canvas.height = data.height;
  //     ctx.putImageData(data, 0, 0);
  //   });
  // }

  aD(data: ImageData): ImageData {
    const src = cv.matFromImageData(data);
    const dst = new cv.Mat();
    // cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);

    // cv.threshold(src, src, 120, 200, cv.THRESH_BINARY);
    cv.adaptiveThreshold(
      src,
      dst,
      200,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY,
      3,
      2
    );
    console.log(src, dst, new Uint8ClampedArray(dst.data));

    const imgData = new ImageData(
      new Uint8ClampedArray(dst.data),
      data.width,
      data.height
    );
    return imgData;
  }
}
