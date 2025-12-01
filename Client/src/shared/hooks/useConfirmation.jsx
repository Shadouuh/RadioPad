import { toast } from 'react-toastify'; 
//el css se puede mejorar
import './css/useConfirmation.css';

const useConfirmation = () => {
  const confirm = (message, onConfirm, onCancel) => {
    toast.warning(
      ({ closeToast }) => (
        <div className="confirm-toast">
          <p>{message}</p>
          <div className="confirm-buttons">
            <button
              className="btn btn-danger"
              onClick={() => {
                closeToast();
                onConfirm();
              }}
            >
              Confirmar
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                closeToast();
                if (onCancel) onCancel();
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  return confirm;
};

export default useConfirmation;