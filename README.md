# Author
![@Rafase282](https://avatars0.githubusercontent.com/Rafase282?&s=128)

Created by Rafase282

[Github](https://github.com/Rafase282) | [FreeCodeCamp](http://www.freecodecamp.com/rafase282) | [CodePen](http://codepen.io/Rafase282/) | [LinkedIn](https://www.linkedin.com/in/rafase282) | [Blog/Site](https://rafase282.wordpress.com/) | [E-Mail](mailto:rafase282@gmail.com)

[![Gitter](https://badges.gitter.im/Rafase282/Mangadb.svg)](https://gitter.im/Rafase282/Mangadb?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Build Status](https://travis-ci.org/Rafase282/Mangadb.svg?branch=master)](https://travis-ci.org/Rafase282/Mangadb)
[![Dependency Status](https://david-dm.org/Rafase282/Mangadb.svg)](https://david-dm.org/Rafase282/Mangadb)
[![devDependency Status](https://david-dm.org/Rafase282/Mangadb/dev-status.svg)](https://david-dm.org/Rafase282/Mangadb#info=devDependencies)
[![bitHound Overall Score](https://www.bithound.io/github/Rafase282/Mangadb/badges/score.svg)](https://www.bithound.io/github/Rafase282/Mangadb)
[![bitHound Dependencies](https://www.bithound.io/github/Rafase282/Mangadb/badges/dependencies.svg)](https://www.bithound.io/github/Rafase282/Mangadb/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/Rafase282/Mangadb/badges/devDependencies.svg)](https://www.bithound.io/github/Rafase282/Mangadb/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/Rafase282/Mangadb/badges/code.svg)](https://www.bithound.io/github/Rafase282/Mangadb)
# Manga Record Microservice
This is an API created to store crucial information for any manga an authenticated user might read. Wtheer you want to keep track of the manga you will rea, already finished or are currently reading this microservice will help you get your data together. In the Future I intend on adding more features but meanwhile the user interface will be separated and this stays as the core backend.

There is an admin account that is declared onteh envarioment variables that basically has root access, it must be created and a secure password used. The admin can override any information if needed including passwords. In the future I will implement email services to mail queries, and particularly to allow for password reset if forgotten.

## What you can do:
1. Create a manga accessed at: **POST** `https://mangadb-r282.herokuapp.com/api/mangas/:user/title=Aiki&author=Isutoshi&url=http%3A%2F%2Fwww.readmanga.today%2Faiki&userStatus=reading&type=Japanese&categories=Action%2C+Ecchi%2C+Martial+Arts%2C+Mature%2C+Seinen&chapter=14&seriesStatus=Completed&plot=There+is+fighting+at+the+high+school+due+to+a+power+struggle+for+control.+The+granddaughter+of+the+chief+director+requests+help+from+the+Aikido+fighting+style+genius.+Will+he+help%3F+Or+will+he+show+his+true+colors+with+his+bad+boy+ways%3F`
2. Get the manga by title: **GET** `https://mangadb-r282.herokuapp.com/api/mangas/:user/:manga_title`
3. Update the manga with this title: **PUT** `https://mangadb-r282.herokuapp.com/api/mangas/:user/:manga_title`
4. Delete the manga by title: **DELETE** `https://mangadb-r282.herokuapp.com/api/mangas/:user/:manga_title`
5. Admin can get a list of all the mangas across the user base: **GET** `https://mangadb-r282.herokuapp.com/api/mangas`
6. Admin can get a list of all users: **GET** `https://mangadb-r282.herokuapp.com/api/users`
7. Admin can delete all users including itself, this requires the admin to be re-created: **DELETE** `https://mangadb-r282.herokuapp.com/api/mangas`
8. Admin can get a list of all the mangas across the user base: **GET** `https://mangadb-r282.herokuapp.com/api/mangas`

Remember to use `Content-Type: application/x-www-form-urlencoded`, the API will tell you what field are required in case you dont want to take a look at the schema.

## To Do:
- [X] Add thumbnail property to Mongoose Schema and make it work with current data.
- [X] Switch to JSON Web Tokens.
- [X] Validate E-mails.
- [ ] Verify E-mails.
- [ ] Implement password reset mechanism.
- [ ] Implement email support to send new passwords when a request for a forgotten password is made.
