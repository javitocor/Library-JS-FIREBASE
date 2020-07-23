function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

/*class Book {
    constructor(title, author, pages, read){
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;    
    }
}*/
Book.prototype.info = function () {
    return this.title + " by " + this.author + ", " + this.pages + " pages, " + this.read;
}
Book.prototype.toggleReadStatus = function () {
    this.read = this.read == 'Read' ? 'Not read' : 'Read';
}
var firestore = firebase.firestore();
const docRef = firestore.collection('books');
const library = document.getElementById("library");
let myLibrary = [];
docRef.get().then((querySnapshot) => {
    let i = 0
    querySnapshot.forEach((doc) => {
        myLibrary[i] = doc.data();
        i++;
    });
    render();
});

function addBookLIstFirebase(newBook){
    docRef.doc(`${newBook.title}`).set({
        title: newBook.title,
        author: newBook.author,
        pages: newBook.pages,
        read: newBook.read
      }).then(function(docRef) {
          console.log("Document successfully written!");
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
};

let submitbutton = document.getElementById("submit");
submitbutton.addEventListener('click', function () {
    addBookToLibrary(myLibrary);
    document.getElementById("form").reset();
    render();
});

function addBookToLibrary(myLibrary) {
    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let pages = document.getElementById("pages").value;
    let read = document.querySelector('input[name="read"]:checked').value;
    let newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    addBookLIstFirebase(newBook);
}

const mas = document.getElementsByClassName('maslibros')[0];
const addform = document.getElementById("addButton");
addform.addEventListener("click", function () {
    var x = document.getElementById("form");
    if (x.style.display === "none") {
        x.style.display = "block";
        mas.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    } else {
        x.style.display = "none";
        mas.style.backgroundColor = 'transparent';
    }
});

const hide = document.getElementById("seeButton");
hide.addEventListener("click", function () {
    var x = document.getElementById("library");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
});


function render() {
    library.innerHTML = "";
    let table = document.createElement('table');
    let row = document.createElement('tr');
    let a1 = document.createElement('th');
    a1.textContent = "Title";
    a1.className = "awa";
    let a2 = document.createElement('th');
    a2.textContent = "Author";
    a2.className = "awa";
    let a3 = document.createElement('th');
    a3.textContent = "Pages";
    a3.className = "awa";
    let a4 = document.createElement('th');
    a4.textContent = "Read";
    a4.className = "awa";
    let a5 = document.createElement('th');
    a5.textContent = "Remove";
    a5.className = "awa";

    library.appendChild(table);
    table.appendChild(row);
    row.appendChild(a1);
    row.appendChild(a2);
    row.appendChild(a3);
    row.appendChild(a4);
    row.appendChild(a5);


    myLibrary.forEach((item, index) => {
        let row2 = document.createElement('tr');
        table.appendChild(row2);
        let book_title = document.createElement('td');
        book_title.textContent = item.title;
        let book_author = document.createElement('td');
        book_author.textContent = item.author;
        let book_pages = document.createElement('td');
        book_pages.textContent = item.pages;
        let book_read = document.createElement('td');
        book_read.textContent = item.read;
        let book_remove = document.createElement('button');
        book_remove.textContent = 'Remove Book';
        book_remove.className = "btnn"
        row2.appendChild(book_title);
        row2.appendChild(book_author);
        row2.appendChild(book_pages);
        row2.appendChild(book_read);
        row2.appendChild(book_remove);

        book_read.addEventListener("click", function () {
            if (confirm("Do you want to mark that book as read/unread?")) {
                console.log(item);
                //item.toggleReadStatus();
                change(item, item.read);
                docRef.doc(`${item.title}`).update({
                    read: item.read
                });
                render();
            } else {
                render();
            }
        })

        book_remove.addEventListener('click', function () {
            if (confirm("Do you want to remove that book?")) {
                myLibrary.splice(index, 1);
                docRef.doc(`${item.title}`).delete();
                render();
            } else {
                render();
            }
        });
    });
}

function change(item, status) {
    item.read = status ==='Read' ? 'Not Read' : 'Read';
}


function changeColor(id) {
    if (id.style.color != "blue") {
        id.style.color = "blue";
    } else {
        id.style.color = "white";
    }

}

/*animate.onclick = function () {
    let timePassed = 0;
    let timer = setInterval(function () {
        timePassed++;
        animate.style.left = timePassed + 'px';
        if (timePassed > 950) {
            clearInterval(timer);
            setTimeout(animate.onclick, 2000);
        }

    }, 20);
}*/

render();