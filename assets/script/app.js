'use strict';
import { listen, select, sleep } from './utils.js';
const user = {
  email: "andre@github.com",
  password: "123"
};
const API_RANDOMUSER = 'https://randomuser.me/api/?nat=CA&results=10';
const API_OPTIONS = { method: 'GET', header: { 'Content-type': 'application/JSON; charset=UTF-8' }, mode: 'cors' };
const emailInput = select('.login-form input[name=email]');
const passInput = select('.login-form input[name=password]');
const loginBtn = select('.login-form button');
const errorMsg = select('p.error');
const usersContainer = select('.users');

const log = console.log;
const tip = (msg) => select('.error').innerText = msg;
const saveItem = (key, item) => localStorage.setItem(key, JSON.stringify(item));
const loadItem = (key) => JSON.parse(localStorage.getItem(key));
async function retriveData(endpoint, options = {}, success = log, error = log) {
  try {
    const response = await fetch(endpoint, options);
    if (!response.ok) throw new Error(`${response.statusText} (${response.status})`);
    const json = await response.json();
    success(json);
  } catch (err) {
    error(err);
  }
}
function login(email, password) {
  const user = loadItem("user");
  return user.email === email && user.password === password;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
}

function createUserElement(user) {
  const { name: { first, last }, picture: { thumbnail }, location: { city } } = user;

  const li = document.createElement('li');
  li.className = 'user flex flex-sb';
  li.innerHTML = `
      <img class='portrait' src='${thumbnail}' />
      <div class='grid'>
          <span>${first} ${last}</span>
          <span>${city}</span>
      </div>
      <img class='add' src='./assets/media/icon-plus.png'/>
  `;

  return li;
}

function addUsers(users) {
  const fragment = document.createDocumentFragment();

  const imagePromises = users.map(u => loadImage(u.picture.thumbnail));

  Promise.all(imagePromises).then(() => {
    users.forEach(u => {
      const userElement = createUserElement(u);
      fragment.appendChild(userElement);
    });

    usersContainer.innerHTML = '';
    usersContainer.appendChild(fragment);
    usersContainer.classList.remove('loading');
  });
}

// Main
localStorage.clear();
saveItem("user", user);
if (loginBtn) {
  listen('click', loginBtn, e => {
    if (login(emailInput.value, passInput.value)) {
      log(`Hello! ${user.email}`);
      window.location.href = 'home.html';
    } else {
      log(`Login failed with ${emailInput.value} and ${passInput.value}`);
      emailInput.focus();
      errorMsg.style.opacity = 1;
      const hideError = () => log(errorMsg.style.opacity = 0);
      listen('input', emailInput, hideError);
      listen('input', passInput, hideError);
    }
    e.preventDefault();
  });
} else {
  retriveData(API_RANDOMUSER, API_OPTIONS, json => addUsers(json.results));
}