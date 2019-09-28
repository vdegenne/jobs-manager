const Koa = require('koa')
const staticFiles = require('koa-static')
const router = require('koa-router')()
const koaBody = require('koa-body')
const staticCache = require('koa-static-cache')
const { writeFileSync, readFileSync } = require('fs')
const path = require('path')

const app = new Koa()
app.use(koaBody())
app.use(staticCache(path.join(__dirname, 'dist')))
router.get('/api/data', ctx => {
  let offers, enterprises, agences
  /* Offers */
  try {
    offers = JSON.parse(readFileSync('./data/offers.json').toString())
  } catch (e) {
    // file doesn't exist we create it
    offers = []
    writeFileSync('./data/offers.json', JSON.stringify(offers))
  }
  /* Enterprises */
  try {
    enterprises = JSON.parse(readFileSync('./data/enterprises.json').toString())
  } catch (e) {
    // file doesn't exist we create it
    enterprises = []
    writeFileSync('./data/enterprises.json', JSON.stringify(enterprises))
  }
  /* Agences */
  try {
    agences = JSON.parse(readFileSync('./data/agences.json').toString())
  } catch (e) {
    // file doesn't exist we create it
    agences = []
    writeFileSync('./data/agences.json', JSON.stringify(agences))
  }
  ctx.body = {
    offers,
    enterprises,
    agences
  }
})
router.put('/api/data', ctx => {
  for (const prop in ctx.request.body) {
    switch (prop) {
      case 'offers':
        writeFileSync('./data/offers.json', JSON.stringify(ctx.request.body[prop]))
        break
      case 'enterprises':
        // fs.writeFileSync(
        //   './data/enterprises.json',
        //   JSON.stringify(req.body[prop])
        // )
        break
      case 'agences':
        // fs.writeFileSync(
        //   './data/agences.json',
        //   JSON.stringify(req.body[prop])
        // )
        break
    }
  }
  ctx.body = ''
})
app.use(router.routes())

app.use(staticFiles('./dist')).listen(3010)

console.log('http://localhost:3010')
