'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion, useAnimate } from 'framer-motion'

interface GhostTextProps {
  text: string
  className?: string
  duration?: number
  blurAmount?: number
  brightness?: number
  glowIntensity?: number
  delay?: number
}

export const GhostText = ({ 
  text, 
  className = '',
  duration = 0.4,
  blurAmount = 4,
  brightness = 1.5,
  delay = 0
}: GhostTextProps) => {
  const [scope, animate] = useAnimate()
  const hasAnimated = useRef(false)

  const runAnimation = useCallback(async () => {
    const chars = scope.current.children
    
    await animate(chars, { 
      opacity: 0,
      filter: `blur(${blurAmount * 2}px) contrast(150%) url(#noise)`,
    }, { duration: 0 })

    await new Promise(resolve => setTimeout(resolve, delay * 1000))

    for (let i = 0; i < chars.length; i++) {
      animate(
        chars[i],
        { 
          opacity: [0, 0.4, 1],
          filter: [
            `blur(${blurAmount * 2}px) contrast(150%) brightness(${brightness * 1.8})`,
            `blur(${blurAmount * 1.2}px) contrast(120%) brightness(${brightness * 1.4})`,
            'blur(0px) contrast(100%) brightness(1)'
          ]
        },
        { 
          duration: duration * 1.4,
          ease: [0.2, 0.6, 0.3, 1],
          delay: i * 0.04
        }
      )
    }
  }, [animate, duration, blurAmount, brightness, delay, scope])

  useEffect(() => {
    if (hasAnimated.current) return
    runAnimation()
    hasAnimated.current = true
  }, [runAnimation])

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="noise">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="1.5" 
              numOctaves="3" 
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </defs>
      </svg>
      <span ref={scope} className={className}>
        {text.split('').map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            style={{ 
              display: 'inline-block',
              opacity: 0,
              willChange: 'transform, opacity, filter',
              width: char === ' ' ? '0.5em' : 'auto'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    </>
  )
} 