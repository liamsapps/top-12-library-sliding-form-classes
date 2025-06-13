const books = document.querySelector("#books");
const btnAdd = document.querySelector("#add");
const myForm = document.querySelector("#my_form");
const formMsg = document.querySelector("#message");
const bTitle = document.querySelector("#book_title");
const bAuthor = document.querySelector("#book_author");
const bPages = document.querySelector("#book_pages");
const bRead = document.querySelector("#book_read");
const btnSubmit = document.querySelector("#submit");
const btnCancel = document.querySelector("#cancel");
const bookInfo = document.querySelectorAll(".book_info");

function GenerateGuid() {
    if (self && self.crypto && typeof self.crypto.randomUUID === 'function') {
        const uuid = self.crypto.randomUUID();         
        return uuid;
    } else {
        console.log("self.crypto not available");
    }
}

class Library {
    static books = [];
    
    static checkLibrary(bookTitle, bookAuthor) {
        return Library.books.findIndex(book => book.title === bookTitle && book.author === bookAuthor);        
    }
    
    static addBookToLibrary(book) { 
        let bookFound = Library.checkLibrary(book.title, book.author);
                           
        if (bookFound !== -1) {
            return true;
        }
        else {
            Library.books.unshift(book);  
            return false;      
        } 
    }

    static removeBookFromLibrary(bookID) {        
        const bookIndex = Library.books.findIndex(book => book.id === bookID);
        Library.books.splice(bookIndex, 1);
    }
}

class Book {
    constructor(title, author, pages, read) {
        this.id = GenerateGuid();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
    
    toggleRead() {
        this.read = this.read === 'yes' ? 'no' : 'yes';
    }   
}

document.addEventListener("DOMContentLoaded", (event) => {
    myForm.style.cssText = "display: none; visibility: hidden";
    loadBooks();
});

// from the left, form will slide into place
btnAdd.addEventListener("click", formDisplay);

// hide form and clear inputs
btnCancel.addEventListener("click", () => {
    formDisplay();
    formReset();
});

myForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    if (myForm.checkValidity()) {
        // Form is valid
        // const bookCheck = addBookToLibrary(bTitle.value, bAuthor.value, bPages.value, bRead.value);
        const bookCheck = Library.addBookToLibrary(new Book(bTitle.value, bAuthor.value, bPages.value, bRead.value));

        // books already exists
        if (bookCheck) {
            // enable use of margin in CSS to better separate message from label (book title)
            formMsg.style.cssText = "display: inline-block; margin-bottom: 1rem;";
            formMsg.textContent = `${bTitle.value} by ${bAuthor.value} already exists. Try again.`;
        }
        else {
            // if new book added OR cancelled
            formReset();

            // hide form & enable button ("Add to Collection") 
            formDisplay();
        
            loadBooks();             
        }    
    }       
});

function formDisplay() {    
    if (btnAdd.disabled === false) {        
        btnAdd.disabled = true;        
        myForm.style.cssText = "display: block; visibility: visible";
        bookInfo.forEach(item => item.disabled = false);
    }
    else {
        btnAdd.disabled = false;
        myForm.style.cssText = "display: none; visibility: hidden";
        bookInfo.forEach(item => item.disabled = true);
    }    
}

function formReset() {
    // reset span to prevent added space between empty message and label (book title)    
    formMsg.style.cssText = "display: inline;";
    formMsg.textContent = "";
    bTitle.value = "";
    bAuthor.value = "";
    bPages.value = "";
    bRead.value = "";
}

