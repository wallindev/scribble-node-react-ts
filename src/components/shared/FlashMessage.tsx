import type { FC, JSX } from 'react'
import CustomButton from './CustomButton'
import type { IFlashMessage } from '../../types/general.types'

const FlashMessage: FC<IFlashMessage> = ({ message, type, onDismiss }): JSX.Element => {
  const colors: { [key: string]: string } = {
    success: 'bg-green-700',
    info: 'bg-blue-700',
    warning: 'bg-yellow-700',
    error: 'bg-red-700'
  }
  return (
    <div className={`flex justify-between items-center rounded-sm p-1 mb-4 ${colors[type]}`}>
      <div className="text-gray-100 text-sm" dangerouslySetInnerHTML={{ __html: message }} />
      <CustomButton onClick={onDismiss} size="small">×</CustomButton>
    </div>
  )
}

export default FlashMessage
