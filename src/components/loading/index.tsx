import React from 'react'
import { Paragraph } from '../typrography'

interface Interface {
  reason?: string
}

const Loading: React.FC<Interface> = ({ reason }) => (
  <Paragraph>Loading{reason && `: ${reason}`}</Paragraph>
)

export default Loading
