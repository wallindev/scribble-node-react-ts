import type { FC, JSX } from 'react'
import type { ITextInput } from '../../types/form.types'

const TextInput: FC<ITextInput> = ({ className, id, type, value, ...props }): JSX.Element => {
  let classNames = 'p-1 bg-input-bg text-input-text w-full sm:w-4/5 border-0 outline-0 rounded-sm'
  className ? `${classNames} ${className}` : className

  return (
    <input className={classNames} id={id} type={type} value={value} {...props} />
  )
}

export default TextInput
