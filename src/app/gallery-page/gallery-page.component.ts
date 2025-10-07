import { Component, AfterViewInit, NgZone } from '@angular/core';
import { FloraService } from '../services/flora.service';
import { FaunaService } from '../services/fauna.service';
import { BeritaService } from '../services/berita.service';
declare var Swiper: any;

@Component({
  selector: 'app-gallery-page',
  templateUrl: './gallery-page.component.html',
  styleUrls: ['./gallery-page.component.css']
})
export class GalleryPageComponent {
  public floraspartial: any[] = [];
  public faunaspartial: any[] = [];
  public beritaspartial: any[] = [];
  public loading: boolean = true;

  showFunFact = false;
  currentFunFact = '';
  private funFactInterval: any;

  funFacts: string[] = [
    'Mangrove forests act as natural coastal defenses, reducing erosion and storm damage.',
    'Mangroves store up to four times more carbon than other tropical forests!',
    'More than 70 species of mangroves exist around the world.',
    'Mangrove roots provide shelter and nursery grounds for many marine species.',
    'Mangroves help filter pollutants and improve water quality in coastal zones.'
  ];

  constructor(
    private flora: FloraService,
    private fauna: FaunaService,
    private berita: BeritaService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.getPartialFlora();
      this.getPartialFauna();
      this.getPartialBerita();
    });
    this.startFunFactRotation();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      // Initialize swiper1
      this.loading = false;
      const swiper1 = new Swiper('.container1', {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        grabCursor: true,
        pagination: {
          el: '.swiper-pagination1',
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          968: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1330: {
            slidesPerView: 3,
            spaceBetween: 30,
          }
        }
      });

      // Initialize swiper2
      const swiper2 = new Swiper('.container2', {
        grabCursor: true,
        scrollbar: {
          el: '.swiper-scrollbar',
          draggable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          968: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1330: {
            slidesPerView: 4,
            spaceBetween: 20,
          }
        }
      });

      // Initialize swiper3
      const swiper3 = new Swiper('.container3', {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        grabCursor: true,
        pagination: {
          el: '.swiper-pagination3',
          clickable: true,
          dynamicBullets: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1330: {
            slidesPerView: 2,
            spaceBetween: 30,
          }
        }
      });

      // Initialize imgSwiper
      const imgSwiper = new Swiper(".img-Swiper", {
        effect: "cards",
        grabCursor: true,
      });

      // Initialize swiperThumbs
      const swiperThumbs = new Swiper(".mySwiperThumbs", {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
      });

      // Initialize detailswiper
      const detailswiper = new Swiper(".detailSwiper", {
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        thumbs: {
          swiper: swiperThumbs,
        },
      });
    });
  }

  getPartialFlora() {
    this.flora.getPartialFlora().subscribe(
      (floras: any[]) => {
        this.ngZone.run(() => {
          this.floraspartial = floras;
        });
      },
      error => {
        console.error('Error fetching Floras:', error);
      }
    );
  }

  getPartialFauna() {
    this.fauna.getPartialFauna().subscribe(
      (faunas: any[]) => {
        this.ngZone.run(() => {
          this.faunaspartial = faunas;
        });
      },
      error => {
        console.error('Error fetching Faunas:', error);
      }
    );
  }  

  getPartialBerita() {
    this.berita.getPartialBerita().subscribe(
      (beritas: any[]) => {
        this.ngZone.run(() => {
          this.beritaspartial = beritas;
        });
      },
      error => {
        console.error('Error fetching Beritas:', error);
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

  startFunFactRotation(): void {
    this.showRandomFact(); // Show immediately
    this.funFactInterval = setInterval(() => {
      this.showRandomFact();
    }, 60000); // Every 10 seconds
  }

  showRandomFact(): void {
    const randomIndex = Math.floor(Math.random() * this.funFacts.length);
    this.currentFunFact = this.funFacts[randomIndex];
    this.showFunFact = true;

    // // Optional: Auto-hide after a few seconds
    // setTimeout(() => {
    //   this.showFunFact = false;
    // }, 5000); // Hide after 5 seconds
  }

  closeFunFact() {
    this.showFunFact = false; // Hilangkan popup
  }
}
