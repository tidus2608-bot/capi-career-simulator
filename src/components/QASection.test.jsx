import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import QASection from './QASection.jsx'

function createMock() {
  const fn = (...args) => {
    fn.mock.calls.push(args)
  }
  fn.mock = { calls: [] }
  return fn
}

describe('QASection', () => {
  const likertOptions = [
    { value: 1, text: 'Hoàn toàn không đồng ý' },
    { value: 2, text: 'Không đồng ý' },
    { value: 3, text: 'Trung lập' },
    { value: 4, text: 'Đồng ý' },
    { value: 5, text: 'Hoàn toàn đồng ý' },
  ]

  it('renders all options in default unselected state when selectedValue is undefined', () => {
    render(
      <QASection
        questionText="Test Question?"
        options={likertOptions}
        selectedValue={undefined}
        onSelect={() => {}}
      />,
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(5)
    buttons.forEach((btn) => {
      expect(btn.className).not.toContain('p2-selected')
    })
  })

  it('renders all options in default unselected state when selectedValue is null', () => {
    render(
      <QASection
        questionText="Test Question?"
        options={likertOptions}
        selectedValue={null}
        onSelect={() => {}}
      />,
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(5)
    buttons.forEach((btn) => {
      expect(btn.className).not.toContain('p2-selected')
    })
  })

  it('highlights only the selected option matching value', () => {
    render(
      <QASection
        questionText="Test Question?"
        options={likertOptions}
        selectedValue={3}
        onSelect={() => {}}
      />,
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons[0].className).not.toContain('p2-selected')
    expect(buttons[1].className).not.toContain('p2-selected')
    expect(buttons[2].className).toContain('p2-selected')
    expect(buttons[3].className).not.toContain('p2-selected')
    expect(buttons[4].className).not.toContain('p2-selected')
  })

  it('calls onSelect with option value when clicked', () => {
    const handleSelect = createMock()
    render(
      <QASection
        questionText="Test Question?"
        options={likertOptions}
        selectedValue={undefined}
        onSelect={handleSelect}
      />,
    )

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[3])
    expect(handleSelect.mock.calls.length).toBe(1)
    expect(handleSelect.mock.calls[0][0]).toBe(4)
  })

  it('supports option label for choice options and highlights correctly', () => {
    const choiceOptions = [
      { label: 'A', text: 'Option A' },
      { label: 'B', text: 'Option B' },
      { label: 'C', text: 'Option C' },
    ]

    const { rerender } = render(
      <QASection
        questionText="Scenario question?"
        options={choiceOptions}
        selectedValue={undefined}
        onSelect={() => {}}
      />,
    )

    let buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => expect(btn.className).not.toContain('p2-selected'))

    rerender(
      <QASection
        questionText="Scenario question?"
        options={choiceOptions}
        selectedValue="B"
        onSelect={() => {}}
      />,
    )

    buttons = screen.getAllByRole('button')
    expect(buttons[0].className).not.toContain('p2-selected')
    expect(buttons[1].className).toContain('p2-selected')
    expect(buttons[2].className).not.toContain('p2-selected')
  })
})
