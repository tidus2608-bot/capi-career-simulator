import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import QAPageLayout from './QAPageLayout.jsx'

describe('QAPageLayout Auto-Advance & Keyboard Navigation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const sampleOptions = [
    { value: 5, hotkey: '5', text: 'Hoàn toàn đồng ý' },
    { value: 4, hotkey: '4', text: 'Đồng ý' },
    { value: 3, hotkey: '3', text: 'Trung lập' },
    { value: 2, hotkey: '2', text: 'Không đồng ý' },
    { value: 1, hotkey: '1', text: 'Hoàn toàn không đồng ý' },
  ]

  it('calls onSelect immediately and onNext after 280ms debounce', () => {
    const handleSelect = vi.fn()
    const handleNext = vi.fn()

    const { container } = render(
      <QAPageLayout
        imageSrc="/test.webp"
        idx={0}
        total={5}
        questionText="Câu hỏi thử nghiệm 1?"
        options={sampleOptions}
        selectedValue={null}
        onSelect={handleSelect}
        onBack={vi.fn()}
        onNext={handleNext}
      />,
    )

    const options = container.querySelectorAll('.p2-option')
    // Click option 5 ("Hoàn toàn đồng ý", first button)
    fireEvent.click(options[0])

    expect(handleSelect).toHaveBeenCalledWith(5)
    expect(handleNext).not.toHaveBeenCalled()

    // Fast-forward 270ms - should not have called yet
    act(() => {
      vi.advanceTimersByTime(270)
    })
    expect(handleNext).not.toHaveBeenCalled()

    // Fast-forward remaining 15ms - should call onNext
    act(() => {
      vi.advanceTimersByTime(15)
    })
    expect(handleNext).toHaveBeenCalledTimes(1)
  })

  it('resets timer if another option is clicked before debounce expires', () => {
    const handleSelect = vi.fn()
    const handleNext = vi.fn()

    const { container } = render(
      <QAPageLayout
        imageSrc="/test.webp"
        idx={0}
        total={5}
        questionText="Câu hỏi thử nghiệm 1?"
        options={sampleOptions}
        selectedValue={null}
        onSelect={handleSelect}
        onBack={vi.fn()}
        onNext={handleNext}
      />,
    )

    const options = container.querySelectorAll('.p2-option')

    // Click option 5
    fireEvent.click(options[0])
    expect(handleSelect).toHaveBeenCalledWith(5)

    // Wait 150ms and click option 4
    act(() => {
      vi.advanceTimersByTime(150)
    })
    fireEvent.click(options[1])
    expect(handleSelect).toHaveBeenCalledWith(4)

    // Wait another 150ms (total 300ms since first click, but only 150ms since second click)
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(handleNext).not.toHaveBeenCalled()

    // Wait remaining 135ms to complete 280ms from second click
    act(() => {
      vi.advanceTimersByTime(135)
    })
    expect(handleNext).toHaveBeenCalledTimes(1)
  })

  it('cancels auto-advance timer when user manually clicks Back', () => {
    const handleSelect = vi.fn()
    const handleNext = vi.fn()
    const handleBack = vi.fn()

    const { container } = render(
      <QAPageLayout
        imageSrc="/test.webp"
        idx={1}
        total={5}
        questionText="Câu hỏi thử nghiệm 2?"
        options={sampleOptions}
        selectedValue={null}
        onSelect={handleSelect}
        onBack={handleBack}
        onNext={handleNext}
      />,
    )

    const options = container.querySelectorAll('.p2-option')
    // Click option 5
    fireEvent.click(options[0])
    expect(handleSelect).toHaveBeenCalledWith(5)

    // Immediately click contextual Back button
    const backBtn = screen.getByRole('button', { name: /Quay lại|Back/i })
    fireEvent.click(backBtn)
    expect(handleBack).toHaveBeenCalledTimes(1)

    // Fast forward 500ms - onNext should NOT fire
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(handleNext).not.toHaveBeenCalled()
  })

  it('selects option and auto-advances on numeric keyboard press', () => {
    const handleSelect = vi.fn()
    const handleNext = vi.fn()

    render(
      <QAPageLayout
        imageSrc="/test.webp"
        idx={0}
        total={5}
        questionText="Câu hỏi thử nghiệm?"
        options={sampleOptions}
        selectedValue={null}
        onSelect={handleSelect}
        onBack={vi.fn()}
        onNext={handleNext}
      />,
    )

    // Press key "4"
    fireEvent.keyDown(window, { key: '4' })
    expect(handleSelect).toHaveBeenCalledWith(4)

    act(() => {
      vi.advanceTimersByTime(285)
    })
    expect(handleNext).toHaveBeenCalledTimes(1)
  })

  it('selects option and auto-advances on letter keyboard press (A, B, C)', () => {
    const handleSelect = vi.fn()
    const handleNext = vi.fn()

    const scenarioOptions = [
      { label: 'A', hotkey: 'A', text: 'Kế hoạch A' },
      { label: 'B', hotkey: 'B', text: 'Kế hoạch B' },
      { label: 'C', hotkey: 'C', text: 'Kế hoạch C' },
    ]

    render(
      <QAPageLayout
        imageSrc="/test.webp"
        idx={0}
        total={3}
        questionText="Tình huống thử nghiệm?"
        options={scenarioOptions}
        selectedValue={null}
        onSelect={handleSelect}
        onBack={vi.fn()}
        onNext={handleNext}
      />,
    )

    // Press key "b" (case insensitive)
    fireEvent.keyDown(window, { key: 'b' })
    expect(handleSelect).toHaveBeenCalledWith('B')

    act(() => {
      vi.advanceTimersByTime(285)
    })
    expect(handleNext).toHaveBeenCalledTimes(1)
  })

  it('navigates back on ArrowLeft and forwards on Enter when selectedValue is set', () => {
    const handleBack = vi.fn()
    const handleNext = vi.fn()

    const { rerender } = render(
      <QAPageLayout
        imageSrc="/test.webp"
        idx={1}
        total={5}
        questionText="Câu hỏi 2?"
        options={sampleOptions}
        selectedValue={null}
        onSelect={vi.fn()}
        onBack={handleBack}
        onNext={handleNext}
      />,
    )

    // Enter pressed while nothing selected - should not trigger
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(handleNext).not.toHaveBeenCalled()

    // ArrowLeft pressed - should trigger Back
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(handleBack).toHaveBeenCalledTimes(1)

    // When option is already selected
    rerender(
      <QAPageLayout
        imageSrc="/test.webp"
        idx={1}
        total={5}
        questionText="Câu hỏi 2?"
        options={sampleOptions}
        selectedValue={4}
        onSelect={vi.fn()}
        onBack={handleBack}
        onNext={handleNext}
      />,
    )

    fireEvent.keyDown(window, { key: 'Enter' })
    expect(handleNext).toHaveBeenCalledTimes(1)
  })

  it('renders unified top nav bar with adaptive back and next buttons', () => {
    const handleBack = vi.fn()
    const handleNext = vi.fn()

    const { rerender } = render(
      <QAPageLayout
        imageSrc="/test.webp"
        idx={0}
        total={5}
        questionText="Câu hỏi 1?"
        options={sampleOptions}
        selectedValue={null}
        onSelect={vi.fn()}
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={false}
      />,
    )

    // At question 0 without canGoNext: Neither Back nor Next button is in the DOM (no phantom whitespace)
    expect(screen.queryByTitle(/Câu trước/i)).toBeNull()
    expect(screen.queryByTitle(/Câu tiếp theo/i)).toBeNull()

    // ArrowRight should NOT navigate when canGoNext is false
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(handleNext).not.toHaveBeenCalled()

    // At question 1 with canGoNext: true (user went back to review)
    rerender(
      <QAPageLayout
        imageSrc="/test.webp"
        idx={1}
        total={5}
        questionText="Câu hỏi 2?"
        options={sampleOptions}
        selectedValue={3}
        onSelect={vi.fn()}
        onBack={handleBack}
        onNext={handleNext}
        canGoNext={true}
      />,
    )

    const backBtn = screen.getByTitle(/Câu trước/i)
    const nextBtn = screen.getByTitle(/Câu tiếp theo/i)
    expect(backBtn).toBeInTheDocument()
    expect(nextBtn).toBeInTheDocument()

    // Clicking next button calls handleNext
    fireEvent.click(nextBtn)
    expect(handleNext).toHaveBeenCalledTimes(1)

    // Pressing ArrowRight calls handleNext
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(handleNext).toHaveBeenCalledTimes(2)

    // Clicking back button calls handleBack
    fireEvent.click(backBtn)
    expect(handleBack).toHaveBeenCalledTimes(1)
  })

  it('allows navigating forward up to (lastAnsweredIndex + 1), but not past the last question', () => {
    // Formula under test
    const computeCanGoNext = (idx, total, answeredIndices) => {
      const maxAnsweredIdx = answeredIndices.length > 0 ? Math.max(...answeredIndices) : -1
      const maxNavigableIdx = Math.min(total - 1, maxAnsweredIdx + 1)
      return idx < maxNavigableIdx
    }

    const total = 5

    // Initially, no answers
    expect(computeCanGoNext(0, total, [])).toBe(false)

    // User answered Q0 only: can go from Q0 to Q1 (lastAnswered + 1 = 1)
    expect(computeCanGoNext(0, total, [0])).toBe(true)
    // But once at Q1, cannot go to Q2 yet
    expect(computeCanGoNext(1, total, [0])).toBe(false)

    // User answered Q0 and Q1: lastAnswered is Q1 (idx 1)
    // From Q0 can go to Q1, from Q1 can go to Q2 (lastAnswered + 1 = 2)
    expect(computeCanGoNext(0, total, [0, 1])).toBe(true)
    expect(computeCanGoNext(1, total, [0, 1])).toBe(true)
    // At Q2, cannot go to Q3
    expect(computeCanGoNext(2, total, [0, 1])).toBe(false)

    // All questions answered (0, 1, 2, 3, 4)
    expect(computeCanGoNext(3, total, [0, 1, 2, 3, 4])).toBe(true)
    // At last question (idx 4), cannot go next
    expect(computeCanGoNext(4, total, [0, 1, 2, 3, 4])).toBe(false)
  })
})
