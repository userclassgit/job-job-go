import { listen, select } from './utils.js';
'use strict';
const user = {
    username: "andre",
    password: "123"
};
const API_RANDOMUSER = 'https://randomuser.me/api/?nat=CA&results=10&seed=same';
const API_OPTIONS = { method: 'GET', header: { 'Content-type': 'application/JSON; charset=UTF-8' }, mode: 'cors' };
const userInput = select('input[name=username]');
const passInput = select('input[name=password]');
const loginBtn = select('input[name=login]');
const usersContainer = select('.users');

const log = console.log;
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
function login(username, password) {
    const user = loadItem("user");
    return user.username === username && user.password === password;
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
// btn trigger
if (login("andre", "123")) {
    log(`Hello! ${user.username}`);
    retriveData(API_RANDOMUSER, API_OPTIONS, json=>addUsers(json.results));
} else {
    log(`Login failed with ${user.username}`);
}