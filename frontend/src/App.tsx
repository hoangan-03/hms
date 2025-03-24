import 'react-toastify/ReactToastify.css';

import {RouterProvider} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';

import router from './routes';

function App() {
    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer position='top-left' autoClose={2000} />
        </>
    );
}

export default App;
