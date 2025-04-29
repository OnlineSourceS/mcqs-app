import React from 'react';
import './LibraryDesign.css';

const LibraryDesign: React.FC = () => {
  return (
    <div className="library-design">
      <h1>Library Management System Design</h1>
      
      <section className="class-section">
        <h2>Class: Book</h2>
        <div className="class-content">
          <div className="attributes">
            <h3>Attributes:</h3>
            <ul>
              <li>title: string</li>
              <li>author: Author</li>
              <li>isbn: string</li>
              <li>publicationYear: number</li>
              <li>isAvailable: boolean</li>
              <li>borrower: User | null</li>
            </ul>
          </div>
          <div className="methods">
            <h3>Methods:</h3>
            <ul>
              <li>checkOut(user: User): boolean</li>
              <li>returnBook(): void</li>
              <li>getBookInfo(): string</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="class-section">
        <h2>Class: Author</h2>
        <div className="class-content">
          <div className="attributes">
            <h3>Attributes:</h3>
            <ul>
              <li>name: string</li>
              <li>books: Book[]</li>
              <li>biography: string</li>
            </ul>
          </div>
          <div className="methods">
            <h3>Methods:</h3>
            <ul>
              <li>addBook(book: Book): void</li>
              <li>getBooks(): Book[]</li>
              <li>getAuthorInfo(): string</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="class-section">
        <h2>Class: Library</h2>
        <div className="class-content">
          <div className="attributes">
            <h3>Attributes:</h3>
            <ul>
              <li>books: Book[]</li>
              <li>users: User[]</li>
              <li>name: string</li>
            </ul>
          </div>
          <div className="methods">
            <h3>Methods:</h3>
            <ul>
              <li>addBook(book: Book): void</li>
              <li>removeBook(isbn: string): boolean</li>
              <li>searchByTitle(title: string): Book[]</li>
              <li>searchByAuthor(authorName: string): Book[]</li>
              <li>registerUser(user: User): void</li>
              <li>getAvailableBooks(): Book[]</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="class-section">
        <h2>Class: User</h2>
        <div className="class-content">
          <div className="attributes">
            <h3>Attributes:</h3>
            <ul>
              <li>id: string</li>
              <li>name: string</li>
              <li>borrowedBooks: Book[]</li>
              <li>maxBooksAllowed: number</li>
            </ul>
          </div>
          <div className="methods">
            <h3>Methods:</h3>
            <ul>
              <li>borrowBook(book: Book): boolean</li>
              <li>returnBook(book: Book): boolean</li>
              <li>getBorrowedBooks(): Book[]</li>
              <li>canBorrowMore(): boolean</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="relationships">
        <h2>Class Relationships</h2>
        <ul>
          <li>Book has a composition relationship with Author (a book must have an author)</li>
          <li>Book has an association with User (a book can be borrowed by a user)</li>
          <li>Library has aggregation relationships with both Book and User</li>
          <li>User has an aggregation relationship with Book (borrowed books)</li>
        </ul>
      </section>

      <section className="implementation-notes">
        <h2>Implementation Notes</h2>
        <ul>
          <li>All attributes are private with getter/setter methods where appropriate</li>
          <li>Book class can be extended for different types of books (e.g., EBook, AudioBook)</li>
          <li>Library class implements singleton pattern to ensure only one instance exists</li>
          <li>User class implements borrowing limits and book tracking</li>
          <li>Error handling for book availability and user borrowing limits</li>
        </ul>
      </section>
    </div>
  );
};

export default LibraryDesign; 