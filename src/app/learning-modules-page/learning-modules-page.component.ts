import { Component } from '@angular/core';
import { LearningModuleService } from '../services/learning-modules.service';

@Component({
  selector: 'app-learning-modules-page',
  templateUrl: './learning-modules-page.component.html',
  styleUrls: ['./learning-modules-page.component.css']
})
export class LearningModulesPageComponent {

  filteredModules: any[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'All';
  learningModuleList: any[] = [];
  // Pagination variables for learning module
  currentPageLearningModule = 1;
  totalPagesLearningModule = 1;
  currentPageInputLearningModule = 1;
  isLoading = false;
  pageSize = 6;
  modulesPerPage = 6;

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

  constructor(private learningModuleService: LearningModuleService) { }

  ngOnInit() {
    this.loadLearningModule();
    this.startFunFactRotation();
  }

  ngOnDestroy(): void {
    clearInterval(this.funFactInterval);
  }

  loadLearningModule() {
    this.isLoading = true;
    this.learningModuleService.getLazyLearningModules(this.currentPageLearningModule, this.pageSize).subscribe(response => {
      this.learningModuleList = response.modules;
      this.filteredModules = response.modules
      this.totalPagesLearningModule = response.totalPages;
      this.currentPageInputLearningModule = this.currentPageLearningModule;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching learning modules:', error);
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase();

    let filtered = this.learningModuleList;

    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(m => m.category?.toLowerCase() === this.selectedCategory.toLowerCase());
    }

    if (query) {
      filtered = filtered.filter(m =>
        m.title?.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query)
      );
    }

    // Pagination setup
    this.totalPagesLearningModule = Math.ceil(filtered.length / this.modulesPerPage);
    const start = (this.currentPageLearningModule - 1) * this.modulesPerPage;
    const end = start + this.modulesPerPage;

    this.filteredModules = filtered.slice(start, end);
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    this.currentPageLearningModule = 1;
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.currentPageLearningModule = 1;
    this.applyFilters();
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

  // Handle page input change for learning modules
  changePageLearningModule() {
    const page = Number(this.currentPageInputLearningModule);
    if (!isNaN(page) && page >= 1 && page <= this.totalPagesLearningModule) {
      this.goToPageLearningModule(page);
    } else {
      this.currentPageInputLearningModule = this.currentPageLearningModule;
    }
  }

  // Go to specific page for learning modules
  goToPageLearningModule(page: number) {
    if (page >= 1 && page <= this.totalPagesLearningModule) {
      this.currentPageLearningModule = page;
      this.loadLearningModule();
    }
  }

  // Validate input for learning module pagination
  validatePageInputLearningModule() {
    if (this.currentPageInputLearningModule < 1 || this.currentPageInputLearningModule > this.totalPagesLearningModule) {
      this.currentPageInputLearningModule = this.currentPageLearningModule;
    }
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
