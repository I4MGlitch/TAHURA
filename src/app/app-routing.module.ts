import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { GalleryPageComponent } from './gallery-page/gallery-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { FloraPageComponent } from './flora-page/flora-page.component';
import { FaunaPageComponent } from './fauna-page/fauna-page.component';
import { BeritaDetailPageComponent } from './berita-detail-page/berita-detail-page.component';
import { BeritaPageComponent } from './berita-page/berita-page.component';
import { DetailPageComponent } from './detail-page/detail-page.component';
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

const routes: Routes = [
  {path: '', component: LandingPageComponent}, 
  {path: 'gallery-page', component: GalleryPageComponent}, 
  {path: 'contact-page', component: ContactPageComponent}, 
  {path: 'flora-page', component: FloraPageComponent}, 
  {path: 'fauna-page', component: FaunaPageComponent}, 
  {path: 'berita-page', component: BeritaPageComponent}, 
  {path: 'beritaDetail-page', component: BeritaDetailPageComponent},
  {path: 'beritaDetail-page/:id', component: BeritaDetailPageComponent},
  {path: 'detail-page', component: DetailPageComponent},
  {path: 'detail-page/:type/:id', component: DetailPageComponent},
  {path: 'search', component: SearchComponent},
  {path: 'logreg-page', component: LogregPageComponent},
  {path: 'admin-page', component: AdminPageComponent}, 
  {path: 'chatbot-page', component: ChatbotPageComponent},
  {path: 'submit-report-page', component: SubmitReportPageComponent},
  {path: 'event-calendar-page', component: EventCalendarPageComponent},
  {path: 'quiz-page', component: QuizPageComponent},
  {path: 'learning-modules-page', component: LearningModulesPageComponent},
  {path: 'module-detail-page', component: ModuleDetailPageComponent},
  {path: 'module-detail-page/:id', component: ModuleDetailPageComponent},
  {path: 'socializing-spot-page', component: SocializingSpotPageComponent},
  {path: 'mangroves-dashboard-page', component: MangrovesDashboardPageComponent},
  {path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
