import { Component, NgZone } from '@angular/core';
import { FloraService } from '../services/flora.service';

@Component({
  selector: 'app-flora-page',
  templateUrl: './flora-page.component.html',
  styleUrls: ['./flora-page.component.css']
})
export class FloraPageComponent {
  public floras: any[] = [];

  constructor(
    private flora: FloraService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.getAllFlora();
    });
  }
  getAllFlora() {
    this.flora.getAllFlora().subscribe(
      (floras: any[]) => {
        this.ngZone.run(() => {
          this.floras = floras;
        });
      },
      error => {
        console.error('Error fetching Floras:', error);
      }
    );
  }


  getErrorImageUrl(): string {
    return '../../assets/Images/logoTahura.png';
  }

  getImageUrl(imageData: any): string {
    if (imageData && imageData.data) {
      const blob = new Blob([new Uint8Array(imageData.data)], { type: imageData.contentType });
      return URL.createObjectURL(blob);
    }
    return this.getErrorImageUrl();
  }

  handleImageError(event: any, product: any) {
    console.error('Image loading error for product:', product, event);
    product.errorImage = true;
  }
}
