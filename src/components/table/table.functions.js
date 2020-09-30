import {range} from '../../core/utils'

export function sholdResize(event) {
  return event.target.dataset.resize
}

export function isCell(event) {
  return event.target.dataset.type === 'cell'
}

export function matrix(target, current) {
  const cols = range(current.col, target.col)
  const rows = range(current.row, target.row)

  return cols.reduce((acc, col) => {
    rows.forEach(row => acc.push(`${row}:${col}`))
    return acc
  }, [])
}


export function nextSelector(key, {row, col}) {
  const minValue = 0;
  switch (key) {
    case 'ArrowUp':
      row = row - 1 < minValue ? minValue : row -1
      break
    case 'ArrowDown':
    case 'Enter':
      row++
      break
    case 'ArrowRight':
    case 'Tab':
      col++
      break
    case 'ArrowLeft':
      col = col - 1 < minValue ? minValue : col - 1
  }
    return `[data-id="${row}:${col}"]`
}