import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FloraService } from '../services/flora.service';
import { UserService } from '../services/user.service';
import { FaunaService } from '../services/fauna.service';
import { BeritaService } from '../services/berita.service';
import { LearningModuleService } from '../services/learning-modules.service';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { QuizService } from '../services/quiz.service';
import { EventService } from '../services/event.service';
import { ReportService } from '../services/report.service';

declare var bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements AfterViewInit {
  floraList: any[] = [];
  faunaList: any[] = [];
  beritaList: any[] = [];
  learningModuleList: any[] = [];
  postList: any[] = [];
  users: any[] = [];
  // Pagination variables for flora
  currentPageFlora = 1;
  totalPagesFlora = 1;
  currentPageInputFlora = 1;
  // Pagination variables for users
  currentPageUsers = 1;
  totalPagesUsers = 1;
  currentPageInputUsers = 1;
  // Pagination variables for fauna
  currentPageFauna = 1;
  totalPagesFauna = 1;
  currentPageInputFauna = 1;
  // Pagination variables for berita
  currentPageBerita = 1;
  totalPagesBerita = 1;
  currentPageInputBerita = 1;
  // Pagination variables for learning module
  currentPageLearningModule = 1;
  totalPagesLearningModule = 1;
  currentPageInputLearningModule = 1;
  // Pagination variables for post
  currentPagePost = 1;
  totalPagesPost = 1;
  currentPageInputPost = 1;
  loading = false;
  selectedImageUrl: string = '';
  selectedIndex: number | null = null;
  pageSize = 6;
  Math = Math;
  isLoading = false;
  selectedFlora: any = {};
  selectedFauna: any = {};
  selectedBerita: any = {};
  selectedUsers: any = {};
  selectedLearningModule: any = {};
  selectedPost: any = {};
  selectedImages: File[] = [];
  selectedImagesBase64: string[] = [];
  imagePreview: string | null = '';
  picChange: boolean = false
  selectedImage: File | null = null;
  userData: any = {
    username: '',
    email: '',
    password: '',
    photos: ''
  };
  floraData: any = {
    name: '',
    nameIlmiah: '',
    description: '',
    short_description: '',
    category: '',
    no: '',
    bentuk: '',
    akar: '',
    daun: '',
    lainnya: '',
    tipeBiji: '',
    kulitKayu: '',
    ciriKhusus: '',
    bunga: '',
    buah: '',
    kegunaan: '',
    photos: ''
  };
  faunaData: any = {
    name: '',
    nameIlmiah: '',
    description: '',
    short_description: '',
    category: '',
    no: '',
    habitat: '',
    panjang: '',
    lebar: '',
    warna: '',
    makanan: '',
    reproduksi: '',
    adaptasi: '',
    gerakan: '',
    alatGerak: '',
    bentukTubuh: '',
    photos: ''
  };
  beritaData: any = {
    title: '',
    description: '',
    short_description: '',
    date: '',
    no: '',
    photos: ''
  };
  learningModuleData: any = {
    title: '',
    description: '',
    category: '',
    url: '',
    tags: '',
    date: '',
    photos: ''
  };
  postData: any = {
    username: '',
    date: '',
    description: '',
    like: [],
    dislike: [],
    photos: [],
    comments: []
  };
  eventData: any = {
    id: '',
    name: '',
    note: '',
    startDate: '',
    endDate: '',
    createdBy: 'Admin'
  };

  usernames: any[] = [];
  userProfile: any = {};
  username: any = 'Admin';
  isLoggedIn: boolean = false;
  searchQuery: string = '';
  selectedSort: string = '';
  newComment: any = ''
  quizTitle: string = '';
  questions: any = [];
  events: any = [];
  reports: any[] = [];
  newReport: any = { username: '', description: '' };

  constructor(private floraService: FloraService, private userService: UserService,
    private faunaService: FaunaService, private beritaService: BeritaService,
    private learningModuleService: LearningModuleService, private postService: PostService, private cdRef: ChangeDetectorRef,
    private router: Router, private adminService: AdminService, private quizService: QuizService, private eventService: EventService, private reportService: ReportService) { }

  eventList: any[] = [];
  newEvent: any = { name: '', note: '', startDate: '', endDate: '', createdBy: 'Admin' };
  eventIdCounter = 1;

  ngOnInit() {
    if (!this.adminService.isAdmin()) {
      this.router.navigate(['/logreg-page']);
    }
    this.loadFlora();
    this.loadUsers();
    this.loadFauna();
    this.loadBerita();
    this.loadLearningModule();
    this.loadPost();
    this.fetchAllUsernames();
    this.checkLoginStatus();
    this.fetchQuiz();
    if (!this.quizTitle && this.questions.length === 0) {
      this.createDefaultQuiz();
    }
    this.fetchEvents();
    this.fetchReports();

  }

  closeOffcanvas() {
    // Tutup offcanvas secara manual
    const offcanvasElement = document.getElementById('sidebarOffcanvas');
    if (offcanvasElement) {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    }
    // Scroll ke paling atas halaman
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  checkLoginStatus() {
    // Check if the user is logged in
    this.userService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.isLoggedIn = true;
        this.username = this.userService.getUsernameFromToken();
        console.log('Decoded username:', this.username);
        if (this.username) {
          this.fetchUserData(this.username);
        }
      }
    });
    this.cdRef.detectChanges();
  }

  fetchUserData(username: string): void {
    console.log('Fetching data for username:', username);
    this.userService.getUserByUsername(username).subscribe(
      data => {
        this.userProfile = data;
        console.log('User data fetched successfully:', this.userProfile);
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  fetchAllUsernames(): void {
    this.userService.fetchAllUsername().subscribe(
      (response) => {
        this.usernames = response;
      },
      (error) => {
        console.error('Error fetching all usernames:', error);
      }
    );
  }

  fetchQuiz(): void {
    this.quizService.getQuiz().subscribe(
      (quiz) => {
        this.quizTitle = quiz.title;
        this.questions = quiz.questions;
      },
      (error) => {
        console.log('Failed to fetch quiz data.');
      }
    );
  }

  loadFlora() {
    this.isLoading = true;
    this.floraService.getFlora(this.currentPageFlora, this.pageSize).subscribe(response => {
      this.floraList = response.floraData;
      this.totalPagesFlora = response.totalPages;
      this.currentPageInputFlora = this.currentPageFlora;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching flora:', error);
      this.isLoading = false;
    });
  }

  loadBerita() {
    this.isLoading = true;
    this.beritaService.getLazyBerita(this.currentPageBerita, this.pageSize).subscribe(response => {
      this.beritaList = response.beritaData;
      this.totalPagesBerita = response.totalPages;
      this.currentPageInputBerita = this.currentPageBerita;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching berita:', error);
      this.isLoading = false;
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

  loadUsers() {
    this.isLoading = true;
    this.userService.getAllUsers(this.currentPageUsers, this.pageSize).subscribe(response => {
      this.users = response.usersData;
      this.totalPagesUsers = response.totalPages;
      this.currentPageInputUsers = this.currentPageUsers;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching users:', error);
      this.isLoading = false;
    });
  }

  loadFauna() {
    this.isLoading = true;
    this.faunaService.getFauna(this.currentPageFauna, this.pageSize).subscribe(response => {
      this.faunaList = response.faunaData;
      this.totalPagesFauna = response.totalPages;
      this.currentPageInputFauna = this.currentPageFauna;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching fauna:', error);
      this.isLoading = false;
    });
  }

  loadPost() {
    this.isLoading = true;
    this.postService.getLazyPost(this.currentPagePost, this.pageSize).subscribe(response => {
      this.postList = response.postData;
      this.totalPagesPost = response.totalPages;
      this.currentPageInputPost = this.currentPagePost;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching posts:', error);
      this.isLoading = false;
    });
  }

  onScroll() {
    this.loadFlora();
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

  // Handle page input change for flora
  changePageFlora() {
    const page = Number(this.currentPageInputFlora);
    if (!isNaN(page) && page >= 1 && page <= this.totalPagesFlora) {
      this.goToPageFlora(page);
    } else {
      this.currentPageInputFlora = this.currentPageFlora;
    }
  }

  // Go to specific page for flora
  goToPageFlora(page: number) {
    if (page >= 1 && page <= this.totalPagesFlora) {
      this.currentPageFlora = page;
      this.loadFlora();
    }
  }

  // Validate input for flora pagination
  validatePageInputFlora() {
    if (this.currentPageInputFlora < 1 || this.currentPageInputFlora > this.totalPagesFlora) {
      this.currentPageInputFlora = this.currentPageFlora;
    }
  }

  // Handle page input change for beritas
  changePageBerita() {
    const page = Number(this.currentPageInputBerita);
    if (!isNaN(page) && page >= 1 && page <= this.totalPagesBerita) {
      this.goToPageBerita(page);
    } else {
      this.currentPageInputBerita = this.currentPageBerita;
    }
  }

  // Go to specific page for beritas
  goToPageBerita(page: number) {
    if (page >= 1 && page <= this.totalPagesBerita) {
      this.currentPageBerita = page;
      this.loadBerita();
    }
  }

  // Validate input for beritas pagination
  validatePageInputBerita() {
    if (this.currentPageInputBerita < 1 || this.currentPageInputBerita > this.totalPagesBerita) {
      this.currentPageInputBerita = this.currentPageBerita;
    }
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

  // Handle page input change for post
  changePagePost() {
    const page = Number(this.currentPageInputPost);
    if (!isNaN(page) && page >= 1 && page <= this.totalPagesPost) {
      this.goToPagePost(page);
    } else {
      this.currentPageInputPost = this.currentPagePost;
    }
  }

  // Go to specific page for post
  goToPagePost(page: number) {
    if (page >= 1 && page <= this.totalPagesPost) {
      this.currentPagePost = page;
      this.loadPost();
    }
  }

  // Validate input for post pagination
  validatePageInputPost() {
    if (this.currentPageInputPost < 1 || this.currentPageInputPost > this.totalPagesPost) {
      this.currentPageInputPost = this.currentPagePost;
    }
  }

  // Handle page input change for fauna
  changePageFauna() {
    const page = Number(this.currentPageInputFauna);
    if (!isNaN(page) && page >= 1 && page <= this.totalPagesFauna) {
      this.goToPageFauna(page);
    } else {
      this.currentPageInputFauna = this.currentPageFauna;
    }
  }

  // Go to specific page for fauna
  goToPageFauna(page: number) {
    if (page >= 1 && page <= this.totalPagesFauna) {
      this.currentPageFauna = page;
      this.loadFauna();
    }
  }

  // Validate input for fauna pagination
  validatePageInputFauna() {
    if (this.currentPageInputFauna < 1 || this.currentPageInputFauna > this.totalPagesFauna) {
      this.currentPageInputFauna = this.currentPageFauna;
    }
  }

  // Go to specific page for users
  goToPageUsers(page: number) {
    if (page >= 1 && page <= this.totalPagesUsers) {
      this.currentPageUsers = page;
      this.loadUsers();
    }
  }

  // Handle page input change for users
  changePageUsers() {
    const page = Number(this.currentPageInputUsers);
    if (!isNaN(page) && page >= 1 && page <= this.totalPagesUsers) {
      this.goToPageUsers(page);
    } else {
      this.currentPageInputUsers = this.currentPageUsers;
    }
  }


  // Validate input for users pagination
  validatePageInputUsers() {
    if (this.currentPageInputUsers < 1 || this.currentPageInputUsers > this.totalPagesUsers) {
      this.currentPageInputUsers = this.currentPageUsers;
    }
  }

  ngAfterViewInit() {
    // Inisialisasi kalender setelah view selesai dimuat
    $('#calendar').evoCalendar({
      theme: 'Royal Navy',
      eventHeaderFormat: 'MM dd, yyyy',
      eventListToggler: true,
      sidebarToggler: true,
      calendarEvents: [],
    });
  }

  getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  addEvent(event: Event) {
    event.preventDefault();
  
    if (!this.newEvent.name || !this.newEvent.startDate){alert('Error Adding Event, Please Fill Out The Information'); return};
  
    const endDate = this.newEvent.endDate || this.newEvent.startDate;
    const randomColor = this.getRandomColor();
  
    // Object for the backend (ensure 'createdBy' is included)
    const serviceEventObj = {
      name: this.newEvent.name,
      note: this.newEvent.note || '',
      startDate: this.newEvent.startDate,
      endDate: endDate,
      color: randomColor,
      createdBy: "Admin" // Ensure this field is included (replace with actual user if needed)
    };
  
    this.eventService.addEvent(serviceEventObj).subscribe(
      (savedEvent: any) => {
        const eventId = savedEvent._id; // MongoDB _id
  
        const calendarEventObj = {
          id: eventId, // Pastikan ID unik
          name: this.newEvent.name,
          date: [this.newEvent.startDate, endDate], // EvoCalendar mendukung rentang tanggal
          description: this.newEvent.note,
          type: "event",
          color: randomColor
        };
    
        // Tambah ke eventList
        this.eventList.push({
          id: eventId, // Simpan ID event agar bisa dihapus nanti
          name: this.newEvent.name,
          startDate: this.newEvent.startDate,
          endDate: endDate,
          note: this.newEvent.note,
          color: randomColor
        });
  
        // Add event to local list
        this.eventList.push({ id: eventId, ...savedEvent });
  
        // Add event to EvoCalendar
        setTimeout(() => {
          $('#calendar').evoCalendar('addCalendarEvent', calendarEventObj);
        }, 100);
  
        // Reset form
        this.newEvent = { name: '', note: '', startDate: '', endDate: '' };
      },
      (error) => {
        console.error("Error adding event:", error);
        alert('Error Adding Event, Please Fill Out The Information');
      }
    );
  }  
  
  // deleteEvent(index: number, eventId: string) {
  //   if (!eventId) return;
  
  //   this.eventService.deleteEvent(eventId).subscribe(
  //     () => {
  //       // Remove from local event list
  //       this.eventList.splice(index, 1);
  
  //       // Remove from EvoCalendar
  //       setTimeout(() => {
  //         $('#calendar').evoCalendar('removeCalendarEvent', eventId);
  //       }, 100);
  //     },
  //     (error) => {
  //       console.error("Error deleting event:", error);
  //     }
  //   );
  // }  

  submitFlora() {
    if (this.selectedImages.length === 0) {
      console.error('Please select at least one image.');
      alert('Error Adding Flora, Please Fill Out The Information');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('name', this.floraData.name);
    formData.append('nameIlmiah', this.floraData.nameIlmiah);
    formData.append('description', this.floraData.description);
    formData.append('short_description', this.floraData.short_description);
    formData.append('category', this.floraData.category);
    formData.append('no', this.floraData.no);
    formData.append('bentuk', this.floraData.bentuk);
    formData.append('akar', this.floraData.akar);
    formData.append('daun', this.floraData.daun);
    formData.append('lainnya', this.floraData.lainnya);
    formData.append('tipeBiji', this.floraData.tipeBiji);
    formData.append('kulitKayu', this.floraData.kulitKayu);
    formData.append('ciriKhusus', this.floraData.ciriKhusus);
    formData.append('bunga', this.floraData.bunga);
    formData.append('buah', this.floraData.buah);
    formData.append('kegunaan', this.floraData.kegunaan);

    // Append each selected image
    for (let i = 0; i < this.selectedImages.length; i++) {
      formData.append('photos', this.selectedImages[i]);
    }

    // Make the HTTP request using the service
    this.floraService.submitFlora(formData).subscribe(
      (response: any) => {
        console.log('Flora added successfully:', response);
        alert('Flora added successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error adding flora:', error);
        alert('Error Adding Flora, Please Fill Out The Information');
      }
    );
  }

  submitFauna() {
    if (this.selectedImages.length === 0) {
      console.error('Please select at least one image.');
      alert('Error Adding Fauna, Please Fill Out The Information');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('name', this.faunaData.name);
    formData.append('nameIlmiah', this.faunaData.nameIlmiah);
    formData.append('description', this.faunaData.description);
    formData.append('short_description', this.faunaData.short_description);
    formData.append('category', this.faunaData.category);
    formData.append('no', this.faunaData.no);
    formData.append('habitat', this.faunaData.habitat);
    formData.append('panjang', this.faunaData.panjang);
    formData.append('lebar', this.faunaData.lebar);
    formData.append('warna', this.faunaData.warna);
    formData.append('makanan', this.faunaData.makanan);
    formData.append('reproduksi', this.faunaData.reproduksi);
    formData.append('adaptasi', this.faunaData.adaptasi);
    formData.append('gerakan', this.faunaData.gerakan);
    formData.append('alatGerak', this.faunaData.alatGerak);
    formData.append('bentukTubuh', this.faunaData.bentukTubuh);

    // Append each selected image
    for (let i = 0; i < this.selectedImages.length; i++) {
      formData.append('photos', this.selectedImages[i]);
    }

    // Make the HTTP request using the service
    this.faunaService.submitFauna(formData).subscribe(
      (response: any) => {
        console.log('Fauna added successfully:', response);
        alert('Fauna added successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error adding fauna:', error);
        alert('Error Adding Fauna, Please Fill Out The Information');
      }
    );
  }

  submitBerita() {
    if (this.selectedImages.length === 0) {
      console.error('Please select an image.');
      alert('Error Adding News, Please Fill Out The Information');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('title', this.beritaData.title);
    formData.append('description', this.beritaData.description);
    formData.append('short_description', this.beritaData.short_description);
    formData.append('date', this.beritaData.date);
    for (let i = 0; i < this.selectedImages.length; i++) {
      formData.append('photos', this.selectedImages[i]);
    }

    // Make the HTTP request using the service
    this.beritaService.createBerita(formData).subscribe(
      (response: any) => {
        console.log('Berita added successfully:', response);
        alert('Berita added successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error adding berita:', error);
        alert('Error Adding News, Please Fill Out The Information');
      }
    );
  }

  submitLearningModule() {
    if (this.selectedImages.length === 0) {
      console.error('Please select an image.');
      alert('Error Adding Learning Module, Please Fill Out The Information');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('title', this.learningModuleData.title);
    formData.append('description', this.learningModuleData.description);
    formData.append('category', this.learningModuleData.category);
    formData.append('url', this.learningModuleData.url);
    formData.append('date', this.learningModuleData.date);
    formData.append('tags', this.learningModuleData.tags);

    for (let i = 0; i < this.selectedImages.length; i++) {
      formData.append('photos', this.selectedImages[i]);
    }

    // Make the HTTP request using the service
    this.learningModuleService.createLearningModule(formData).subscribe(
      (response: any) => {
        console.log('Learning module added successfully:', response);
        alert('Learning module added successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error adding learning module:', error);
        alert('Error Adding Learning Module, Please Fill Out The Information');
      }
    );
  }

  submitPost() {
    if (this.selectedImages.length === 0) {
      console.error('Please select an image.');
      alert('Error Adding Post, Please Fill Out The Information');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('description', this.postData.description);
    formData.append('date', this.postData.date || new Date().toISOString());

    for (let i = 0; i < this.selectedImages.length; i++) {
      formData.append('photos', this.selectedImages[i]);
    }

    // Make the HTTP request using the service
    this.postService.createPost(formData).subscribe(
      (response: any) => {
        console.log('Post added successfully:', response);
        alert('Post added successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error adding post:', error);
        alert('Error Adding Post, Please Fill Out The Information');
      }
    );
  }

  submitUser() {
    if (!this.selectedImages) {
      console.error('Please select a profile image.');
      alert('Error Adding User, Please Fill Out The Information');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('username', this.userData.username);
    formData.append('email', this.userData.email);
    formData.append('password', this.userData.password);
    for (let i = 0; i < this.selectedImages.length; i++) {
      formData.append('photos', this.selectedImages[i]);
    }

    // Make the HTTP request using the service
    this.userService.submitUser(formData).subscribe(
      (response: any) => {
        console.log('User added successfully:', response);
        alert('User added successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error adding user:', error);
        alert('Error Adding User, Please Fill Out The Information');
      }
    );
  }


  editFlora() {
    if (!this.selectedFlora || !this.selectedFlora._id) {
      console.error('No flora selected for editing.');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('name', this.selectedFlora.name);
    formData.append('nameIlmiah', this.selectedFlora.nameIlmiah);
    formData.append('description', this.selectedFlora.description);
    formData.append('short_description', this.selectedFlora.short_description);
    formData.append('category', this.selectedFlora.category);
    formData.append('bentuk', this.selectedFlora.bentuk);
    formData.append('akar', this.selectedFlora.akar);
    formData.append('daun', this.selectedFlora.daun);
    formData.append('lainnya', this.selectedFlora.lainnya);
    formData.append('tipeBiji', this.selectedFlora.tipeBiji);
    formData.append('kulitKayu', this.selectedFlora.kulitKayu);
    formData.append('ciriKhusus', this.selectedFlora.ciriKhusus);
    formData.append('bunga', this.selectedFlora.bunga);
    formData.append('buah', this.selectedFlora.buah);
    formData.append('kegunaan', this.selectedFlora.kegunaan);

    // Append new selected images if any
    if (this.selectedImages.length > 0) {
      for (let i = 0; i < this.selectedImages.length; i++) {
        formData.append('photos', this.selectedImages[i]);
      }
    }

    // Make the HTTP request using the service
    this.floraService.editFlora(this.selectedFlora._id, formData).subscribe(
      (response: any) => {
        console.log('Flora updated successfully:', response);
        alert('Flora updated successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error updating flora:', error);
      }
    );
  }

  editFauna() {
    if (!this.selectedFauna || !this.selectedFauna._id) {
      console.error('No fauna selected for editing.');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('name', this.selectedFauna.name);
    formData.append('nameIlmiah', this.selectedFauna.nameIlmiah);
    formData.append('description', this.selectedFauna.description);
    formData.append('short_description', this.selectedFauna.short_description);
    formData.append('category', this.selectedFauna.category);
    formData.append('habitat', this.selectedFauna.habitat);
    formData.append('panjang', this.selectedFauna.panjang);
    formData.append('lebar', this.selectedFauna.lebar);
    formData.append('warna', this.selectedFauna.warna);
    formData.append('makanan', this.selectedFauna.makanan);
    formData.append('reproduksi', this.selectedFauna.reproduksi);
    formData.append('adaptasi', this.selectedFauna.adaptasi);
    formData.append('gerakan', this.selectedFauna.gerakan);
    formData.append('alatGerak', this.selectedFauna.alatGerak);
    formData.append('bentukTubuh', this.selectedFauna.bentukTubuh);

    // Append new selected images if any
    if (this.selectedImages.length > 0) {
      for (let i = 0; i < this.selectedImages.length; i++) {
        formData.append('photos', this.selectedImages[i]);
      }
    }

    // Make the HTTP request using the service
    this.faunaService.editFauna(this.selectedFauna._id, formData).subscribe(
      (response: any) => {
        console.log('Fauna updated successfully:', response);
        alert('Fauna updated successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error updating fauna:', error);
      }
    );
  }

  editBerita() {
    if (!this.selectedBerita || !this.selectedBerita._id) {
      console.error('No berita selected for editing.');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('title', this.selectedBerita.title);
    formData.append('description', this.selectedBerita.description);

    // Generate short description (25% of the full description)
    const words = this.selectedBerita.description.split(" ");
    const shortDescLength = Math.ceil(words.length * 0.25);
    const shortDescription = words.slice(0, shortDescLength).join(" ");

    formData.append('short_description', shortDescription);
    formData.append('date', this.selectedBerita.date);

    if (this.selectedImages.length > 0) {
      for (let i = 0; i < this.selectedImages.length; i++) {
        formData.append('photos', this.selectedImages[i]);
      }
    }

    // Make the HTTP request using the service
    this.beritaService.updateBerita(this.selectedBerita._id, formData).subscribe(
      (response: any) => {
        console.log('Berita updated successfully:', response);
        alert('Berita updated successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error updating berita:', error);
      }
    );
  }

  editLearningModule() {
    if (!this.selectedLearningModule || !this.selectedLearningModule._id) {
      console.error('No learning module selected for editing.');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('title', this.selectedLearningModule.title);
    formData.append('description', this.selectedLearningModule.description);
    formData.append('category', this.selectedLearningModule.category); // Ensure category is included
    formData.append('url', this.selectedLearningModule.url);
    formData.append('date', this.selectedLearningModule.date);
    formData.append('tags', this.selectedLearningModule.tags);

    if (this.selectedImages.length > 0) {
      for (let i = 0; i < this.selectedImages.length; i++) {
        formData.append('photos', this.selectedImages[i]);
      }
    }

    // Make the HTTP request using the service
    this.learningModuleService.updateLearningModule(this.selectedLearningModule._id, formData).subscribe(
      (response: any) => {
        console.log('Learning module updated successfully:', response);
        alert('Learning module updated successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error updating learning module:', error);
      }
    );
  }

  editPost() {
    if (!this.selectedPost || !this.selectedPost._id) {
      console.error('No post selected for editing.');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('description', this.selectedPost.description);

    if (this.selectedImages.length > 0) {
      for (let i = 0; i < this.selectedImages.length; i++) {
        formData.append('photos', this.selectedImages[i]);
      }
    }

    // Make the HTTP request using the service
    this.postService.editPost(this.selectedPost._id, formData).subscribe(
      (response: any) => {
        console.log('Post updated successfully:', response);
        alert('Post updated successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error updating post:', error);
      }
    );
  }

  editUser() {
    if (!this.selectedImages && !this.selectedUsers.username && !this.selectedUsers.email && !this.selectedUsers.password) {
      console.error('Please provide data to update.');
      return;
    }

    // Prepare FormData for updating user
    const formData = new FormData();
    formData.append('username', this.selectedUsers.username);
    formData.append('email', this.selectedUsers.email);
    formData.append('password', this.selectedUsers.password);

    // Append new images if selected
    if (this.selectedImages && this.selectedImages.length > 0) {
      for (let i = 0; i < this.selectedImages.length; i++) {
        formData.append('photos', this.selectedImages[i]);
      }
    }

    // Make HTTP request to update user
    this.userService.editUser(this.selectedUsers._id, formData).subscribe(
      (response: any) => {
        console.log('User updated successfully:', response);
        alert('User updated successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error updating user:', error);
      }
    );
  }

  deleteFlora(floraId: string) {
    if (confirm('Are you sure you want to delete this flora?')) {
      this.floraService.deleteFlora(floraId).subscribe({
        next: (response) => {
          console.log('Flora deleted:', response);
          window.location.reload()
        },
        error: (error) => {
          console.error('Error deleting flora:', error);
        }
      });
    }
  }

  deleteFauna(faunaId: string) {
    if (confirm('Are you sure you want to delete this fauna?')) {
      this.faunaService.deleteFauna(faunaId).subscribe({
        next: (response) => {
          console.log('Fauna deleted:', response);
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting fauna:', error);
        }
      });
    }
  }

  deleteBerita(beritaId: string) {
    if (confirm('Are you sure you want to delete this berita?')) {
      this.beritaService.deleteBerita(beritaId).subscribe({
        next: (response) => {
          console.log('Berita deleted:', response);
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting berita:', error);
        }
      });
    }
  }

  deleteLearningModule(learningModuleId: string) {
    if (confirm('Are you sure you want to delete this learning module?')) {
      this.learningModuleService.deleteLearningModule(learningModuleId).subscribe({
        next: (response) => {
          console.log('Learning module deleted:', response);
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting learning module:', error);
        }
      });
    }
  }

  deletePost(postId: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postId).subscribe({
        next: (response) => {
          console.log('Post deleted:', response);
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        }
      });
    }
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        (response) => {
          console.log('User deleted successfully:', response);
          alert('User deleted successfully!');
          window.location.reload();
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user!');
        }
      );
    }
  }

  setSelectedPhoto(photoData: string, index: number) {
    this.selectedImageUrl = this.getImageUrl(photoData);
    this.selectedIndex = index;
  }

  setSelectedFlora(flora: any) {
    this.selectedFlora = { ...flora }; // Copy the object to avoid reference issues
  }

  setSelectedFauna(fauna: any) {
    this.selectedFauna = { ...fauna }; // Copy the object to avoid reference issues
  }

  setSelectedBerita(berita: any) {
    this.selectedBerita = { ...berita }; // Copy the object to avoid reference issues
  }

  setSelectedLearningModule(learningModule: any) {
    this.selectedLearningModule = { ...learningModule }; // Copy the object to avoid reference issues
  }

  setSelectedPost(post: any) {
    this.selectedPost = { ...post }; // Copy the object to avoid reference issues
    console.log(post)
  }

  setSelectedUsers(Users: any) {
    this.selectedUsers = { ...Users }; // Copy the object to avoid reference issues
  }

  onFileChange(event: any): void {
    this.selectedImages = [];
    this.selectedImagesBase64 = [];
    const files = event.target.files;

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.selectedImages.push(file);

        const reader = new FileReader();
        reader.onload = ((index) => {
          return (e: any) => {
            this.selectedImagesBase64.push(e.target.result);

            // Set the first image as the preview
            if (index === 0) {
              this.imagePreview = e.target.result;
            }
          };
        })(i); // Immediately invoke with the loop index

        reader.readAsDataURL(file); // Convert the file to a Base64 string
      }
      this.picChange = true;
    } else {
      // Clear selections if no file is selected
      this.imagePreview = null;
      this.selectedImages = [];
      this.selectedImagesBase64 = [];
    }
  }

  deleteImageFlora(index: number): void {
    if (!this.selectedFlora._id) {
      console.error('Flora ID is missing');
      return;
    }

    this.floraService.deleteFloraPhoto(this.selectedFlora._id, index).subscribe({
      next: (response) => {
        console.log('Photo deleted successfully', response);

        this.selectedImages.splice(index, 1);
        this.selectedImagesBase64.splice(index, 1);

        // Update preview if the first image is removed
        if (this.selectedImagesBase64.length > 0) {
          this.imagePreview = this.selectedImagesBase64[0];
        } else {
          this.imagePreview = null;
        }
      },
      error: (error) => {
        console.error('Error deleting photo', error);
      }
    });
  }

  deleteImageFauna(index: number): void {
    if (!this.selectedFauna._id) {
      console.error('Fauna ID is missing');
      return;
    }

    this.faunaService.deleteFaunaPhoto(this.selectedFauna._id, index).subscribe({
      next: (response) => {
        console.log('Photo deleted successfully', response);

        this.selectedImages.splice(index, 1);
        this.selectedImagesBase64.splice(index, 1);

        // Update preview if the first image is removed
        if (this.selectedImagesBase64.length > 0) {
          this.imagePreview = this.selectedImagesBase64[0];
        } else {
          this.imagePreview = null;
        }
      },
      error: (error) => {
        console.error('Error deleting photo', error);
      }
    });
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.selectedImagesBase64.splice(index, 1);

    // Update preview if the first image is removed
    if (this.selectedImagesBase64.length > 0) {
      this.imagePreview = this.selectedImagesBase64[0];
    } else {
      this.imagePreview = null;
    }
  }

  filteredPosts() {
    return this.postList.filter(post =>
      post.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Sort posts based on selected criteria
  sortPosts() {
    if (this.selectedSort === 'latest') {
      this.postList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (this.selectedSort === 'mostLiked') {
      this.postList.sort((a, b) => b.like.length - a.like.length);
    }
  }

  onLike(postId: string, username: string, event: MouseEvent): void {
    event.stopPropagation(); // Prevent modal opening

    this.postService.likePost(postId, username).subscribe({
      next: (response) => {
        const post = this.postList.find((p: { _id: any }) => p._id === postId);
        if (post) {
          post.like = response.likes; // Update likes array
        }
      },
      error: (error) => {
        console.error('Error toggling like:', error);
      },
    });
  }

  onDislike(postId: string, username: string, event: MouseEvent): void {
    event.stopPropagation(); // Prevent modal opening

    this.postService.dislikePost(postId, username).subscribe({
      next: (response) => {
        const post = this.postList.find((p: { _id: any }) => p._id === postId);
        if (post) {
          post.dislike = response.dislikes; // Update dislikes array
        }
      },
      error: (error) => {
        console.error('Error toggling dislike:', error);
      },
    });
  }

  onAddComment(postId: string, username: string, comment: string): void {
    if (!comment.trim()) {
      console.log('Empty adding comment');
      return; // Avoid empty comments
    }

    this.postService.addComment(postId, username, comment).subscribe({
      next: (response) => {
        const post = this.postList.find((p: { _id: any }) => p._id === postId);
        if (post) {
          post.comments = response.comments; // Update comments with latest data
        }
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      },
    });
  }

  getProfilePic(username: string): string {
    // Ensure usernames array exists
    if (!this.usernames || !Array.isArray(this.usernames)) {
      return this.getErrorImageUrl();
    }
  
    // Find user by username
    const user = this.usernames.find((user) => user.username === username);
  
    // Validate user object and photos array
    if (user?.photos?.length > 0 && user.photos[0]?.data && user.photos[0]?.contentType) {
      return this.getImageUrl(user.photos[0].data);
    }
  
    // Check if current user has a valid profile pic
    if (this.userData?.photos?.length > 0 && this.userData.photos[0]?.data && this.userData.photos[0]?.contentType) {
      return this.getImageUrl(this.userData.photos[0].data);
    }
  
    // Return default error image if no valid profile picture is found
    return this.getErrorImageUrl();
  }  

  addQuestion(): void {
    this.questions.push({
      text: '',
      options: [
        { label: 'A', text: '' },
        { label: 'B', text: '' },
        { label: 'C', text: '' },
        { label: 'D', text: '' }
      ],
      correctAnswer: ''
    });
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  setCorrectAnswer(questionIndex: number, optionLabel: string): void {
    this.questions[questionIndex].correctAnswer = optionLabel;
  }

  saveQuiz(): void {
    if (!this.quizTitle || this.questions.length === 0) {
      alert('Please enter a quiz title and at least one question.');
      return;
    }

    for (const question of this.questions) {
      if (!question.text || question.options.some((opt: { text: any; }) => !opt.text) || !question.correctAnswer) {
        alert('All questions must have text, options, and a correct answer.');
        return;
      }
    }

    const quizData = {
      title: this.quizTitle,
      questions: this.questions
    };

    this.quizService.saveQuiz(quizData).subscribe(response => {
      alert('Quiz saved successfully!');
    }, error => {
      alert('Failed to save quiz.');
    });
  }

  resetQuiz(): void {
    this.quizService.resetQuiz().subscribe({
      next: () => {
        this.quizTitle = '';
        this.questions = [];
      },
      error: (err) => console.error('Failed to reset quiz:', err)
    });
  }

  createDefaultQuiz() {
    this.quizTitle = "New Quiz";
    this.questions = [
      {
        text: '',
        options: [
          { label: 'A', text: '' },
          { label: 'B', text: '' },
          { label: 'C', text: '' },
          { label: 'D', text: '' }
        ],
        correctAnswer: null
      }
    ];
  }

  fetchEvents(): void {
    this.eventService.fetchEvents().subscribe(
      (events) => {
        events.forEach((event) => {
          const eventId = event._id; // MongoDB _id
          const startDate = event.startDate;
          const endDate = event.endDate || startDate;
          const color = event.color || this.getRandomColor();
  
          // Create event object for eventList
          const eventObj = {
            id: eventId,
            name: event.name,
            startDate: startDate,
            endDate: endDate,
            note: event.note,
            color: color
          };
  
          // Add to local event list
          this.eventList.push(eventObj);
  
          // Create event object for EvoCalendar
          const calendarEventObj = {
            id: eventId,
            name: event.name,
            date: [startDate, endDate],
            description: event.note,
            type: "event",
            color: color
          };
  
          // Simulate adding event dynamically to EvoCalendar
          setTimeout(() => {
            $('#calendar').evoCalendar('addCalendarEvent', calendarEventObj);
          }, 100);
        });
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }
  
  
  // addEvent(event: Event) {
  //   event.preventDefault();
  
  //   if (!this.newEvent.name || !this.newEvent.startDate) {
  //     console.error("Event name and start date are required.");
  //     return;
  //   }
  
  //   const endDate = this.newEvent.endDate || this.newEvent.startDate;
  
  //   const newEventObj = {
  //     name: this.newEvent.name,
  //     note: this.newEvent.note || "",
  //     startDate: this.newEvent.startDate,
  //     endDate: endDate,
  //     createdBy: "Admin",
  //   };
  
  //   this.eventService.addEvent(newEventObj).subscribe(
  //     (response: any) => {
  //       console.log("Event added:", response);
  
  //       const eventToAdd = {
  //         id: response._id, // Get event ID from backend response
  //         name: newEventObj.name,
  //         date: [newEventObj.startDate, newEventObj.endDate],
  //         description: newEventObj.note,
  //         type: "event",
  //         color: this.getRandomColor()
  //       };
  
  //       $('#calendar').evoCalendar('addCalendarEvent', eventToAdd);
  //       this.fetchEvents(); // Refresh list
  //     },
  //     (error) => {
  //       console.error("Error adding event:", error);
  //     }
  //   );
  // }
  
  deleteEvent(index: number, eventId: string) {
    if (!eventId) {
      console.error("Invalid event ID:", eventId);
      return;
    }
  
    this.eventService.deleteEvent(eventId).subscribe((response) => {
      console.log("Event deleted:", response);
  
      this.eventList.splice(index, 1);
      $('#calendar').evoCalendar('removeCalendarEvent', eventId);
    }, (error) => {
      console.error("Error deleting event:", error);
    });
  }

  fetchReports() {
    this.reportService.getReports().subscribe((data) => {
      this.reports = data;
    });
  }

  deleteReport(id: string) {
    this.reportService.deleteReport(id).subscribe(() => {
      this.reports = this.reports.filter((report) => report._id !== id);
      alert('Report deleted successfully!');
    });
  }

  logout(): void {
    localStorage.removeItem('token');  // Remove token
    localStorage.removeItem('admin');   // Remove user data
    this.isLoggedIn = false;  // Update login status
    this.cdRef.detectChanges();  // Explicitly trigger change detection
    this.router.navigate(['/logreg-page']);  // Redirect to login page
  }
  
}
