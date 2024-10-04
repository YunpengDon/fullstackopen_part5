import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  },[])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
      console.log(`Successfully log in with ${user.username}`)
    } catch (exception) {
      console.log('Wrong credentials')
    }
  }

  const handleLogOut = (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogUser')
      setUser(null)
      console.log(`Successfully log out`)
    } catch (error) {
      console.error(error);
    }
  }


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
      username <input type="text" value={username} name='Username' onChange={({target})=>setUsername(target.value)}/>
      </div>
      <div>
      password <input type="text" value={password} name='Password' onChange={({target})=>setPassword(target.value)}/>
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const handleCreate = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    }
    try {
      const newblog = await blogService.create(newBlog)
      console.log(`create ${newblog.title}`);
      setBlogTitle('')
      setBlogAuthor('')
      setBlogUrl('')
      setBlogs(blogs.concat(newblog))
    } catch (error) {
      console.log(error);
    }
    
  }

  const createForm = () => (
    <form onSubmit={handleCreate}>
        <div>title <input type="text" value={blogTitle} name='blogTitle' onChange={({target})=>setBlogTitle(target.value)}/></div>
        <div>author <input type="text" value={blogAuthor} name='blogAuthor' onChange={({target})=>setBlogAuthor(target.value)}/></div>
        <div>url <input type="text" value={blogUrl} name='blogUrl' onChange={({target})=>setBlogUrl(target.value)}/></div>
        <button type='submit'>create</button>
      </form>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <div><p>{user.name} logged in <button onClick={handleLogOut}>log out</button></p></div>
      <h2>create new</h2>
      {createForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App