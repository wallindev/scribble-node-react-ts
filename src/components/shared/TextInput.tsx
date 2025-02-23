import type { FC, JSX } from 'react'
import type { ITextInput } from '../../types/form.types'

const TextInput: FC<ITextInput> = ({ className, id, type, value, disabled, ...props }): JSX.Element => {
  let classNames = 'border-0 outline-0 rounded-sm'
  classNames = className ? `${classNames} ${className}` : classNames

  return (
    <input className={classNames} id={id} type={type} value={value} disabled={disabled} {...props} />
  )
}

export default TextInput
