import { useState} from "react"

const Blog = ({blog}) => {
  const [detailVisible, setDetailVisible] = useState(false)
  const hideWhenVisble = {display: detailVisible ? 'none' : ''}
  const showWhenVisble = {display: detailVisible ? '' : 'none'}

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setDetailVisible(!detailVisible)
  }

  return(
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button style={hideWhenVisble} onClick={toggleVisibility}>view</button>
        <button style={showWhenVisble} onClick={toggleVisibility}>hide</button>
      </div>
      <div style={showWhenVisble}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button>like</button></div>
        <div>{blog.user.name}</div>
      </div>
    </div>
  )
}

export default Blog