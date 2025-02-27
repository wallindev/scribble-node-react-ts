import type { FC, JSX } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import type { ITextLink } from '../../types/general.types'

const TextLink: FC<ITextLink> = ({ className, to, children, style, ...props }): JSX.Element => {
  let classes = 'text-link visited:text-link hover:no-underline hover:text-link--hover'
  // className ? `${classNames} ${className}` : className

  return (
    <Link className={classNames(classes, className)} to={to} style={style} {...props}>
      {children}
    </Link>
  )
}

export default TextLink