function loadBooks() {
    while (books.hasChildNodes()) {
        books.removeChild(books.firstChild);
    }

    // myLibrary.forEach((item) => {            
    Library.books.forEach((item) => {
        const bookCard = document.createElement("div");
        bookCard.className = "card";

        const listHolder = document.createElement("div");
        listHolder.className = "book_list";
        const list = document.createElement("ul");

        const bookTitle = document.createElement("li");
        bookTitle.textContent = item.title;

        const bookAuthor = document.createElement("li");
        bookAuthor.textContent = item.author;

        const bookPages = document.createElement("li");
        bookPages.textContent = item.pages;

        const bookRead = document.createElement("li");        
        bookRead.textContent = (item.read === "yes") ? "read" : "not read";         
        bookRead.className = (item.read === "yes") ? "book_read" : "book_not_read";      
        
        const items = [bookTitle, bookAuthor, bookPages, bookRead];        
        items.forEach(item => list.appendChild(item));

        listHolder.appendChild(list);
        bookCard.appendChild(listHolder);        

        const buttonHolder = document.createElement("div");
        buttonHolder.className = "book_buttons";
                
        const bookBtnRead = document.createElement("button");
        bookBtnRead.textContent = "Read ?";
        bookBtnRead.addEventListener("click", () => {
            item.toggleRead()
            loadBooks();
        });        

        const bookBtnDelete = document.createElement("button");
        bookBtnDelete.textContent = "Delete";        
        // NO WORK
        // bookBtnDelete.addEventListener("click", (e) => removeBookFromLibrary(e.target.id));      
        // WORKS
        bookBtnDelete.addEventListener("click", () => {
            Library.removeBookFromLibrary(item.id);
            loadBooks();

        });      
        // bookBtnDelete.addEventListener("click", () => removeBookFromLibrary(item.id));      
        // bookBtnDelete.addEventListener("click", (event) => removeBookFromLibrary(item.id));      
        // bookBtnDelete.addEventListener("click", (event) => removeBookFromLibrary(event, item.id));      
        
        buttonHolder.appendChild(bookBtnRead);
        buttonHolder.appendChild(bookBtnDelete);
        bookCard.appendChild(buttonHolder);

        books.appendChild(bookCard);        
    });
}

// test data
const book1 = new Book("Utopia", "Sir Thomas More", 359, "yes");
const book2 = new Book("Pillars of the Earth", "Ken Follett", 806, "yes");
const book3 = new Book("The Catcher in the Rye", "J.D. Salinger", 277, "no");
const book4 = new Book("1984", "George Orwell", 328, "yes");
const book5 = new Book("A Canticle for Leibowitz", "Walter M. Miller Jr.", 320, "yes");
const book6 = new Book("Animal Farm", "George Orwell", 122, "yes");
const book7 = new Book("War and Peace", "Leo Tolstoy", 1225, "no");
const book8 = new Book("Brave New World", "Aldous Huxley", 268, "yes");
const book9 = new Book("Moby Dick", "Herman Melville", 635, "no");

Library.addBookToLibrary(book1);
Library.addBookToLibrary(book2);
Library.addBookToLibrary(book3);
Library.addBookToLibrary(book4);
Library.addBookToLibrary(book5);
Library.addBookToLibrary(book6);
Library.addBookToLibrary(book7);
Library.addBookToLibrary(book8);
Library.addBookToLibrary(book9);


// addBookToLibrary("Utopia", "Sir Thomas More", 359, "yes");
// addBookToLibrary("Pillars of the Earth", "Ken Follett", 806, "yes");
// addBookToLibrary("The Catcher in the Rye", "J.D. Salinger", 277, "no");
// addBookToLibrary("1984", "George Orwell", 328, "yes");
// addBookToLibrary("A Canticle for Leibowitz", "Walter M. Miller Jr.", 320, "yes");
// addBookToLibrary("Animal Farm", "George Orwell", 122, "yes");
// addBookToLibrary("War and Peace", "Leo Tolstoy", 1225, "no");
// addBookToLibrary("Brave New World", "Aldous Huxley", 268, "yes");
// addBookToLibrary("Moby Dick", "Herman Melville", 635, "no");

// addBookToLibrary("Utopia", "Sir Thomas More", 359, "yes");
// addBookToLibrary("Pillars of the Earth", "Ken Follett", 806, "yes");
// addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281, "yes");
// addBookToLibrary("1984", "George Orwell", 328, "yes");
// addBookToLibrary("Animal Farm", "George Orwell", 122, "yes");
// addBookToLibrary("Brave New World", "Aldous Huxley", 268, "yes");
// addBookToLibrary("A Canticle for Leibowitz", "Walter M. Miller Jr.", 320, "yes");
// addBookToLibrary("The Great Gatsby", "F. Scott Fitzgerald", 180, "yes");
// addBookToLibrary("Moby Dick", "Herman Melville", 635, "no");
// addBookToLibrary("War and Peace", "Leo Tolstoy", 1225, "no");
// addBookToLibrary("The Catcher in the Rye", "J.D. Salinger", 277, "no");
// addBookToLibrary("Lord of the Flies", "William Golding", 224, "no");







