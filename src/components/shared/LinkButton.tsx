import { FC } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

// Define the styled component with TypeScript
const StyledLinkButton = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:visited {
    color: white;
  }

  &:hover {
    background-color: #0056b3;
    color: white;
  }
`

// Define the props interface for the LinkButton component
interface LinkButtonProps {
  to: string
  children?: React.ReactNode    // Make children optional
  style?: React.CSSProperties   // Allow inline styles
  [key: string]: any            // Allow other HTML attributes
}

// Create the LinkButton component with TypeScript
const LinkButton: FC<LinkButtonProps> = ({ to, children, style, ...props }) => {
  return (
    <StyledLinkButton to={to} style={style} {...props}>
      {children}
    </StyledLinkButton>
  )
}

export default LinkButton