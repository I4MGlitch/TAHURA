  import { Component, HostListener, NgZone } from '@angular/core';
  import { FaunaService } from '../services/fauna.service';
  import { Router } from '@angular/router';

  @Component({
    selector: 'app-fauna-page',
    templateUrl: './fauna-page.component.html',
    styleUrls: ['./fauna-page.component.css']
  })
  export class FaunaPageComponent {
    public faunas: any[] = [];
    searchTerm: string = '';
    private page: number = 1;
    private limit: number = 6;
    public isLoading: boolean = false;
    private hasMoreData: boolean = true;

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
      private fauna: FaunaService, 
      private ngZone: NgZone,
      private router: Router
    ){ }

    ngOnInit(): void {
      this.ngZone.runOutsideAngular(() => {
        this.getLoadFauna();
      })
      this.startFunFactRotation();
    }

    ngOnDestroy(): void {
      clearInterval(this.funFactInterval);
    }
  
    onSearch() {
      if (this.searchTerm) {
        this.router.navigate(['/search'], { queryParams: { query: this.searchTerm } });
      }
    }

    filteredFaunas() {
      if (!this.searchTerm) {
        return this.faunas;
      }
      return this.faunas.filter(fauna =>
        fauna.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fauna.nameIlmiah.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    getLoadFauna(): void {
      if (this.isLoading || !this.hasMoreData) return; 
  
      this.isLoading = true;
      this.fauna.getLoadFauna(this.page, this.limit).subscribe(
        data => {
          if (data.length > 0) {
            this.faunas = [...this.faunas, ...data];
            this.page++;
          } else {
            this.hasMoreData = false;
          }
          this.isLoading = false;
        },
        error => {
          console.error('Error loading flora:', error);
          this.isLoading = false;
        }
      );
    }
  
    @HostListener('window:scroll', ['$event'])
    onScroll(event: any): void {
      
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) { // Adjust threshold as needed
        this.getLoadFauna();
      }
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
      console.error('Image loading error', product, event);
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
