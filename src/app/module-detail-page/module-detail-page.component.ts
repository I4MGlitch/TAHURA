import { Component, NgZone, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearningModuleService } from '../services/learning-modules.service';
declare var Swiper: any;

@Component({
  selector: 'app-module-detail-page',
  templateUrl: './module-detail-page.component.html',
  styleUrls: ['./module-detail-page.component.css']
})
export class ModuleDetailPageComponent {

  public loading: boolean = true;
  public beritaspartial: any[] = [];
  moduleId: string | null = null;
  learningModuleDetails: any;

  learningModuleList: any[] = [];
  // Pagination variables for learning module
  currentPageLearningModule = 1;
  totalPagesLearningModule = 1;
  currentPageInputLearningModule = 1;
  isLoading = false;
  pageSize = 6;

  constructor(private ngZone: NgZone, private route: ActivatedRoute, private renderer: Renderer2, private learningModuleService: LearningModuleService) { }

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.loadLearningModule();
    this.route.params.subscribe(params => {
      this.moduleId = params['id'];
      console.log('Learning Module ID:', this.moduleId);
  
      if (this.moduleId !== null) {
        this.learningModuleService.getLearningModuleDetails(this.moduleId).subscribe(
          (details: any) => {
            this.ngZone.run(() => {
              this.learningModuleDetails = details;
              this.loading = false;
              console.log('Learning module details:', this.learningModuleDetails);
            });
          },
          error => {
            console.error('Error getting learning module details:', error);
            this.loading = false;
          }
        );
      } else {
        console.error('Learning Module ID is null.');
        this.loading = false;
      }
  
      // Scroll to top
      this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
      this.renderer.setProperty(document.body, 'scrollTop', 0);
    });
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
  
  loadLearningModule() {
    this.isLoading = true;
    this.learningModuleService.getLazyLearningModules(this.currentPageLearningModule, this.pageSize).subscribe(response => {
      this.learningModuleList = response.modules;
      this.totalPagesLearningModule = response.totalPages;
      this.currentPageInputLearningModule = this.currentPageLearningModule;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching learning modules:', error);
      this.isLoading = false;
    });
  }

  getImageUrl(imageData: any): string {
    if (imageData && imageData.data) {
      const blob = new Blob([new Uint8Array(imageData.data)], { type: imageData.contentType });
      return URL.createObjectURL(blob);
    }
    return 'assets/Images/logoTahura.png';
  }

  handleImageError(event: any, photo: any) {

  }

  getErrorImageUrl(): string {
    return 'assets/Images/logoTahura.png';
  }

}
