// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getDatabase, ref, set, onValue, child, push, update, get, remove } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCG8KsKNf03iLva0NuqsafGo_ra0M91aVc",
    authDomain: "crud-operation-831f2.firebaseapp.com",
    databaseURL: "https://crud-operation-831f2-default-rtdb.firebaseio.com",
    projectId: "crud-operation-831f2",
    storageBucket: "crud-operation-831f2.appspot.com",
    messagingSenderId: "489540773740",
    appId: "1:489540773740:web:540d1fab8d169502d2b549"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
const db = getDatabase();
const usersRef = ref(db, 'users');



// define DOM Elements
const addUsersBtn = document.querySelector(".add-user");
const popup = document.querySelector(".popup");
const closeBtn = document.querySelector(".close")
const tableBody = document.querySelector("tbody");
const form = document.querySelector("form")
let updateUsersBtns, deleteBtns;

// show popup
addUsersBtn.addEventListener("click", () => {
    popup.classList.add("active", "add")
})

window.addEventListener("click", (e) => {
    if (e.target == popup) {
        popup.classList.remove("active")
        form.reset()
    }
})

// write data
function writeUserData(name, email, phone) {
    const newUserIdRef = push(usersRef);
    const newUserId = newUserIdRef.key;
    if (!newUserId) {
        alert("Invalid userId");
        return;
    }
    set(newUserIdRef, {
        username: name,
        email: email,
        phone: phone
    })
        .then(() => {
            alert("added");
        })
        .catch((error) => {
            alert(error);
        });
}

// writeUserData("mohamed", "hessennasser@gmail.com", "123456789");

// read data
const starCountRef = ref(db, 'users');
onValue(starCountRef, (snapshot) => {
    const users = snapshot.val();
    tableBody.innerHTML = '';

    for (let user in users) {
        let data = `
        <tr data-id=${user}>
            <td>${users[user].username}</td>
            <td>${users[user].phone}</td>
            <td>${users[user].email}</td>
            <td>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </td>
        </tr>
        `;
        tableBody.innerHTML += data;
    }
    // edit
    updateUsersBtns = document.querySelectorAll(".edit");
    updateUsersBtns.forEach(updateUsersBtn => {
        updateUsersBtn.addEventListener("click", (e) => {
            popup.classList.add("active", "edit");
            if (popup.classList.contains("edit")) {
                let userId = e.target.parentElement.parentElement.dataset.id;
                get(child(usersRef, userId)).then(snapshot => {
                    const data = snapshot.val();
                    form.name.value = data.username;
                    form.phone.value = data.phone;
                    form.email.value = data.email;
                    form.addEventListener("submit", (e) => {
                        e.preventDefault();
                        const newData = {
                            username: form.name.value,
                            phone: form.phone.value,
                            email: form.email.value
                        };
                        update(child(usersRef, userId), newData)
                            .then(() => {
                                alert("updated");
                                popup.classList.remove("active")
                                form.reset()
                            })
                            .catch((error) => {
                                alert(error);
                            });
                    });
                }).catch(error => alert(error));
            }
            popup.classList.remove("edit");

        });
    });

    // delete
    deleteBtns = document.querySelectorAll(".delete");
    deleteBtns.forEach(deleteBtn => {
        deleteBtn.addEventListener("click", (e) => {
            let userId = e.target.parentElement.parentElement.dataset.id;
            let userRef = child(usersRef, userId);
            remove(userRef)
                .then(() => {
                    console.log("User removed");
                })
                .catch((error) => {
                    alert(error);
                });
        });
    });


});

form.addEventListener("submit", (e) => {
    e.preventDefault()
    if (e.target.parentElement.classList.contains("add")) {
        const username = document.getElementById('username').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        writeUserData(username, email, phone)
    } popup.classList.remove("add");

})