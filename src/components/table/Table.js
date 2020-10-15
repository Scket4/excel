import {ExcelComponent} from '@core/ExcelComponent';
import {$} from '@core/dom'
import {createTable} from './table.template';
import {resizeHandler} from './table.resize';
import {sholdResize, isCell, matrix, nextSelector} from './table.functions';
import {TableSelection} from './TableSelection';
import * as actions from '@/redux/actions'
import {defaultStyles} from '../../constants';
import {parse} from '../../core/parse';


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
    return createTable(20, this.store.getState())
  }

  prepare() {
    this.selection = new TableSelection()
  }

  init() {
    super .init()
    this.selectCell(this.$root.find('[data-id="0:0'))

    this.$on('Formula:input', val => {
      this.selection.current
      .attr('data-value', val)
      .text(parse(val))
      // this.selection.current.text(text)
      this.updateTextInStore(val)
    })

    this.$on('Formula:enter', () => {
      this.selection.current.focusCursor()
    })

    this.$on('toolbar:applyStyle', value => {
      this.selection.applyStyle(value)
      this.$dispatch(actions.applyStyle({
        value,
        ids: this.selection.selectedIds
      }))
    })
  }

  selectCell($cell) {
    this.selection.select($cell)
    this.$emit('table:select', $cell)
    const styles = $cell.getStyle(Object.keys(defaultStyles))
    console.log(styles);
    this.$dispatch(actions.changeStyles(styles))
  }

  async resizeTable(event) {
    try {
      const data = await resizeHandler(this.$root, event)
      this.$dispatch(actions.tableResize(data))
    } catch (e) {
      console.warn('resize Error', e.message);
    }
  }

  onMousedown(event) {
  if (sholdResize(event)) {
    this.resizeTable(event)
    } else if (isCell(event)) {
      const $target = $(event.target)
      if (event.shiftKey) {
        const target = $target.id(true)
        const current = this.selection.current.id(true)

        const $cells = matrix(target, current)
        .map(id => this.$root.find(`[data-id="${id}"]`))
        this.selection.selectGroup($cells)
      } else {
        this.selectCell($target)
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

  updateTextInStore(value) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value
    }))
  }

  onInput(event) {
    // this.$emit('table:text', $(event.target).text())
  this.updateTextInStore($(event.target).text())
  }
}

