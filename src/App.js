import React from 'react'
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const SuccessNotification = ({ message }) => {
  return (
    <Notification message={ message } color='green' />
  )
}

const ErrorNotification = ({ message }) => {
  return (
    <Notification message={ message } color='red' />
  )
}

const Notification = ({ message, color }) => {
  if (!message) {
    return null
  }

  const notificationStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10
  }

  return (
    <div className='notification' style={notificationStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        if (blogs) {
          setBlogs(blogs)
        }
      } catch (exception) {
        setUser(null)
        console.log('Could not retrieve blogs')
      }
    }

    if (user) {
      getBlogs()
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const cachedUser = JSON.parse(loggedUserJSON)
      setUser(cachedUser)
      blogService.setToken(cachedUser.token)
    }
  }, [])

  const setTimedSuccessMessage = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 5000)
  }

  const setTimedErrorMessage = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 5000)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {

        const newBlog = returnedBlog
        newBlog.user = {
          'username': user.username,
          'name': user.name
        }

        setBlogs(blogs.concat(newBlog))
        setTimedSuccessMessage(`a new blog ${blogObject.title} added`)
      })
      .catch(ex => {
        console.log(ex)
        setTimedErrorMessage('an error occurred when creating the new blog')
      })
  }

  const updateBlog = (updatedBlog) => {
    blogService
      .update(updatedBlog.id, updatedBlog)
      .then(() => {
        setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
        setTimedSuccessMessage(`updated ${updatedBlog.title}`)
      })
      .catch(ex => {
        console.log(ex)
        setTimedErrorMessage('an error occurred when updating the blog')
      })
  }

  const deleteBlog = (blogObject) => {
    blogService
      .deleteRecord(blogObject.id)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
        setTimedSuccessMessage(`deleted ${blogObject.title}`)
      })
      .catch(ex => {
        console.log(ex)
        setTimedErrorMessage('an error occurred when deleting the blog or you are not authorized to delete this blog')
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setTimedErrorMessage('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistappUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div>
        username
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef} >
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const sortedBlogListByLikesDesc = [...blogs].sort((a, b) => (b.likes - a.likes))

  return (
    <div>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      {user === null ?
        loginForm() :
        <div>
          <h2>blogs</h2>
          <p>
            <span>{user.name} logged in</span>
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
          <div>
            {sortedBlogListByLikesDesc.map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                user={user}
              />
            )}
          </div>
        </div>
      }
    </div>
  )
}

export default App
