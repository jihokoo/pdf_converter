## PDF to Thumbnail Converter

####Instructions:

- install npm dependencies `npm install`
- test server `npm test` (script will create folders that we need)
- start server `npm start` (script will create folders that we need)

####NPM Dependencies:

- hapi
- joi
- code
- lab
- aws-sdk
- mongoose (make sure mongo is installed and running)
- handlebars

####Command Line Tools:

- imageMagick (`brew install imagemagick`)
- ghostscript (`brew install ghostscript`)
- grep

####Thumbnail:

- Thumbnail Controller (getAll, create, viewThumbnail)
- Thumbnail Model (name, url, imageUrl)
- Routes (GET: /thumbs, GET: /thumbs/{fileName}, CREATE: /thumbs)

####Index:

- Index Controller (render)
- Routes (GET: /)
