import { Link } from 'react-router-dom'
import type { FC, JSX } from 'react'
import type { ICustomButton } from '../../types/form.types'

const CustomButton: FC<ICustomButton> = ({ onClick, to, type, children, className, size = 'medium', ...props }): JSX.Element => {

  // console.log('css classes from start:', className)

  let classNamesButton = `inline-block outline-0 bg-button-bg text-button-text border-0 rounded-sm cursor-pointer transition-colors duration-300`
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

  // class="pointer-events-none select-none text-button-text"

  let classNamesLink = `${classNamesButton} hover: no-underline visited: text-button-text`
  to ? classNamesLink = className ? `${classNamesLink} ${className}` : classNamesLink :
       classNamesButton = className ? `${classNamesButton} ${className}` : classNamesButton
  // TODO: pointer-events-none or select-none below?
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
