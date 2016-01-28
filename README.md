# Author
![@Rafase282](https://avatars0.githubusercontent.com/Rafase282?&s=128)

Created by Rafase282

[Github](https://github.com/Rafase282) | [FreeCodeCamp](http://www.freecodecamp.com/rafase282) | [CodePen](http://codepen.io/Rafase282/) | [LinkedIn](https://www.linkedin.com/in/rafase282) | [Blog/Site](https://rafase282.wordpress.com/) | [E-Mail](mailto:rafase282@gmail.com)

# Manga Record Microservice

This is a RESTful API that connects to a database that keeps a record of the manga that I read, finished or will read in the near future, so I don't have to bother remembering or looking for where I wrote down teh information.

## What you can do:

1. Create a manga (accessed at POST https://mangadb-r282.herokuapp.com/api/mangas/title=Aiki&author=Isutoshi&url=http%3A%2F%2Fwww.readmanga.today%2Faiki&userStatus=reading&type=Japanese&categories=Action%2C+Ecchi%2C+Martial+Arts%2C+Mature%2C+Seinen&chapter=14&seriesStatus=Completed&plot=There+is+fighting+at+the+high+school+due+to+a+power+struggle+for+control.+The+granddaughter+of+the+chief+director+requests+help+from+the+Aikido+fighting+style+genius.+Will+he+help%3F+Or+will+he+show+his+true+colors+with+his+bad+boy+ways%3F)
2. Get the manga by title (accessed at GET https://mangadb-r282.herokuapp.com/api/mangas/:manga_title)
3. Update the manga by title (accessed at PUT https://mangadb-r282.herokuapp.com/api/mangas/:manga_title)
4. Delete the manga by title (accessed at DELETE https://mangadb-r282.herokuapp.com/api/mangas/:manga_title)
5. Get all the mangas (accessed at GET https://mangadb-r282.herokuapp.com/api/mangas)

Keep in mine that for creating and updating all fileds are required.
Also `Content-Type: application/x-www-form-urlencoded`

## Schema:

```js
{
  title: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
    match: /[a-z]/
  },
  author: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/
  },
  url: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
    match: /[a-z]/
  },
  userStatus: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/
  },
  type: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/
  },
  categories: [{
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/
  }],
  chapter: {
    type: Number,
    required: true,
    unique: false,
    min: 0
  },
  seriesStatus: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/
  },
  plot: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: false,
    match: /[a-z]/
  }
}
```
