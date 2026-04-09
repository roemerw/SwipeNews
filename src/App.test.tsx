import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

async function startIranSession() {
  const user = userEvent.setup()

  await user.click(screen.getByRole('button', { name: 'Iran' }))
  await user.click(screen.getByRole('button', { name: /start catch-up/i }))
  await screen.findByText('10 Left')

  return user
}

describe('Catch up prototype', () => {
  test('enables start after topic selection', async () => {
    const user = userEvent.setup()

    render(<App />)

    const startButton = screen.getByRole('button', { name: /start catch-up/i })

    expect(startButton).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Iran' }))

    expect(startButton).toBeEnabled()
  })

  test('initializes a queue of ten items for a selected topic', async () => {
    render(<App />)

    await startIranSession()

    expect(screen.getByText('10 Left')).toBeInTheDocument()
    expect(
      screen.getByText(
        /Iran signals it will keep indirect talks open as pressure rises over regional strikes/i,
      ),
    ).toBeInTheDocument()
  })

  test('decrements the counter for both mark read and keep unread', async () => {
    render(<App />)

    const user = await startIranSession()

    await user.click(screen.getByRole('button', { name: /mark as read/i }))
    await screen.findByText('9 Left')

    await user.click(screen.getByRole('button', { name: /undo/i }))
    await screen.findByText('10 Left')

    await user.click(screen.getByRole('button', { name: /keep unread/i }))
    await screen.findByText('9 Left')
  })

  test('undo restores the previous article and count', async () => {
    render(<App />)

    const user = await startIranSession()
    const firstHeadline =
      'Iran signals it will keep indirect talks open as pressure rises over regional strikes'
    const secondHeadline =
      'Shipping insurers reassess Gulf exposure as traders watch Iranian warnings'
    const thirdHeadline =
      'European diplomats revive sanctions language while pushing Tehran to avoid a wider clash'

    await user.click(screen.getByRole('button', { name: /mark as read/i }))
    await screen.findByText(secondHeadline)

    await user.click(screen.getByRole('button', { name: /keep unread/i }))
    await screen.findByText(thirdHeadline)
    expect(screen.getByText('8 Left')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /undo/i }))
    await screen.findByText(secondHeadline)
    expect(screen.getByText('9 Left')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /undo/i }))
    await screen.findByText(firstHeadline)
    expect(screen.getByText('10 Left')).toBeInTheDocument()
  })

  test('keyboard shortcuts respect reader-open state', async () => {
    render(<App />)

    const user = await startIranSession()

    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', { name: /reader preview/i })).toBeInTheDocument()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('10 Left')).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: /reader preview/i })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /reader preview/i })).not.toBeInTheDocument()
    })

    await user.keyboard('{ArrowRight}')
    await screen.findByText('9 Left')
  })

  test('shows the done state and session summary after ten processed items', async () => {
    render(<App />)

    const user = await startIranSession()

    for (let index = 0; index < 10; index += 1) {
      await user.click(screen.getByRole('button', { name: /mark as read/i }))
    }

    expect(screen.getByText('All caught up.')).toBeInTheDocument()
    expect(screen.getByText('You reviewed 10 updates on Iran')).toBeInTheDocument()
    expect(screen.getByText('10 marked read, 0 kept unread.')).toBeInTheDocument()
  })

  test('refresh reshuffles the topic start point and restarts from done', async () => {
    render(<App />)

    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Iran' }))
    await user.click(screen.getByRole('button', { name: /start catch-up/i }))
    await screen.findByText(
      /Iran signals it will keep indirect talks open as pressure rises over regional strikes/i,
    )

    await user.click(screen.getByRole('button', { name: /back to topics/i }))
    expect(screen.getByRole('button', { name: 'Iran' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: /refresh topics/i }))
    await user.click(screen.getByRole('button', { name: /start catch-up/i }))
    await screen.findByText(
      /Shipping insurers reassess Gulf exposure as traders watch Iranian warnings/i,
    )

    for (let index = 0; index < 10; index += 1) {
      await user.click(screen.getByRole('button', { name: /mark as read/i }))
    }

    await user.click(screen.getByRole('button', { name: /refresh/i }))
    await screen.findByText('10 Left')
    expect(screen.queryByText('All caught up.')).not.toBeInTheDocument()
  })
})
