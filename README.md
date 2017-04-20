# Author

![@Rafase282](https://avatars0.githubusercontent.com/Rafase282?&s=128)

Created by Rafase282

[Github](https://github.com/Rafase282) | [FreeCodeCamp](http://www.freecodecamp.com/rafase282) | [CodePen](http://codepen.io/Rafase282/) | [LinkedIn](https://www.linkedin.com/in/rafase282) | [Portfolio](https://rafase282.github.io/) | [E-Mail](mailto:rafase282@gmail.com)

[![Gitter](https://badges.gitter.im/Rafase282/Mangadb.svg)](https://gitter.im/Rafase282/Mangadb?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) [![Build Status](https://travis-ci.org/Rafase282/Mangadb.svg?branch=master)](https://travis-ci.org/Rafase282/Mangadb) [![Dependency Status](https://david-dm.org/Rafase282/Mangadb.svg)](https://david-dm.org/Rafase282/Mangadb) [![devDependency Status](https://david-dm.org/Rafase282/Mangadb/dev-status.svg)](https://david-dm.org/Rafase282/Mangadb#info=devDependencies) [![bitHound Overall Score](https://www.bithound.io/github/Rafase282/Mangadb/badges/score.svg)](https://www.bithound.io/github/Rafase282/Mangadb) [![bitHound Dependencies](https://www.bithound.io/github/Rafase282/Mangadb/badges/dependencies.svg)](https://www.bithound.io/github/Rafase282/Mangadb/master/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/Rafase282/Mangadb/badges/devDependencies.svg)](https://www.bithound.io/github/Rafase282/Mangadb/master/dependencies/npm) [![bitHound Code](https://www.bithound.io/github/Rafase282/Mangadb/badges/code.svg)](https://www.bithound.io/github/Rafase282/Mangadb) [![Code Climate](https://codeclimate.com/github/Rafase282/Mangadb/badges/gpa.svg)](https://codeclimate.com/github/Rafase282/Mangadb) [![Issue Count](https://codeclimate.com/github/Rafase282/Mangadb/badges/issue_count.svg)](https://codeclimate.com/github/Rafase282/Mangadb)

# MangaDB Microservice

This is an API created to store crucial information for any manga an authenticated user might read. Wether you want to keep track of the manga you will read, already finished or are currently reading, this microservice will help you get your data together.

In the Future I intend on adding more features but meanwhile the user interface will be separated and this stays as the core backend.

There is an admin account that is declared on the envarioment variables that basically has full access, it must be created and a secure password used. The admin can override any information if needed including passwords. In the future I will implement email services to mail queries, and particularly to allow for password reset if forgotten.

## Setup:

To get started just follow these steps.

1. `git clone https://github.com/Rafase282/Mangadb.git`
2. `cd Mangadb && npm install`
3. Open a new console to run mongo. `sudo service mongod start` for Ubuntu users.
4. Still on the same directory, find `default-env` and rename it to `.env`.
5. Fill in the variables from the file with the data you want.

If you need help generating the Gmail credentials read this [article](https://github.com/Rafase282/Mangadb/wiki/Generate-OAthu-Credentials-for-email).

## Lint, Test, Run:

- If you want to lint just run `npm run lint`.
- If you want test and ensure everythign works, then `npm run test`.<br>
  It will test all routes. The test are independent of eachother.
- To run the application use `npm start`.

## Documentation and links:

- The [API documentation](http://localhost:3000/) can be found on the root route when you run the app.
- You can find the current client [here.](https://manga-client.herokuapp.com/)
- [Project Status.](https://github.com/Rafase282/Mangadb/projects/1)

## Contributing:

If you want to contribute to the project, feel free to pick any of the open issues and work on them in a new branch and submit a pull request.

## Support:

If you have any questions not related to any of the open issues, then you can reach me in my [![Gitter](https://badges.gitter.im/Rafase282/Mangadb.svg)](https://gitter.im/Rafase282/Mangadb?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or via any of my public contact information.

If you like the project, please start it to receive updates and help make it more noticeable.

#### If you would like to help out with financial support, you are welcome to do so via [paypal.me/rafase282](paypal.me/rafase282).

I'm currently looking to get my career started so any amount helps. If you would like to hire me for a position or work on a project then you may also contact me about that.
