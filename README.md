## PDF to Thumbnail Converter

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
