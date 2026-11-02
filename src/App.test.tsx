import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

function clearStorage() {
  window.localStorage.clear()
}

async function resolveEntireSession(user: ReturnType<typeof userEvent.setup>) {
  for (let index = 0; index < 12; index += 1) {
    const resolveButton = screen.queryByRole('button', { name: /resolve \/ got it/i })

    if (!resolveButton) {
      return
    }

    await user.click(resolveButton)
  }
}

describe('Catch up live tracker', () => {
  beforeEach(() => {
    clearStorage()
  })

  test('shows latest and topic entry points with state-of-play summaries on the home screen', () => {
    render(<App />)

    expect(screen.getByText(/mixed feed across tracked topics/i)).toBeInTheDocument()
    expect(screen.getByText('Topics')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Iran .*Fast-moving/i })).toBeInTheDocument()
    expect(screen.getByText(/Show me only the latest relevant updates/i)).toBeInTheDocument()
  })

  test('opens the latest feed with normalized update cards and multi-source confirmation', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByText(/mixed feed across tracked topics/i))

    expect(screen.getByText('Latest')).toBeInTheDocument()
    expect(screen.getByText(/Fast-moving/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /resolve \/ got it/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /keep in rotation/i })).toBeInTheDocument()
    expect(screen.getAllByText(/sources aligned on this shift/i)[0]).toBeInTheDocument()
  })

  test('topic mode keeps the selected topic and surfaces tracker-specific status', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /AI .*Fast-moving/i }))
    await user.click(screen.getByRole('button', { name: /open ai/i }))

    expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /AI buyers are asking harder deployment and trust questions/i })).toBeInTheDocument()
  })

  test('keep in rotation persists across visits while resolve removes the normalized update', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /AI .*Fast-moving/i }))
    await user.click(screen.getByRole('button', { name: /open ai/i }))

    expect(
      screen.getByRole('heading', { name: /AI buyers are asking harder deployment and trust questions/i }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /keep in rotation/i }))
    await user.click(screen.getByRole('button', { name: /back to home/i }))
    await user.click(screen.getByRole('button', { name: /open ai/i }))

    expect(
      screen.getByRole('heading', { name: /AI buyers are asking harder deployment and trust questions/i }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /resolve \/ got it/i }))
    await user.click(screen.getByRole('button', { name: /done/i }))
    await user.click(screen.getByRole('button', { name: /open ai/i }))

    expect(
      screen.queryByRole('heading', { name: /AI buyers are asking harder deployment and trust questions/i }),
    ).not.toBeInTheDocument()
  })

  test('reader opens the preferred source article and keyboard shortcuts pause queue actions while open', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByText(/mixed feed across tracked topics/i))
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog', { name: /reader preview/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open original/i })).toBeInTheDocument()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('dialog', { name: /reader preview/i })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /reader preview/i })).not.toBeInTheDocument()
    })
  })

  test('shows a completion state with tracker-specific summary after clearing a topic session', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /Iran .*Fast-moving/i }))
    await user.click(screen.getByRole('button', { name: /open iran/i }))
    await resolveEntireSession(user)

    expect(screen.getByText(/You are up to date on Iran/i)).toBeInTheDocument()
    expect(screen.getByText(/updates reviewed this session/i)).toBeInTheDocument()
    expect(screen.getByText(/major shifts cleared/i)).toBeInTheDocument()
  })
})
