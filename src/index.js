import React from 'react'
import ReactDOM from "react-dom";
import Index from './Pages';
function App() {
    return(
        <h1 style={{ color: '#000'}}>hola</h1>
        
    )
}
if (document.getElementById('react_root')) {
    ReactDOM.render(<Index/>, document.getElementById('react_root'))
}