import { FC } from 'react'
import styled from 'styled-components'

// Define the styled component with TypeScript
const StyledFormButton = styled.button`
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

// Define the props interface for the FormButton component
interface FormButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement> // Correct type for onClick
  children?: React.ReactNode
  style?: React.CSSProperties
  type?: 'button' | 'submit' | 'reset'; // Add type prop for button functionality
  [key: string]: any // Index signature for other HTML attributes
}

// Create the FormButton component with TypeScript
const FormButton: FC<FormButtonProps> = ({ onClick, children, style, type = 'button', ...props }) => {
  return (
    <StyledFormButton onClick={onClick} style={style} type={type} {...props}>
      {children}
    </StyledFormButton>
  )
}

export default FormButton