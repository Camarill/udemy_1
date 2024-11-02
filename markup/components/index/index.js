/* Задание на урок:

3) Создать функцию writeYourGenres в которой пользователь будет 3 раза отвечать на вопрос 
"Ваш любимый жанр под номером ${номер по порядку}". Каждый ответ записывается в массив данных
genres */

'use strict';

let numberOfFilms;

function start() {
    while (numberOfFilms == '' || numberOfFilms == null || isNaN(numberOfFilms)) {
        numberOfFilms = +prompt('Сколько фильмов вы уже посмотрели?', '');
    }

    return numberOfFilms;
}

start();

const personalMovieDB = {
    count: numberOfFilms,
    movies : {},
    actors : {},
    genres : [],
    privat : false,
}

function rememberMyFilms() {
    for( let i = 0; i < start(); i++ ) {
        let lastFilm = prompt('Один из последних просмотренных фильмов?', '');
        let lastFilmRating = +prompt('На сколько оцените его?', '');

        if (lastFilm != null && lastFilmRating != null && lastFilm != '' && lastFilmRating != '' && lastFilm.length < 50) {
            personalMovieDB.movies[lastFilm] = lastFilmRating;
            console.log('done');
        } else {
            console.log('error');
            i--;
        }
    }
}

rememberMyFilms();

function writeYourGenres() {
    for( let i = 1; i <= 3; i++ ) {
        personalMovieDB.genres.push(prompt(`Ваш любимый жанр под номером ${i}`, ''))
    }
}

writeYourGenres()

function detectPersonalLevel() {
    if (personalMovieDB.count < 10) {
        console.log("Просмотрено довольно мало фильмов");
    } else if (personalMovieDB.count >= 10 && personalMovieDB.count < 30) {
        console.log("Вы классический зритель");
    } else if (personalMovieDB.count >= 30) {
        console.log("Вы киноман");
    } else {
        console.log("Произошла ошибка");
    }
}

detectPersonalLevel();

function showMyDB(hidden) {
    if(!hidden) {
        console.log(personalMovieDB)
    }
}

showMyDB(personalMovieDB.private)