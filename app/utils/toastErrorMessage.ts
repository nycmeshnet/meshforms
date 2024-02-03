import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ErrorData {
  detail: string;
}

export const toastErrorMessage = (e: any) => {
  try {
    e.json().then((errorData: ErrorData) => {
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
