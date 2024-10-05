import { useState, forwardRef, useImperativeHandle} from "react"

const Togglable = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)
    const hideWhenVisble = {display: visible ? 'none' : ''}
    const showWhenVisble = {display: visible ? '' : 'none'}

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(ref, () => {
        return {toggleVisibility}
    })

    return(
        <div>
          <div style={hideWhenVisble}>
            <button onClick={toggleVisibility}>{props.buttonLabel}</button>
          </div>
          <div style={showWhenVisble}>
            {props.children}
            <button onClick={toggleVisibility}>cancel</button>
          </div>
          </div>
    )
})

export default Togglable