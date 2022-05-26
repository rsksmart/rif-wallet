import React from 'react'
import { render, waitFor, fireEvent, act } from '@testing-library/react-native'
import { cleanup } from '@testing-library/react-native'

import { WordSelector } from './WordSelector'
import { getTextFromTextNode } from '../../../../testLib/utils'

describe('Word Selector', function (this: {
  confirm: ReturnType<typeof jest.fn>
  cancel: ReturnType<typeof jest.fn>
}) {
  beforeEach(async () => {
    this.confirm = jest.fn()
    this.cancel = jest.fn()
  })

  afterEach(cleanup)

  it('renders', async () => {
    const { getByTestId } = await waitFor(() =>
      render(
        <WordSelector
          words={['one', 'two', 'three', 'four']}
          wordIndex={0}
          onWordSelected={() => {}}
        />,
      ),
    )

    expect(getTextFromTextNode(getByTestId('view.indexLabel'))).toContain('1')
  })

  test('show options', async () => {
    const { getByTestId } = await waitFor(() =>
      render(
        <WordSelector
          words={['one', 'two', 'three', 'four']}
          wordIndex={0}
          onWordSelected={() => {}}
        />,
      ),
    )
    const input = getByTestId('input.wordInput')
    fireEvent.changeText(input, 'on')
    expect(getTextFromTextNode(getByTestId('view.option.0'))).toContain('one')
    fireEvent.changeText(input, 't')
    expect(getTextFromTextNode(getByTestId('view.option.0'))).toContain('two')
    expect(getTextFromTextNode(getByTestId('view.option.1'))).toContain('three')
  })

  test('select correct word', async () => {
    const { getByTestId, queryByTestId } = await waitFor(() =>
      render(
        <WordSelector
          words={['one', 'two', 'three', 'four']}
          wordIndex={2}
          onWordSelected={() => {}}
        />,
      ),
    )
    const input = getByTestId('input.wordInput')

    fireEvent.changeText(input, 't')
    expect(getByTestId('deleteIcon')).toBeDefined()
    expect(queryByTestId('checkIcon')).toBeNull()
    fireEvent.press(getByTestId('view.option.1'))
    expect(getByTestId('checkIcon')).toBeDefined()
    expect(queryByTestId('deleteIcon')).toBeNull()
  })

  test('select incorrect word', async () => {
    const { getByTestId, queryByTestId } = await waitFor(() =>
      render(
        <WordSelector
          words={['one', 'two', 'three', 'four']}
          wordIndex={2}
          onWordSelected={() => {}}
        />,
      ),
    )
    const input = getByTestId('input.wordInput')

    fireEvent.changeText(input, 't')
    expect(getByTestId('deleteIcon')).toBeDefined()
    expect(queryByTestId('checkIcon')).toBeNull()
    fireEvent.press(getByTestId('view.option.0'))
    expect(getByTestId('deleteIcon')).toBeDefined()
    expect(queryByTestId('checkIcon')).toBeNull()
  })
})
