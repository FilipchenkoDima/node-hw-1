const fs = require("fs").promises;
const path = require("path");
const { v4: uuid } = require("uuid");

const contactsPath = path.resolve("db/contacts.json");

async function getContacts() {
  try {
    const contactsJSON = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(contactsJSON);

    return contacts;
  } catch (error) {
    console.log(error);
  }
}

async function listContacts() {
  try {
    const contactsList = await getContacts();
    const contacts = contactsList.map(({ name, email, phone, id }) => {
      return {
        Id: id,
        Name: name,
        Email: email,
        Phone: phone,
      };
    });

    console.table(contacts);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const contactsList = await getContacts();
    const contact = contactsList.filter(
      ({ id }) => String(id) === String(contactId)
    );

    console.table(contact);
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const contactsList = await getContacts();
    const newContacts = contactsList.filter(
      ({ id }) => String(id) !== String(contactId)
    );

    if (newContacts.length === contactsList.length) {
      console.log("You don't have contact with this id!");
      return;
    }
    fs.writeFile(contactsPath, JSON.stringify(newContacts));

    console.log("Contact successfully deleted!");
  } catch (error) {
    console.log(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const contactsList = await getContacts();
    const newContact = {
      id: uuid(),
      name,
      email,
      phone,
    };

    contactsList.push(newContact);
    fs.writeFile(contactsPath, JSON.stringify(contactsList));

    console.log("Success!");
    console.table(newContact);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  addContact,
  removeContact,
  listContacts,
  getContactById,
};
