import { Component, NgZone } from '@angular/core';
import { BeritaService } from '../services/berita.service';
declare var Swiper: any;

@Component({
  selector: 'app-berita-page',
  templateUrl: './berita-page.component.html',
  styleUrls: ['./berita-page.component.css']
})
export class BeritaPageComponent {
  public beritas: any[] = [];
  public beritaspartial: any[] = [];
  public beritasPopuler: any[] = [];
  public beritasTerkini: any[] = [];
  searchTerm: string = '';
  currentPage = 1;
  itemsPerPage = 2; // Adjusted to 2 for each section
  public loading: boolean = true;
  totalItems: number = 14;

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
    private beritaService: BeritaService,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.getLoadBeritas(this.currentPage);
      this.getPartialBerita();
    });
    this.startFunFactRotation();
  }
  ngOnDestroy(): void {
    clearInterval(this.funFactInterval);
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
  
  getPartialBerita() {
    this.beritaService.getPartialBerita().subscribe(
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
  
  getLoadBeritas(page: number): void {
    this.beritaService.getLoadBeritas(page, this.itemsPerPage).subscribe(
      response => {
        this.ngZone.run(() => {
          this.beritas = response.beritas;
          this.totalItems = 16; // Get the total number of items from the response
          this.populateBeritas();
          this.loading = false;
        });
      },
      error => {
        console.error('Error fetching Beritas:', error);
        this.loading = false;
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

  handleImageError(event: any, berita: any) {
    console.error('Image loading error for berita:', berita, event);
    berita.errorImage = true;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage); // Calculate total pages based on total items
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.getLoadBeritas(this.currentPage);
  }

  populateBeritas() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.beritasPopuler = this.beritas.slice(0, 2); // Assuming you want the first 2 items as popular
  
    // For `beritasTerkini`, reverse the entire list of `beritas` and then slice the first 2 items
    const reversedBeritas = [...this.beritas].reverse();
    this.beritasTerkini = reversedBeritas.slice(0, 2);
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