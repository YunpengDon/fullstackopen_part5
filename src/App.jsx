import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App