import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { map, retryWhen, switchMap, tap } from 'rxjs/operators';
import { OpenCVService } from './open-cv.service';

@Component({
  selector: 'lw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  // HTML Element references

  @ViewChild('canvasOutput')
  canvasOutput: ElementRef;

  constructor(private cvService: OpenCVService) {}
  ngAfterViewInit(): void {
    this.cvService.imageData$
      .pipe(map((x) => this.cvService.aD(x)))
      .subscribe((data) => {
        const canvas = this.canvasOutput.nativeElement;
        const ctx = canvas.getContext('2d');
        canvas.width = data.width;
        canvas.height = data.height;
        ctx.putImageData(data, 0, 0);
      });
  }

  ngOnInit() {}

  loadImage(event: any): void {
    if (event.target.files.length) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      fromEvent(reader, 'load').subscribe((image) => {
        const currentTarget = image.currentTarget as FileReader;
        this.cvService.addImage(`${currentTarget.result}`);
      });
    }
  }
}
