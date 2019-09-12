import { LitElement, html } from 'lit-element'

class JobApp extends LitElement {
  static get properties() {
    return {
      _jobs: { type: Array }
    }
  }

  render() {
    return html`${this._jobs.map(j => html`${j.title}<br>`)}`
  }

  constructor() {
    super()
    fetch('/jobs.json').then(async response => {
      this._jobs = await response.json()
    })
  }
}

customElements.define('job-app', JobApp)
