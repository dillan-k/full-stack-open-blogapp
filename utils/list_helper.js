const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  let maxBlog = blogs.reduce((max, blog) => blog.likes > max ? blog : max)

  return {
    title: maxBlog.title,
    author: maxBlog.author,
    likes: maxBlog.likes
  }
}

const mostBlogs = (blogs) => {

  const blogsPerAuthor = new Map()
  let maxAuthor = ''
  let maxBlogs = 0

  blogs.forEach(blog => {
    if (!blogsPerAuthor.get(blog.author)) {
      blogsPerAuthor.set(blog.author, 1)
    } else {
      blogsPerAuthor.set(blog.author, blogsPerAuthor.get(blog.author) + 1)
    }
    if (blogsPerAuthor.get(blog.author) > maxBlogs) {
      maxAuthor = blog.author
      maxBlogs = blogsPerAuthor.get(blog.author)
    }
  })

  return { author: maxAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs) => {

  const likesPerAuthor = new Map()
  let maxAuthor = ''
  let totalLikes = 0

  blogs.forEach(blog => {
    if (!likesPerAuthor.get(blog.author)) {
      likesPerAuthor.set(blog.author, blog.likes)
    } else {
      likesPerAuthor.set(blog.author, likesPerAuthor.get(blog.author) + blog.likes)
    }
    if (likesPerAuthor.get(blog.author) > totalLikes) {
      maxAuthor = blog.author
      totalLikes = likesPerAuthor.get(blog.author)
    }
  })

  return { author: maxAuthor, likes: totalLikes }

}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}