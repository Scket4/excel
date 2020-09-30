import {ExcelComponent} from '@core/ExcelComponent';
import {$} from '@core/dom'
import {createTable} from './table.template';
import {resizeHandler} from './table.resize';
import {sholdResize, isCell, matrix, nextSelector} from './table.functions';
import {TableSelection} from './TableSelection';
// import {range} from '../../core/utils';


export class Table extends ExcelComponent {
  static className = 'excel__table'


  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
     ...options
  })
  }

  toHTML() {
    return createTable(20)
  }

  prepare() {
    this.selection = new TableSelection()
  }

  init() {
    super .init()
    this.selectCell(this.$root.find('[data-id="0:0'))

    this.$on('Formula:input', text => {
      this.selection.current.text(text)
    })

    this.$on('Formula:enter', () => {
      this.selection.current.focusCursor()
    })
  }

  selectCell($cell) {
    this.selection.select($cell)
    this.$emit('table:select', $cell)
  }

  onMousedown(event) {
  if (sholdResize(event)) {
    resizeHandler(this.$root, event)
    } else if (isCell(event)) {
      const $target = $(event.target)
      if (event.shiftKey) {
        const target = $target.id(true)
        const current = this.selection.current.id(true)

        const $cells = matrix(target, current)
        .map(id => this.$root.find(`[data-id="${id}"]`))
        this.selection.selectGroup($cells)
      } else {
        this.selection.select($target)
      }
    }
    const text = this.selection.current.text()
    this.$emit('CurrentCell', text)
  }
  onKeydown(event) {
    const keys = ['Enter', 'Tab',
    'ArrowLeft', 'ArrowRight',
    'ArrowDown', 'ArrowUp']

    const {key} = event

    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault() // Отменяем действие по умолччанию
      const id = this.selection.current.id(true)
      const $next = this.$root.find(nextSelector(key, id))
      this.selectCell($next)
    }
  }

  onInput(event) {
    this.$emit('table:text', $(event.target).text())
  }
}

