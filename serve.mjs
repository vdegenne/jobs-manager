import express from 'express'
import * as Job from './jobs.mjs'

const app = express()
app.use(express.static('.'))
app.use(express.json())

const execute = (req, res, fct) => {
  try {
    fct(req, res)
    res.end()
  } catch (e) {
    res.status(500).send(e.message)
  }
}

app.get('/api/jobs/:id', (req, res) => {
  execute(req, res, () => {
    const job = Job.getById(parseInt(req.params.id))
    if (!job) {
      res.status(404)
    } else {
      res.send(job)
    }
  })
})

app.post('/api/jobs', (req, res) => {
  execute(req, res, () => {
    const job = Job.add(req.body)
    res.send(job)
  })
})

app.put('/api/jobs/:id', (req, res) => {
  execute(req, res, () => {
    const job = Job.update(parseInt(req.params.id), res.body)
    res.send(job)
  })
})

app.delete('/api/jobs/:id', (req, res) => {
  execute(req, res, () => {
    const job = Job.remove(parseInt(req.params.id))
    res.send(job)
  })
})

app.listen(3010, () => {
  console.log(`http://localhost:3010/`)
})
