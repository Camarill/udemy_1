/* Задание на урок:

3) Задайте пользователю по два раза вопросы:
    - 'Один из последних просмотренных фильмов?'
    - 'На сколько оцените его?'
Ответы стоит поместить в отдельные переменные
Записать ответы в объект movies в формате: 
    movies: {
        'logan': '8.1'
    }

Проверить, чтобы все работало без ошибок в консоли */

'use strict';

let numberOfFilms = +prompt('Сколько фильмов вы уже посмотрели?', '1');

const personalMovieDB = {
    count: numberOfFilms,
    movies : {},
    actors : {},
    genres : [],
    privat : true,
}

for( let i = 0; i <= 1; i++ ) {
    let lastFilm = prompt('Один из последних просмотренных фильмов?', '');
    let lastFilmRating = +prompt('На сколько оцените его?', '');

    personalMovieDB.movies[lastFilm] = lastFilmRating;
}