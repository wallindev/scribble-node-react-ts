import { useEffect, useRef, useState } from 'react'
import type { FC, JSX } from 'react'
import type { ILoadText } from '../../types/general.types'

const LoadText: FC<ILoadText> = ({ defaultText = 'Loading' }): JSX.Element => {
  const displayTexts = {
    startText: `${defaultText}..`,
    endText: `${defaultText}...`
  }
  const [displayText, setDisplayText] = useState(displayTexts.startText)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Change opacity from 0 to 100 so the "loading" div fades in,
    // giving the content a chance to render and preventing
    // "loading" div from flashing
    const opacityTimer = setTimeout(() => {
      (textRef.current as HTMLDivElement)?.classList?.replace('opacity-0', 'opacity-100')
    }, 1)

    const displayTimer = setInterval(() => {
      setDisplayText(displayText === displayTexts.startText ? displayTexts.endText : displayTexts.startText)
    }, 1000)

    return () => {
      clearTimeout(opacityTimer)
      clearTimeout(displayTimer)
    }
  }, [])

  return (
    <div ref={textRef} className="m-0 sm:mx-auto p-2 sm:p-4 w-screen sm:max-w-160 /* max-sm:*/ h-screen flex flex-col bg-content-bg rounded-xl transition-opacity delay-0 duration-800 opacity-0">
      {displayText}
    </div>
  )
}

export default LoadText
