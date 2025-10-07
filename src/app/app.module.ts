import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { GalleryPageComponent } from './gallery-page/gallery-page.component';
import { FloraPageComponent } from './flora-page/flora-page.component';
import { FaunaPageComponent } from './fauna-page/fauna-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { BeritaPageComponent } from './berita-page/berita-page.component';
import { BeritaDetailPageComponent } from './berita-detail-page/berita-detail-page.component';
import { DetailPageComponent } from './detail-page/detail-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { SearchComponent } from './search/search.component';
import { LogregPageComponent } from './logreg-page/logreg-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { ChatbotPageComponent } from './chatbot-page/chatbot-page.component';
import { SubmitReportPageComponent } from './submit-report-page/submit-report-page.component';
import { EventCalendarPageComponent } from './event-calendar-page/event-calendar-page.component';
import { QuizPageComponent } from './quiz-page/quiz-page.component';
import { LearningModulesPageComponent } from './learning-modules-page/learning-modules-page.component';
import { ModuleDetailPageComponent } from './module-detail-page/module-detail-page.component';
import { SocializingSpotPageComponent } from './socializing-spot-page/socializing-spot-page.component';
import { MangrovesDashboardPageComponent } from './mangroves-dashboard-page/mangroves-dashboard-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    GalleryPageComponent,
    FloraPageComponent,
    FaunaPageComponent,
    ContactPageComponent,
    BeritaPageComponent,
    BeritaDetailPageComponent,
    DetailPageComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundPageComponent,
    SearchComponent,
    LogregPageComponent,
    AdminPageComponent,
    ChatbotPageComponent,
    SubmitReportPageComponent,
    EventCalendarPageComponent,
    QuizPageComponent,
    LearningModulesPageComponent,
    ModuleDetailPageComponent,
    SocializingSpotPageComponent,
    MangrovesDashboardPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
