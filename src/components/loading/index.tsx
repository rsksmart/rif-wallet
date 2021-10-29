import React from 'react'
import { Paragraph } from '../typography'

interface Interface {
  reason?: string
}

export const Loading: React.FC<Interface> = ({ reason }) => (
  <Paragraph>Loading{reason && `: ${reason}`}</Paragraph>
)
