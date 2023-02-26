import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')

  const inputTitle = inputs[0]
  const inputAuthor = inputs[1]
  const inputUrl = inputs[2]

  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'testing form title')
  await user.type(inputAuthor, 'testing form author')
  await user.type(inputUrl, 'testing form url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('testing form title')
  expect(createBlog.mock.calls[0][0].author).toBe('testing form author')
  expect(createBlog.mock.calls[0][0].url).toBe('testing form url')
})