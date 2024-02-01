import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const toastErrorMessage = (e) => {
  try {
    e.json().then(errorData => {
      console.log(errorData);
      const message = errorData.detail
      toast.error('Sorry, an error occurred:\n' + message, {
        hideProgressBar: true,
        theme: "colored",
      });
    }); 
  } catch (e) {
    toast.error('Sorry, an error occurred.', {
      hideProgressBar: true,
      theme: "colored",
    });
  }
}
