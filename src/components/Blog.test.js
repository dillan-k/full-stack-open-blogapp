import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  let container

  beforeEach(() => {
    const blog = {
      title: 'example title',
      url: 'www.fullstackopen.com',
      author: 'example author',
      likes: 5,
      user: {
        name: 'example name'
      }
    }
    const user = {
      name: 'example name'
    }
    container = render(<Blog blog={blog} user={user} />).container
  })

  test('renders correct content', () => {
    const element = screen.getByText('example title example author')
    const div = container.querySelector('.blogDetails')
    expect(element).toBeDefined()
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, blog details are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display: none')
  })
})


test('<BlogDetails /> after clicking the button, blog details are displayed', async () => {
  const eventUser = userEvent.setup()
  const updateBlog = jest.fn()

  const blog = {
    title: 'example title',
    url: 'www.fullstackopen.com',
    author: 'example author',
    likes: 5,
    user: {
      name: 'example name'
    }
  }

  const user = {
    name: 'example name'
  }

  const { container } = render(<Blog blog={blog} updateBlog={updateBlog} user={user} />)
  const likeButton = container.querySelector('.likeButton')

  await eventUser.click(likeButton)
  await eventUser.click(likeButton)

  expect(updateBlog.mock.calls).toHaveLength(2)
})
