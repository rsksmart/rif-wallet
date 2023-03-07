import React from 'react'
import { MediumText } from '../typography'

interface Interface {
  reason?: string
}

export const Loading: React.FC<Interface> = ({ reason }) => (
  <MediumText>Loading{reason && `: ${reason}`}</MediumText>
)
