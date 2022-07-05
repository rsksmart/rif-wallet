import React from 'react'
import { Section } from './index'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'

describe('Section', () => {
  it('renders title and children', () => {
    const { getByText } = render(
      <Section title="Information">
        <Text>Version: 123</Text>
      </Section>,
    )

    expect(getByText('Information')).toBeDefined()
    expect(getByText('Version: 123')).toBeDefined()
  })
})
