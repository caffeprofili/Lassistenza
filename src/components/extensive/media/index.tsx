import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './image'
import { VideoMedia } from './video'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const isPdf = typeof resource === 'object' && resource?.mimeType?.includes('pdf')
  const Tag = (htmlElement as any) || Fragment

  return (
    <Tag
      {...(htmlElement !== null
        ? {
          className,
        }
        : {})}
    >
      {isVideo ? <VideoMedia {...props} /> : isPdf ? <p>PDF HERE</p> : <ImageMedia {...props} />}
    </Tag>
  )
}
