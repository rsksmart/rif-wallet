import React from 'react'
import { Paragraph } from '../typography'

interface Interface {
  reason?: string
}

const Loading: React.FC<Interface> = ({ reason }) => (
  <Paragraph>Loading{reason && `: ${reason}`}</Paragraph>
)

export default Loading
