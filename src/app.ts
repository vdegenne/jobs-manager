import { LitElement, html, customElement, property, query } from 'lit-element'
import '@material/mwc-tab-bar'
import '@material/mwc-button'
import '@material/mwc-icon'
import '@material/mwc-dialog'
import '@material/mwc-textfield'
import '@material/mwc-snackbar'
import '@material/mwc-textarea'
import '@material/mwc-formfield'
import '@material/mwc-checkbox'
import { Dialog } from '@material/mwc-dialog'
import { Snackbar } from '@material/mwc-snackbar'

@customElement('job-app')
class JobApp extends LitElement {
  @property({ type: Object })
  data: any = {}

  @property({ type: String })
  interfaceFilter = 'offers'

  @property({ type: Boolean })
  showUnactive = false

  @property({ type: String })
  offersSearch = ''

  @query('#offersDialog')
  offersDialog!: Dialog

  @query('#snackbar')
  snackbar!: Snackbar

  constructor() {
    super()

    this.fetchData().then(json => {
      this.data = json
    })
  }

  async fetchData() {
    const response = await fetch('/api/data')
    return await response.json()
  }

  render() {
    return html`
    <style>
      #content {
        max-width: 500px;
        margin: 0 auto;
      }
      mwc-textfield, mwc-textarea {
        display: block;
        margin: 5px 0;
      }
      mwc-dialog, mwc-button, mwc-tab-bar {
        --mdc-theme-primary: black;
      }

      .search-topbar {
        width: 100%;
        padding: 8px;
        margin: 10px 0;
      }
    </style>
    <div id=content>
      <mwc-tab-bar @MDCTabBar:activated="${e => (this.interfaceFilter = e.path[0]._getTab(e.detail.index).label)}">
        <mwc-tab label=offers></mwc-tab>
        <mwc-tab label=enterprises></mwc-tab>
        <mwc-tab label=agences></mwc-tab>
      </mwc-tab-bar>

      ${this.interfaceFilter === 'offers' ? this.offersTemplate() : null}
      ${this.interfaceFilter === 'enterprises' ? this.enterprisesTemplate() : null}
      ${this.interfaceFilter === 'agences' ? this.agencesTemplate() : null}
    </div>

    <mwc-snackbar id=snackbar leading></mwc-snackbar>
    `
  }

  offersTemplate() {
    let dialogType: string
    let dialog: Dialog
    let form: HTMLElement
    let offerToUpdate: Object

    const onOffersDialogClose = (e: CustomEvent) => {
      if (e.detail.action === 'accept') {
        const values = this.serializeForm(form)
        switch (dialogType) {
          case 'create':
            const id = this.data.offers.map(o => o.id).sort((a, b) => a - b).pop() + 1 || 0
            this.data.offers.push({
              id,
              ...values,
              active: true
            })
            break
          case 'update':
            Object.assign(offerToUpdate, values)
            break
        }
        this.saveData()
        this.requestUpdate()
      }
    }

    this.updateComplete.then(_ => {
      dialog = this.offersDialog
      // @ts-ignore
      form = dialog.querySelector('#form')
    })

    return html`
    <style>
      .offer-frame {
        background: #eeeeee;
        margin: 6px 0;
        padding: 8px;
        position: relative;
        border-radius: 3px;
      }
      .offer-frame:not([active]) {
        opacity: .4;
      }
      .offer-frame > .id {
        position: absolute;
        top: 8px;
        right: 8px;
        color: transparent;
      }
    </style>

    <input type=search class=search-topbar @keyup=${e => (this.offersSearch = e.path[0].value)} value=${this.offersSearch || ''}>
    <!-- hide unactive toggler -->
    <mwc-formfield label="show unactive">
      <mwc-checkbox @change=${e => console.log(e)}></mwc-checkbox>
    </mwc-formfield>

    ${this.data && this.data.offers &&
      this.data.offers.map(offer => {
        /* search */
        if (this.offersSearch) {
          if (!['title', 'description', 'link', 'location', 'progress'].some(prop => offer[prop] && offer[prop].indexOf(this.offersSearch) >= 0)) {
            return null
          }
        }

        // hide if the offer is not active and this.showUnactive is set on true
        if (!offer.active && !this.showUnactive) {
          return null
        }
        const onUpdateClick = () => {
          dialogType = 'update'
          offerToUpdate = offer
          this.fillInForm(form, offer)
          dialog.open = true
        }
        return html`
        <div class=offer-frame ?active=${offer.active}>
          <div class="id">#${offer.id}</div>
          <!-- add toggler for the active property here -->
          <div>${offer.title}</div>
          <mwc-icon @click=${onUpdateClick}>edit</mwc-icon>
        </div>`
      })}

    <div style="text-align:center">
      <mwc-button unelevated dense icon="add" @click="${_ => {
        dialogType = 'create'
        dialog.open = true
      }}">add offer</mwc-button>
    </div>
    <mwc-dialog title="Add Offer" @closed=${onOffersDialogClose} id=offersDialog>
      <form id=form>
        <mwc-textfield label="title" name=title dialogInitialFocus outlined></mwc-textfield>
        <mwc-textarea label=description name=description @keydown=${e => e.stopPropagation()} outlined></mwc-textarea>
        <mwc-textfield label=link name=link outlined></mwc-textfield>
        <mwc-textfield label=location name=location label-always-on-top outlined></mwc-textfield>
        <mwc-textarea label=progress name=progress @keydown=${e => e.stopPropagation()} outlined></mwc-textarea>
      </form>
      <mwc-button slot=secondaryAction dense dialogAction=close>Cancel</mwc-button>
      <mwc-button slot=primaryAction unelevated dense dialogAction=accept>ok</mwc-button>
    </mwc-dialog>
    `
  }

  async saveData() {
    try {
      const response = await fetch('/api/data', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(this.data)
      })
      if (response.status === 200) {
        this.snackbar.labelText = 'data saved'
        this.snackbar.open()
      }
    } catch (e) {
      alert('something bad happened')
    }
  }

  // $(selector) {
  //   const el = this.shadowRoot.getElementById(selector)
  //   el.querySelectorAll('[id]').forEach(c => (el[c.id] = c))
  //   return el
  // }

  serializeForm(form) {
    const values = {}
    let value
    for (const input of form.querySelectorAll('[name]')) {
      value = input.value
      if (input.type === 'number') {
        value = parseFloat(value)
      }
      values[input.getAttribute('name')] = value
    }
    return values
  }

  fillInForm(form, values) {
    let element
    for (const prop in values) {
      if ((element = form.querySelector(`[name=${prop}]`))) {
        element.value = values[prop]
      }
    }
  }

  enterprisesTemplate() {
    // to implement
    return null
  }

  agencesTemplate() {
    // to implement
    return null
  }
}
