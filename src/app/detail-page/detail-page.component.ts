import { Component, AfterViewInit, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FloraService } from '../services/flora.service';
import { FaunaService } from '../services/fauna.service';

declare var Swiper: any;

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent implements OnInit, AfterViewInit {
  public flora: any;
  public fauna: any;
  public id: any;
  public type: any;
  private detailSwiper: any;
  private thumbsSwiper: any;

  constructor(
    private route: ActivatedRoute,
    private floraService: FloraService,
    private faunaService: FaunaService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.type = this.route.snapshot.paramMap.get('type');
      
      if (this.type === 'flora') {
        this.getFloraDetails();
      } else if (this.type === 'fauna') {
        this.getFaunaDetails();
      }
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initSwipers();
    });
  }

  initSwipers() {
    if ((this.flora?.photos && this.flora.photos.length > 1) || 
        (this.fauna?.photos && this.fauna.photos.length > 1)) {
  
      if (!this.thumbsSwiper || !this.detailSwiper) {
        this.thumbsSwiper = new Swiper('.mySwiperThumbs', {
          slidesPerView: 3,
          spaceBetween: 10,
          freeMode: true,
          watchSlidesVisibility: true,
          watchSlidesProgress: true,
        });
  
        this.detailSwiper = new Swiper('.detailSwiper', {
          spaceBetween: 10,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          thumbs: {
            swiper: this.thumbsSwiper,
          },
          breakpoints: {
            0: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 30,
            }
          }
        });
      } else {
        this.detailSwiper.update();
        this.thumbsSwiper.update();
      }
  
      // Show thumbs swiper
      const thumbsElement = document.querySelector('.mySwiperThumbs');
      if (thumbsElement) {
        thumbsElement.classList.remove('hidden');
      }
    } else {
      // Hide thumbs swiper if there's only one image
      const thumbsElement = document.querySelector('.mySwiperThumbs');
      if (thumbsElement) {
        thumbsElement.classList.add('hidden');
      }
      this.detailSwiper = new Swiper('.detailSwiper', {
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        thumbs: {
          swiper: this.thumbsSwiper,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 30,
          }
        }
      });
    }
  }

  getFloraDetails() {
    this.floraService.getFloraDetails(this.id).subscribe(
      (flora: any) => {
        this.ngZone.run(() => {
          this.flora = flora;
          this.ngZone.runOutsideAngular(() => this.initSwipers());
        });
      },
      error => {
        console.error('Error fetching flora details:', error);
      }
    );
  }

  getFaunaDetails() {
    this.faunaService.getFaunaDetails(this.id).subscribe(
      (fauna: any) => {
        this.ngZone.run(() => {
          this.fauna = fauna;
          this.ngZone.runOutsideAngular(() => this.initSwipers());
        });
      },
      error => {
        console.error('Error fetching fauna details:', error);
      }
    );
  }

  getImageUrl(imageData: any): string {
    if (imageData && imageData.data) {
      const blob = new Blob([new Uint8Array(imageData.data)], { type: imageData.contentType });
      return URL.createObjectURL(blob);
    }
    return '../../assets/Images/logoTahura.png';
  }

  handleImageError(event: any, photo: any) {
    console.error('Image loading error for photo:', photo, event);
  }

  updateMainPhoto(index: number) {
    if (this.detailSwiper) {
      this.detailSwiper.slideTo(index);
    }
  }
}
