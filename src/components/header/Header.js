import {ExcelComponent} from '@core/ExcelComponent'
import {$} from '@core/dom'
import {changeTitle} from '../../redux/actions'
import {defaultTitle} from '../../constants'
import {ActiveRoute} from '../../core/router/ActiveRoute'

export class Header extends ExcelComponent {
  static className = 'excel__header'

  constructor($root, options) {
    super($root, {
      name: 'Header',
      listeners: ['input', 'click'],
     ...options

    })
  }

  onClick(event) {
    const $target = $(event.target)
    if ($target.data.type === 'delete') {
      const decision = confirm('Вы хотите удалить эту таблицу?')
      if (decision) {
        localStorage.removeItem('excel: ' + ActiveRoute.param)
        ActiveRoute.navigate('')
      }
    } else if ($target.data.type === 'exit') {
      ActiveRoute.navigate('')
    }
  }

  onInput(event) {
    const $target = $(event.target)
    this.$dispatch(changeTitle($target.text()))
  }

    toHTML() {
      const title = this.store.getState().title || defaultTitle
      return `
      <input type="text" value="${title}" class="input">
      <div class="icons">
        <div class="button">
          <i class="material-icons" data-type= "delete">delete</i>
        </div>  
        <div class="button">
          <i class="material-icons" data-type='exit' >exit_to_app</i>
        </div>     
      </div>`
  }
}