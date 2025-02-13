import { useState } from 'react'
import type { ChangeEvent, FC, FormEvent } from 'react'
import TextInput from './TextInput'
import CustomButton from './CustomButton'
import type { IAuthForm } from '../../types/form.types'

const AuthForm: FC<IAuthForm> = ({ formType, onSubmit }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    onSubmit(username, password)
  }

  const headline = `${formType.charAt(0).toUpperCase()}${formType.slice(1)}`

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl mb-4">{headline}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {formType === 'register' &&
        <>
          <div>
            <label htmlFor="firstName">First name:</label>
            <TextInput
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last name:</label>
            <TextInput
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            />
          </div>
        </>}
        <div>
          <label htmlFor="username">Username:</label>
          <TextInput
            id="username"
            type="text"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <TextInput
            id="password"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <CustomButton type="submit">{headline}</CustomButton>
    </form>
  )
}

export default AuthForm
