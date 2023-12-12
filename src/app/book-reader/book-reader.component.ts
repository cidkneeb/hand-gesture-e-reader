import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PredictionEvent } from '../prediction-event';
@Component({
  selector: 'app-book-reader',
  templateUrl: './book-reader.component.html',
  styleUrls: ['./book-reader.component.css']
})
export class BookReaderComponent implements OnInit {
  bookContent: string = '';
  currentPage: number = 0;
  pages: string[] = [];
  wordsPerPage: number = 230;
  gesture: String = "";
  bookmarks: Set<number> = new Set();
  isSidebarActive: boolean = false;


  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.loadBookContent(`assets/books/${bookId}.txt`);
    }
  }

  toggleSidebar(){
    this.isSidebarActive = !this.isSidebarActive;
  }

  toggleBookmark(){
    if (!this.bookmarks.has(this.currentPage)){
      this.bookmarks.add(this.currentPage);
    }
  }

  isBookmarked(){
    return this.bookmarks.has(this.currentPage);
  }

  loadBookContent(path: string) {
    this.http.get(path, { responseType: 'text' })
      .subscribe(data => {
        this.splitIntoPages(data);
      }, error => {
        console.error('Error loading book content:', error);
      });
  }
  

  splitIntoPages(data: string) {
    const words = data.split(/\s+/);
    while (words.length > 0) {
      this.pages.push(words.splice(0, this.wordsPerPage).join(' '));
    }
    this.currentPage = 0;
  }

  nextPage() {
    if (this.currentPage < this.pages.length - 1) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  backToLibrary(){
    this.router.navigate(['/']);
  }
  

  prediction(event: PredictionEvent) {
    this.gesture = event.getPrediction();
    if (this.gesture == 'Open and Pointing') {
      this.nextPage();
    } else if (this.gesture == 'Closed and Pointing') {
      this.previousPage();
    }
    if (this.gesture == 'Hand Pinching') {
      this.toggleBookmark();
    }
    if (this.gesture == 'Two Closed Hands') {
      this.backToLibrary();
    }
    if (this.gesture == "Two Hands Pinching"){
      if (this.bookmarks.has(this.currentPage)){
        this.bookmarks.delete(this.currentPage);
      }
    }
    if (this.gesture == "Two Open Hands"){
      this.toggleSidebar();
      this.isSidebarActive = true;
    }
    if (this.gesture == "Two Hands Pointing"){
      this.isSidebarActive = false;
    }
}
}