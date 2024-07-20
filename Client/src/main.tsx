
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import {store} from './store.ts'


ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store = {store}>
    <BrowserRouter>
    <App/>
    <Toaster/>
    </BrowserRouter>
    </Provider>
)
