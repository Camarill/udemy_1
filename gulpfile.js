const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const fileInclude = require('gulp-file-include');
const replace = require('gulp-replace');
const browserSync = require('browser-sync').create();
const fs = require('fs').promises;
const shell = require('gulp-shell');

let prettier;

(async () => {
  prettier = (await import('gulp-prettier')).default;
})();

// Пути к файлам
const paths = {
    html: {
        src: 'markup/pages/**/*.html',
        dest: 'dev/'
    },
    styles: {
        src: ['markup/static/scss/**/*.scss', 'markup/components/**/*.scss'],
        dest: 'dev/static/css/'
    },
    scripts: {
        src: ['markup/static/js/libraries/*.js', 'markup/components/**/*.js'],
        dest: 'dev/static/js/'
    },
    images: {
        src: 'markup/static/img/**/*.{jpg,jpeg,png,svg,gif,mp4}',
        dest: 'dev/static/img/'
    },
    fonts: {
        src: 'markup/static/fonts/**/*.{woff,woff2,eot,ttf,otf}',
        dest: 'dev/static/fonts/'
    },
    misc: {
        src: 'markup/static/misc/**/*',
        dest: 'dev/'
    }
};

// Очистка папки dev
async function clean() {
    await fs.rm('dev', { recursive: true, force: true });
}

// Обработка HTML и подключение компонентов
async function html() {
    if (!prettier) {
        prettier = (await import('gulp-prettier')).default;
    }
    return gulp.src(paths.html.src)
        .pipe(replace(/\{\{\>\s*(.*?)\s*\}\}/g, (match, p1) => `@@include('../components/${p1}.html')`))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(prettier({ tabWidth: 4 })) // Форматирование с помощью Prettier
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}

// Обработка стилей
function styles() {
    return gulp.src([
        'markup/static/scss/fonts.scss',
        'markup/static/scss/vars.scss',
        'markup/static/scss/normalize.scss',
        'markup/static/scss/libraries/**/*.scss',
        'markup/static/scss/libraries/**/*.css',
        'markup/static/scss/plugins/**/*.scss',
        'markup/static/scss/plugins/**/*.css',
        'markup/static/scss/GUI.scss',
        'markup/components/**/*.scss',
        'markup/static/scss/common.scss'
    ])
    .pipe(sass().on('error', sass.logError)) // Компиляция SCSS в CSS
    .pipe(concat('main.css')) // Объединение всех CSS в один файл
    .pipe(gulp.dest(paths.styles.dest)) // Сохранение в папку назначения
    .pipe(browserSync.stream()); // Обновление стилей в браузере без перезагрузки всей страницы
}

// Обработка скриптов
function scripts() {
    return gulp.src([
        'markup/static/js/libraries/**/*.js',
        'markup/static/js/plugins/**/*.js',
        'markup/components/**/*.js',
        'markup/static/js/separate-js/app.js'
    ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

// Копирование изображений
function images() {
    return gulp.src(paths.images.src, { encoding: false })  // добавлена опция { encoding: false }
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream());
}

// Копирование шрифтов
function fonts() {
    return gulp.src(paths.fonts.src, { encoding: false })
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(browserSync.stream());
}

// Копирование различных файлов (например, favicon)
function misc() {
    return gulp.src(paths.misc.src, { encoding: false })
        .pipe(gulp.dest(paths.misc.dest))
        .pipe(browserSync.stream());
}

// Наблюдение за изменениями
function watch() {
    browserSync.init({
        server: {
            baseDir: './dev'
        }
    });
    gulp.watch(paths.html.src, html);
    gulp.watch('markup/components/**/*.html', html);  // Добавлено наблюдение за HTML компонентами
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch(paths.misc.src, misc);
}

// Задачи
const build = gulp.series(clean, gulp.parallel(html, styles, scripts, images, fonts, misc), watch);

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.misc = misc;
exports.watch = watch;
exports.build = build;
exports.default = build;
