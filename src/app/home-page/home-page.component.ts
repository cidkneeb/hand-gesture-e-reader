import { Component, OnInit } from '@angular/core';
import { PredictionEvent } from '../prediction-event';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit{
  gesture: String = "";
  selectedBookIndex: number = 0;
  
  
  books = [
    {id: '1', title: 'A Christmas Carol', cover: 'assets/covers/a-christmas-carol.jpg', path: 'assets/books/a-christmas-carol.txt'},
    {id: '4', title: 'Oliver Twist', cover: 'assets/covers/oliver-twist.jpg', path: 'assets/books/oliver-twist.txt'},
    {id: '3', title: 'Great Expectations', cover: 'assets/covers/great-expectations.jpg', path: 'assets/books/great-expectations.txt'},
    {id: '2', title: 'A Tale of Two Cities', cover: 'assets/covers/tale-of-two.jpg', path: 'assets/books/a-tale-of-two-cities.txt'}
  ]
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openBook(bookId: string) {
    // Correct way to navigate with route parameters
    this.router.navigate(['/book', bookId]);
  }

  openRandomBook(){
    const randomIndex = Math.floor(Math.random() * this.books.length);
    const randomBook = this.books[randomIndex];
    // Assuming you have a method to open a book by its ID:
    this.openBook(randomBook.id);
  }
  
  prediction(event: PredictionEvent){
    this.gesture = event.getPrediction();
    if (this.gesture == 'Hand Pointing'){
      this.selectedBookIndex = (this.selectedBookIndex + 1) % this.books.length;
    }
    if (event.prediction == 'Open Hand' && this.selectedBookIndex != null){
      this.openBook(this.books[this.selectedBookIndex].id);
    }
    }
  }
