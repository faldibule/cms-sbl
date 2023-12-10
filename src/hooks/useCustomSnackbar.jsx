import { useSnackbar } from 'notistack';

const useCustomSnackbar = () => {
    const { enqueueSnackbar: setSnackbar } = useSnackbar();
    
    const success = (string, variant = 'success') => {
        setSnackbar(string, { variant })
    }
    const failed = (string, variant = 'error') => {
        setSnackbar(string, { variant })
    }

    return {
        success,
        failed
    }
}

export default useCustomSnackbar