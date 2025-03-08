import { useEffect, useRef } from 'react'
import type { FC, JSX } from 'react'
import CustomButton from './CustomButton'
import type { IFlashMessage } from '../../types/general.types'

const FlashMessage: FC<IFlashMessage> = ({ message, type, onDismiss }): JSX.Element => {
  const divRef = useRef<HTMLDivElement>(null)

  // Fade-in-fade-out effect on route change (together with CSS transition)
  useEffect(() => {
    // setIsVisible(false)
    const opacityTimer = setTimeout(() => {
      // setIsVisible(true)
      (divRef.current as HTMLDivElement)?.classList?.replace('opacity-0', 'opacity-100')
    }, 1)

    return () => clearTimeout(opacityTimer)
  }, [])

  const colors: { [key: string]: string } = {
    success: 'bg-green-700',
    info: 'bg-blue-700',
    warning: 'bg-yellow-700',
    error: 'bg-red-700'
  }

  return (
    <div ref={divRef} className="transition-opacity delay-0 duration-1000 opacity-0">
      <div className={`flex justify-between items-center rounded-sm p-1 mb-4 ${colors[type]}`}>
        <div className="text-gray-100 bg-transparent text-sm" dangerouslySetInnerHTML={{ __html: message }} />
        <CustomButton onClick={onDismiss} size="small">×</CustomButton>
      </div>
    </div>
  )
}

export default FlashMessage
