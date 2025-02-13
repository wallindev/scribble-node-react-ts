import { Link } from 'react-router-dom'
import type { FC } from 'react'
import type { ILinkButton } from '../../types/form.types'

const LinkButton: FC<ILinkButton> = ({ className, to, children, ...props }) => {
  return (
    <Link className={className} to={to} {...props}>
      {children}
    </Link>
  )
}

export default LinkButton
