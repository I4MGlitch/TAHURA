import { Component, NgZone, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { BeritaService } from '../services/berita.service';
import { ActivatedRoute } from '@angular/router';
declare var Swiper: any;

@Component({
  selector: 'app-berita-detail-page',
  templateUrl: './berita-detail-page.component.html',
  styleUrls: ['./berita-detail-page.component.css']
})
export class BeritaDetailPageComponent {
  public beritas: any[] = [];
  beritaId: string | null = null;
  beritaDetails: any;
  @ViewChild('topElement') topElement!: ElementRef;

  constructor(
    private berita: BeritaService,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.route.params.subscribe(params => {
      this.beritaId = params['id'];
      console.log('Berita ID:', this.beritaId);
      if (this.beritaId !== null) {
        this.berita.getBeritaDetails(this.beritaId).subscribe(
          (details: any) => {
            this.ngZone.run(() => {
              this.beritaDetails = details;
              console.log('Berita details:', this.beritaDetails);
            });
          },
          error => {
            console.error('Error getting berita details:', error);
          }
        );
      } else {
        console.error('Berita ID is null.');
      }
      this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
      this.renderer.setProperty(document.body, 'scrollTop', 0);
    });

    this.ngZone.runOutsideAngular(() => {
      this.getAllBerita();
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      // Initialize swiper1
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

  getAllBerita() {
    this.berita.getAllBerita().subscribe(
      (beritas: any[]) => {
        this.ngZone.run(() => {
          this.beritas = beritas;
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
}
