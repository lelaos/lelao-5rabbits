const express = require('express')
const phantom = require('phantom')
const parameterize = require('parameterize')
const sharp = require('sharp')
const fs = require('fs-extra')

const PORT = process.env.PORT || 8080
const app = express()

const generateUrlThumbnail = (req, fileName, callback) => {
  const tempFileName = `public/thumbnails/${parameterize(req.query.url)}-temp.png`
  const width = parseInt(req.query.width) || 1920
  const height = parseInt(req.query.height) || 1080
  const imageWidth = parseInt(req.query.image_width) || width
  const imageHeight = parseInt(req.query.image_height) || height
  let instance
  let page

  phantom.create()
    .then(_instance => {
      instance = _instance

      return instance.createPage()
    })
    .then(_page => {
      page = _page

      page.property('viewportSize', {
        width,
        height
      })

      page.property('clipRect', {
        top: 0,
        left: 0,
        width,
        height
      })

      return page.open(req.query.url)
    })
    .then(() => {
      return page.render(tempFileName)
    })
    .then(() => {
      if (imageWidth !== width || imageHeight !== height) {
        sharp(tempFileName)
          .resize(imageWidth, null)
          .toFile(fileName)
          .then(() => {
            fs.unlink(tempFileName)

            callback()
          })
      }
      else {
        fs.rename(tempFileName, fileName, callback)
      }
    })
}

app.use(express.static('dist'))
app.use(express.static('public'))

app.get('/api/thumbnail', (req, res) => {
  const fileName = `public/thumbnails/${parameterize(req.query.url)}.png`
  const publicUrl = `/thumbnails/${parameterize(req.query.url)}.png`

  fs.access(fileName, fs.constants.F_OK, err => {
    if (err) {
      generateUrlThumbnail(req, fileName, () => {
        res.send({
          url: publicUrl
        })
      })
    }
    else {
      res.send({
        url: publicUrl
      })
    }
  })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
