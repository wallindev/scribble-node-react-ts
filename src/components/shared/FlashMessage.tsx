import { useEffect, useRef } from 'react'
import type { FC, JSX } from 'react'
import CustomButton from './CustomButton'
import type { IFlashMessage } from '../../types/general.types'
import { hideFlashMessage, scrollSmoothlyToTop } from '../../utils/functions'
import { defaultColors } from '../../utils/defaults'

const FlashMessage: FC<IFlashMessage> = ({ flashMessage, setFlashMessage }): JSX.Element => {
  const messageWrapperRef = useRef<HTMLDivElement>(null)
  // TODO: Use to hide text and button from tab cycle/focus with keyboard?
  // const messageRef = useRef<HTMLDivElement>(null)
  const { message, type, visible } = flashMessage

  // Fade-in-fade-out effect on route change (together with CSS transition)
  useEffect(() => {
    const divMessageWrapper = messageWrapperRef.current as HTMLDivElement
    // const divMessage = messageRef.current as HTMLDivElement
    if (visible) {
      // Scroll to top every time a message is displayed
      scrollSmoothlyToTop()
      // console.log('show flash message')
      // divMessage.classList.replace('hidden', 'flex')
      divMessageWrapper.classList.replace('opacity-0', 'opacity-100')
      divMessageWrapper.classList.replace('h-0', 'h-8')
      divMessageWrapper.classList.replace('mb-0', 'mb-2')
    } else {
      // divMessage.classList.replace('flex', 'hidden')
      divMessageWrapper.classList.replace('opacity-100', 'opacity-0')
      divMessageWrapper.classList.replace('h-8', 'h-0')
      divMessageWrapper.classList.replace('mb-2', 'mb-0')
    }

    // ComponentWillUnMount
    return () => {
      // Garbage cleanup
      // clearTimeout(showTimer)
    }
  }, [flashMessage])

  return (
    <div ref={messageWrapperRef} className={`flex h-0 mb-0 p-1 justify-between items-center rounded-sm transition-all duration-500 opacity-0 ${defaultColors[type]}`}>
      <div className="text-gray-100 bg-transparent text-sm" dangerouslySetInnerHTML={{ __html: message }} />
      <CustomButton onClick={() => hideFlashMessage(flashMessage, setFlashMessage)} size="small">×</CustomButton>
    </div>
  )
}

export default FlashMessage
