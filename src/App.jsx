import { useState, useEffect, useRef} from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const Notification = ({message}) => {
  if (message === null) {
    return null
  }
  if (message.type==='error') {
      return (
      <div className='error'>
        {message.text}
      </div>)
  }
  
  if (message.type==='success') {
    return(
    <div className='success'>
      {message.text}
    </div>
  )}
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  

  const [message, setMessage] = useState(null)


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
      setMessage({type: 'error', text: 'Wrong username or password'})
      console.log('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000);
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

  const handleCreate = async (newBlogObject) => {
    try {
      const newblog = await blogService.create(newBlogObject)
      console.log(`create ${newblog.title}`);
      
      setBlogs(blogs.concat(newblog))
      blogFormRef.current.toggleVisibility()
      setMessage({type: 'success', text: `a new blog ${newblog.title} by ${newblog.author}added`})
      setTimeout(() => {
        setMessage(null)
      }, 5000);

    } catch (error) {
      console.log(error);
      setMessage({type: 'error', text: error.response.data.error})
      setTimeout(() => {
        setMessage(null)
      }, 5000);
    }
    
  }

  const blogFormRef = useRef()

  const createForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={handleCreate}/>
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        {loginForm()}
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <div><p>{user.name} logged in <button onClick={handleLogOut}>log out</button></p></div>
      {createForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App