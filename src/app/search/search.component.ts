// src/app/search/search.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaunaService } from '../services/fauna.service';
import { FloraService } from '../services/flora.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  public floraResults: any[] = [];
  public faunaResults: any[] = [];
  loading: boolean = true;

  constructor(
    private fauna: FaunaService,
    private flora: FloraService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  onSearch() {
    if (this.searchTerm) {
      this.router.navigate(['/search'], { queryParams: { query: this.searchTerm } });
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['query'];
      this.performSearch();
    });
  }

  performSearch() {
    this.loading = true;
    this.flora.searchFlora(this.searchTerm).subscribe(
      (floras: any[]) => {
        this.floraResults = floras;
        console.log('Flora Results:', this.floraResults);
        this.fauna.searchFauna(this.searchTerm).subscribe(
          (faunas: any[]) => {
            this.faunaResults = faunas;
            console.log('Fauna Results:', this.faunaResults);
            this.loading = false;
          },
          error => {
            console.error('Error fetching Fauna:', error);
            this.loading = false;
          }
        );
      },
      error => {
        console.error('Error fetching Flora:', error);
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

  handleImageError(event: any, product: any) {
    console.error('Image loading error', product, event);
    product.errorImage = true;
  }
}
