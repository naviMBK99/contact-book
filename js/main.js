const API = "  http://localhost:8000/products";
const openModalBtn = document.getElementById("openModal");
const contactModal = document.getElementById("contactModal");
const closeModalBtn = document.getElementById("closeModal");
const contactForm = document.getElementById("contactForm");
openModalBtn.addEventListener("click", () => {
  contactModal.style.display = "block";
});
closeModalBtn.addEventListener("click", () => {
  contactModal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === contactModal) {
    contactModal.style.display = "none";
  }
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    photo: document.getElementById("photo").value,
  };
  saveContact(formData);
  contactModal.style.display = "none";
});

function saveContact(contact) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(contact),
  }).then(() => readContacts());
}
const list = document.querySelector(".contact-list");
function readContacts() {
  fetch(API)
    .then((response) => response.json())
    .then((data) => {
      list.innerHTML = "";
      data.forEach((contact) => {
        list.innerHTML += `<li>
          <p>First Name: ${contact.firstName}</p>
          <p>Last Name: ${contact.lastName}</p>
          <p>Phone: ${contact.phoneNumber}</p>
          <img src=${contact.photo} alt="">
          <button data-id="${contact.id}" class="btnDelete">Delete</button>
          <button data-id="${contact.id}" class="btnEdit">Edit</button>
        </li>`;
      });
    });
}
readContacts();
list.addEventListener("click", (e) => {
  const deleteButton = e.target.closest(".btnDelete");
  if (deleteButton) {
    const contactItem = deleteButton.closest("li");
    const contactId = deleteButton.dataset.id;
    deleteContact(contactId, contactItem);
  }
});
function deleteContact(contactId, contactItem) {
  fetch(`${API}/${contactId}`, {
    method: "DELETE",
  }).then(() => {
    contactItem.remove();
  });
}
const editModal = document.getElementById("editModal");
const btnSaveEdit = document.getElementById("btnEditSave");
const inpEdit = document.getElementById("inpEdit");
const inpLastNameEdit = document.getElementById("inpLastNameEdit");
const inpPhoneEdit = document.getElementById("inpPhoneEdit");
const inpPhotoEdit = document.getElementById("inpPhotoEdit");
list.addEventListener("click", (e) => {
  const editButton = e.target.closest(".btnEdit");

  if (editButton) {
    const contactId = editButton.dataset.id;
    fetch(`${API}/${contactId}`)
      .then((res) => res.json())
      .then((data) => {
        editModal.style.display = "block";
        inpEdit.value = data.firstName;
        inpLastNameEdit.value = data.lastName;
        inpPhoneEdit.value = data.phoneNumber;
        inpPhotoEdit.value = data.photo;
        btnSaveEdit.dataset.id = data.id;
      });
  }
});
btnSaveEdit.addEventListener("click", () => {
  const editedContact = {
    firstName: inpEdit.value,
    lastName: inpLastNameEdit.value,
    phoneNumber: inpPhoneEdit.value,
    photo: inpPhotoEdit.value,
  };
  const contactId = btnSaveEdit.dataset.id;
  console.log("Edited Contact:", editedContact);
  console.log("Contact ID:", contactId);
  editContact(editedContact, contactId);
});
function editContact(editedContact, contactId) {
  fetch(`${API}/${contactId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedContact),
  })
    .then((response) => {
      return response.json();
    })
    .then(() => {
      editModal.style.display = "none";
      readContacts();
    });
}
