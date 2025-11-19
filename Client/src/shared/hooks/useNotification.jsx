// hook para mostrar notificaciones con toastify
// en el app.jsx esta el toastContainer

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Ejemploz de uso!
//   notify('todo viento!', 'success')  
//   notify('malardo!', 'error')
//   notify('RED LIGHT!', 'warning')
//   notify('you computer has virus!', 'info')

const useNotification = () => {
  const notify = (message, type = 'default', options = {}) => {
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast.warn(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      default:
        toast(message, options);
    }
  };
  

  return notify ;
};

export default useNotification;