#!/usr/bin/node --experimental-modules

import prompts from 'prompts'
import fs from 'fs'
import _jobs from './data.json'

const onCancel = () => {
  process.exit(0)
}
;(async () => {
  const action = (await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'action',
      choices: [
        { title: 'add', value: 'add' },
        { title: 'jobs', value: 'jobs' }
      ]
    },
    { onCancel }
  )).action

  switch (action) {
    case 'add':
      /* Ceci ne doit pas être réduit à une simple offre de job,
       * cet objet peut-être utilisé pour enregistrer des informations
       * à propos d'une entreprise ou d'une idée.
       */
      const object = await prompts(
        [
          {
            type: 'select',
            name: 'type',
            message: 'type',
            choices: [
              { title: 'job offer', value: 'joboffer' },
              { title: 'enterprise information', value: 'enterprise' },
              { title: 'idea', value: 'idea' }
            ]
          },
          {
            type: 'select',
            name: 'subtype',
            message: 'sub type',
            choices: [
              { title: 'informatique', value: 'informatique' },
              { title: 'manuel', value: 'manuel' }
            ]
          },
          {
            type: 'text',
            name: 'title',
            message: 'title',
            validate: a => a.length
          },
          { type: 'text', name: 'description', message: 'description' },
          { type: 'text', name: 'offerlink', message: 'offer link' },
          { type: 'text', name: 'offerplace', message: 'offer place' },
          { type: 'text', name: 'agencename', message: 'agence name' },
          { type: 'text', name: 'agencelink', message: 'agencelink' },
          { type: 'text', name: 'phone', message: 'phone number' },
          { type: 'text', name: 'progress', message: 'progress' }
        ],
        { onCancel }
      )
      object.active = true
      _jobs.push(object)
      savejobs()
      break
    case 'jobs':
      const job = (await prompts({
        type: 'select',
        name: 'job',
        message: 'job',
        choices: _jobs.map(j => j.title)
      })).job
      break
  }
})()

const savejobs = () => {
  fs.writeFileSync('data.json', JSON.stringify(_jobs, null, 2))
}
