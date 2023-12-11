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
  wordsPerPage: number = 300;  // Adjust as needed
  gesture: String = "";
  bookmarks: Set<number> = new Set();
  tableOfContents: { title: string, page: number }[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.loadBookContent(`assets/books/${bookId}.txt`);
    }
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
        this.extractTableOfContents(data);
      }, error => {
        console.error('Error loading book content:', error);
      });
  }

  extractTableOfContents(data: string) {
    const lines = data.split('\n');
    let currentPage = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('CHAPTER')) {
        this.tableOfContents.push({ title: line, page: currentPage });
      } else {
        currentPage++;
      }
    }
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
  }
}