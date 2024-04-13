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

function addUsers(users) {
    const fragment = document.createDocumentFragment();
    users.forEach(u => {
        const { name: { title, first, last }, picture: { thumbnail }, location:{city} } = u;

        const li = document.createElement('li');
        li.className = 'user flex flex-sb';
        li.innerHTML = `<img class='portrait' src='${thumbnail}' />
        <div class='grid'><span>${first} ${last}</span><span>${city}</span></div>
        <img class='add' src='./assets/media/icon-plus.png'/>`;
        fragment.appendChild(li);
    });
    usersContainer.innerHTML = '';
    // DocumentFragment should add fetched data all at once instead of one by one
    usersContainer.appendChild(fragment);
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