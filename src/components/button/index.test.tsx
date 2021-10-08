import React from 'react'
import renderer from 'react-test-renderer'

import Button from './index'

it('renders correctly with defaults', () => {
  const button = renderer
    .create(<Button title="hello" onPress={() => console.log('click')} />)
    .toJSON()
  // const button = mount(<Button title="hello" onPress={() => console.log('click')} />)
  expect(button).toBeDefined()
})
