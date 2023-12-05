// Import necessary modules
const express = require("express");
const fs = require("fs").promises;

// Create an instance of the Express application
const app = express();

// Set up the application to listen on port 3000
app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});

// Use built-in middleware in Express to parse incoming requests with JSON payloads
app.use(express.json());

// Helper functions

// Function to retrieve all books from the data file
const getBooks = async () => {
    const books = await fs.readFile("../data/book.json", "utf8");
    return JSON.parse(books);
}

// Function to retrieve a specific book by ID from the data file
const getBook = async (id) => {
    const data = await fs.readFile("../data/book.json", "utf8");
    return JSON.parse(data)[id];
}

// Function to delete a book by ID from the data file
const deleteBook = async (id) => {
    const data = await fs.readFile("../data/book.json", "utf8");
    const books = JSON.parse(data).filter((book, i) => i != id);
    const jsonBooks = JSON.stringify(books, null, 2);
    await fs.writeFile("../data/book.json", jsonBooks);
}

// Function to add a new book to the list in the data file
const addBook = async (title, author, available) => {
    const data = await fs.readFile("../data/book.json", "utf8");
    const bookList = JSON.parse(data);
    const newBook = {
        title: title,
        author: author,
        available: available
    };
    bookList.push(newBook);
    const jsonAddBook = JSON.stringify(bookList, null, 2);
    await fs.writeFile("../data/book.json", jsonAddBook);
}

// Function to update a book by ID in the data file
const updateBook = async (id, updatedFields) => {
    const data = await fs.readFile("../data/book.json", "utf8");
    const books = JSON.parse(data);

    if (id >= 0 && id < books.length) {
        books[id] = { ...books[id], ...updatedFields };
        const jsonBooks = JSON.stringify(books, null, 2);
        await fs.writeFile("../data/book.json", jsonBooks);
        return true;
    } else {
        return false; // ID out of range, book not found
    }
}

// Routes

// Route to retrieve all books
app.get("/find-books", async (req, res) => {
    const books = await getBooks();
    res.send(books);
});

// Route to retrieve a specific book by ID
app.get("/find-book/:id", async (req, res) => {
    const id = Number(req.params.id);
    const book = await getBook(id);
    const jsonBook = JSON.stringify(book, null, 2);
    res.send(jsonBook);
});

// Route to add a new book
app.post("/add-book", async (req, res) => {
    await addBook(req.body.title, req.body.author, req.body.available);
    res.status(201).json('You added a new book');
});

// Route to delete a book by ID
app.delete("/delete-book/:id", async (req, res) => {
    const id = Number(req.params.id);
    await deleteBook(id);
    res.status(200).json('You deleted a book');
});

// Route to update a book by ID
app.put("/update-book/:id", async (req, res) => {
    const id = Number(req.params.id);
    const updatedFields = req.body;

    const success = await updateBook(id, updatedFields);

    if (success) {
        res.status(200).json('Book updated successfully');
    } else {
        res.status(404).json('Book not found');
    }
});
