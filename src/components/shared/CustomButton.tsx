import { Link } from 'react-router-dom'
import type { FC, JSX } from 'react'
import type { ICustomButton } from '../../types/form.types'
import { LINK_TRANSITION_DURATION } from '../../utils/constants'

const CustomButton: FC<ICustomButton> = ({ onClick, to, type = 'button', children, className, size = 'medium', ...props }): JSX.Element => {
  let classNamesButton = `transition-colors duration-${LINK_TRANSITION_DURATION} inline-block outline-0 bg-button-bg text-button-text border-0 rounded-sm cursor-pointer hover:bg-button-bg-hover focus-visible:bg-button-bg-hover`
  switch (size) {
    case 'small':
      classNamesButton = `${classNamesButton} leading-[1.2] p-1 px-2 text-xs`
      break;
    case 'medium':
      classNamesButton = `${classNamesButton} leading-[1.2] p-1.5 px-3`
      break;
    case 'large':
      classNamesButton = `${classNamesButton} leading-[1.2] py-2 px-4 text-lg`
      break;
    default:
  }
  let classNamesLink = `${classNamesButton} hover: no-underline visited: text-button-text`

  to ? classNamesLink = className ? `${classNamesLink} ${className}` : classNamesLink :
       classNamesButton = className ? `${classNamesButton} ${className}` : classNamesButton
  return to ? (
    <Link className={classNamesLink} to={to} {...props}>
      <span className="text-inherit select-none">{children}</span>
    </Link>
  ) : (
    <button className={classNamesButton} type={type} onClick={onClick} {...props}>
      <span className="text-inherit select-none">{children}</span>
    </button>
  )
}

export default CustomButton
