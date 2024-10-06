import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'chai'

// eslint-disable-next-line no-undef
describe('<Blog />', () => {
  let container
  beforeEach(() => {
    const blog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 6,
      user: {
        username: 'hellas',
        name: 'Arto Hellas',
        id: '66fd3fd703259e7e1138191e'
      },
      id: '66fe2df19d7607b1a022ed8e'
    }
    container = render(
      <Blog blog={blog}/>
    ).container
  })

  test('the blog\'s title is rendered', () => {
    const element = screen.getByText('Go To Statement Considered Harmful', { exact: false })
    expect(element).toBeDefined()
  })

  test('the blog\'s author is rendered', () => {
    const element = screen.getByText('Edsger W. Dijkstra', { exact: false })
    expect(element).toBeDefined()
  })

  test('the blog\'s URL or number of likes are not rendered by default', () => {
    const div = container.querySelector('.blogDetails')
    expect(div).toHaveStyle('display: none')
  })
})