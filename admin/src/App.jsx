import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  )
}

export default App