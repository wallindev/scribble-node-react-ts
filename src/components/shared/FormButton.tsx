import type { FC } from 'react'
import type { IFormButton } from '../../types/form.types'

const FormButton: FC<IFormButton> = ({ className, onClick, children, type = 'button', ...props }) => {
  return (
    <button className={className} onClick={onClick} type={type} {...props}>
      {children}
    </button>
  )
}

export default FormButton
