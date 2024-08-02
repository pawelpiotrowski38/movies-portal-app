# Movies Portal App

## Table of contents

- [Description](#description)
- [Features](#features)
- [Built With](#built-with)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)

## Description

This web application is a platform designed to provide users with access to a database of movies. Users have the option to browse the content as guests or register and log in to gain access to additional features such as ratings and comments. It aims to provide a straightforward and user-friendly experience for users, allowing them to explore and evaluate a diverse range of movies.

## Features

All users are able to:
- register an account and log in
- filter movies based on genres, countries of origin and release year
- sort movies by title and rating
- switch theme between dark and light

Logged in users additionally are able to:
- add, edit and remove movie ratings
- add and remove a movie from user's watchlist
- add, edit and remove movie comments
- add and remove a like from movie comments

## Built With

- [React.js](https://react.dev/) - JavaScript library for building user interfaces, providing a fast and efficient way to create interactive components and manage state in web applications.
- [SCSS](https://sass-lang.com/) - CSS preprocessor that adds functionality such as variables, mixins, and nesting to standard CSS syntax, allowing for more efficient and maintainable styling code.
- [Node.js](https://nodejs.org/en) - Server-side JavaScript runtime environment that enables developers to build scalable and high-performance applications.
- [Express.js](https://expressjs.com/) - Web application framework for Node.js, designed to simplify the process of building web servers and APIs.
- [PostgreSQL](https://www.postgresql.org/) - Powerful open-source relational database management system known for its reliability, extensibility, and compliance with SQL standards.

## API Endpoints

### Auth

| Method | Path | Purpose |
| --- | --- | --- |
| POST | /api/auth | Log in a user |
| POST | /api/auth/tokens | Refresh tokens |
| DELETE | /api/auth | Log out a user |

### Users

| Method | Path | Purpose |
| --- | --- | --- |
| GET | /api/users | Get logged in user's data |
| POST | /api/users | Register a new user |

### Movies

| Method | Path | Purpose |
| --- | --- | --- |
| GET | /api/movies | Get all movies |
| GET | /api/movies/:movieId | Get a particular movie |
| GET | /api/movies/:movieId/comments | Get a particular movie's comments |
| POST | /api/movies/ratings | Rate a particular movie |
| PATCH | /api/movies/:movieId/ratings | Edit rating of a particular movie |
| DELETE | /api/movies/:movieId/ratings | Delete rating of a particular movie |
| POST | /api/movies/watchlist | Add a particular movie to a watchlist |
| DELETE | /api/movies/:movieId/watchlist | Remove a particular movie from a watchlsit |

### Comments

| Method | Path | Purpose |
| --- | --- | --- |
| POST | /api/comments | Add a comment |
| PATCH | /api/comments/:commentId | Edit a comment |
| DELETE | /api/comments/:commentId | Delete a comment |
| POST | /api/comments/likes | Like a comment |
| DELETE | /api/comments/:commentId/likes | Delete a like from a comment |

## Screenshots

### Movies list
![movies-list-screenshot](/assets/screenshots/movies-portal-app-movies-list.png?raw=true)

### Movie details
![movie-details-screenshot](/assets/screenshots/movies-portal-app-movie-details.png?raw=true)

### Movie comments
![movie-details-comments-screenshot](/assets/screenshots/movies-portal-app-movie-details-comments.png?raw=true)

### Movies list (light theme)
![movies-list-light-screenshot](/assets/screenshots/movies-portal-app-movies-list-light.png?raw=true)
