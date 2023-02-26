import React from 'react'
import { useState } from 'react'

const BlogDetails = ({
  blog,
  handleLike,
  handleDelete,
  user
}) => {
  return (
    <div>
      <div>{blog.url}</div>
      <div>
        <span>likes {blog.likes}</span>
        <button className="likeButton" onClick={() => handleLike(blog)}>like</button>
      </div>
      <div>{blog.user.name}</div>
      <button
        style={{ display: blog.user.username === user.username ? '' : 'none' }}
        onClick={() => handleDelete(blog)}>
          remove
      </button>
    </div>
  )
}

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = (blogToUpdate) => {
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
    updateBlog(updatedBlog)
  }

  const handleDelete = (blogToDelete) => {
    if (window.confirm(`Remove blog ${blogToDelete.title} by ${blog.author}`)) {
      deleteBlog(blogToDelete)
    }
  }

  return (
    <div className='blog' style={blogStyle}>
      <div>
        <span>{blog.title} {blog.author}</span>
        <button onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
      </div>
      <div className='blogDetails' style={{ display: showDetails ? '' : 'none' }}>
        <BlogDetails
          blog={blog}
          handleLike={handleLike}
          handleDelete={handleDelete}
          user={user}
        />
      </div>
    </div>
  )
}

export default Blog