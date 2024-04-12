'use strict';
import { listen, select } from './utils.js';
const user = {
    email: "andre@github.com",
    password: "123"
};
const API_RANDOMUSER = 'https://randomuser.me/api/?nat=CA&results=10&seed=same';
const API_OPTIONS = { method: 'GET', header: { 'Content-type': 'application/JSON; charset=UTF-8' }, mode: 'cors' };
const emailInput = select('.login-form input[name=email]');
const passInput = select('.login-form input[name=password]');
const loginBtn = select('.login-form button');
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
    users.forEach(u => {
        const { name: { title, first, last }, picture: { thumbnail } } = u;
        // add to users' container
        log('add user',`<li class='user'><img src='${thumbnail}' /><span>${title}. ${first} ${last}</span></li>`);
    });
}

// Main
localStorage.clear();
saveItem("user", user);
if(loginBtn){
    listen('click', loginBtn, e => {
        if (login(emailInput.value, passInput.value)) {
            log(`Hello! ${user.email}`);
            window.location.href = 'home.html';
        } else {
            log(`Login failed with ${emailInput.value} and ${passInput.value}`);
        }
        e.preventDefault();
    });
}else{
    retriveData(API_RANDOMUSER, API_OPTIONS, json=>addUsers(json.results));
}