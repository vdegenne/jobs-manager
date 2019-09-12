import fs from 'fs'
import jobs from './jobs.json'

export { jobs }

/* constants */
// true or false : is required or not
const jobs_properties = {
  type: true,
  subtype: true,
  title: true,
  description: false,
  offerlink: false,
  offerplace: false,
  offerphone: false,
  agencename: true,
  agencelink: true,
  agencephone: true,
  progress: false,
  active: true
}

/* helpers */
const getLastId = () => jobs.map(j => j.id).sort((a, b) => a - b).pop()
const save = () => fs.writeFileSync('./jobs.json', JSON.stringify(jobs))
export const getById = id => {
  const job = jobs.filter(j => j.id === id)[0]
  if (!job) {
    throw new Error(`hte job of id ${id} doesn't exist`)
  }
  return job
}

/**
 * Main functions
 */
export const add = object => {
  for (const prop of Object.entries(jobs_properties).filter(p => p[1]).map(p => p[0])) {
    if (!(prop in object)) {
      throw new Error(`missing argument ${prop}`)
    }
  }

  // constrains the properties
  const temp = (jobjob = { id: getLastId() + 1 })
  for (const prop in jobs_properties) {
    if (prop in temp) {
      job[prop] = temp[prop]
    }
  }

  jobs.push(job)
  save()
  return job
}

export const update = (id, object) => {
  const job = getById(id)
  for (const prop in object) {
    if (prop in jobs_properties) {
      job[prop] = object[prop]
    }
  }
  save()
  return job
}

export const remove = id => {
  const i = jobs.findIndex(j => j.id === id)
  if (i >= 0) {
    const job = jobs.splice(i, 1)
    save()
    return job
  }

  throw new Error(`the job of index ${id} doesn't exist`)
}
