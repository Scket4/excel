import {ExcelComponent} from '@core/ExcelComponent';
import {$} from '@core/dom'


export class Formula extends ExcelComponent {
  static className = 'excel__formula'

  constructor($root, options) {
    super($root, {
      name: 'Formula',
      listeners: ['input', 'keydown'],
     ...options
  })
  }

  init() {
    super.init()

    this.$formula = this.$root.find('#formula')
    this.$on('table:select', $cell => {
      this.$formula.text($cell.text())
    })

    this.$on('CurrentCell', text => {
      this.$formula.text(text)
    })
    this.$on('table:text', text => {
      this.$formula.text(text)
    })
  }
  // this.$on('currentCell', )

  toHTML() {
    return `
    <div class="formula__info">fx</div>
        <div class="formula__input" id='formula' 
        contenteditable spellcheck="false"></div>`
  }
  onInput(event) {
    this.$emit('Formula:input', $(event.target).text())
  }

  onKeydown(event) {
    const keys = ['Enter', 'Tab']
    if (keys.includes(event.key)) {
    event.preventDefault()
    this.$emit('Formula:enter', '')
    }
  }
}