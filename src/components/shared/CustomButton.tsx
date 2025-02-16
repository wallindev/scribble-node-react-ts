import { Link } from 'react-router-dom'
import type { FC, JSX } from 'react'
import type { ICustomButton } from '../../types/form.types'

const CustomButton: FC<ICustomButton> = ({ onClick, to, type, children, className, size = 'large', ...props }): JSX.Element => {
  let classNamesButton = 'inline-block bg-button-bg text-button-text border-0 rounded-sm [&:hover,&:active,&:focus]:bg-button-bg--hover outline-0 cursor-pointer transition-colors duration-300'
  classNamesButton = size === 'large' ? `${classNamesButton} py-1 px-4` : `${classNamesButton} p-1 text-xs`
  let classNamesLink = `${classNamesButton} hover: no-underline [&:visited,&:hover]:text-button-text`
  // class="pointer-events-none select-none"
  to ?
    classNamesLink = className ? `${classNamesLink} ${className}` : classNamesLink
  :
    classNamesButton = className ? `${classNamesButton} ${className}` : classNamesButton

  return to ? (
    <Link className={classNamesLink} to={to} {...props}>
      <span className="text-inherit pointer-events-none">{children}</span>
    </Link>
  ) : (
    <button className={classNamesButton} type={type} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default CustomButton
