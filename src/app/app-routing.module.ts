import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { BookReaderComponent } from './book-reader/book-reader.component';

const routes: Routes = [
    { path: '', component: HomePageComponent},
    { path: 'book/:id', component: BookReaderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
