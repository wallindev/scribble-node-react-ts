import type { FC, JSX } from 'react'
import { Link } from 'react-router-dom'
import type { ITextLink } from '../../types/general.types'

const TextLink: FC<ITextLink> = ({ className, to, children, style, ...props }): JSX.Element => {
  let classNames = 'text-text visited:text-text hover:no-underline hover:text-text--hover'
  className ? `${classNames} ${className}` : className

  return (
    <Link className={classNames} to={to} style={style} {...props}>
      {children}
    </Link>
  )
}

export default TextLink
