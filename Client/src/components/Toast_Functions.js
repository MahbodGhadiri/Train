import { toast } from 'react-toastify';

const toast_default_options =
{
    position: "top-right",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    autoClose: 5000,
    hideProgressBar: true,
}

const toast_error_options =
{
    position: "top-right",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    autoClose: 5000,
    hideProgressBar: true,
    id:"error"
}

const toast_info_options =
{
    position: "top-right",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    autoClose: false,
    hideProgressBar: true,
}

export const showSuccess = (axiosResponse) => 
{
    if(axiosResponse.data)
        toast.success(axiosResponse.data.message, toast_default_options);
    else
        toast.success("انجام شد", toast_default_options);
}
export const showError = (axiosError) => 
{
    if(axiosError.response)
    {
        if(axiosError.response.data)
            toast.error(axiosError.response.data.message, toast_error_options);
        else
            toast.error("خطایی رخ داد!", toast_default_options);
    }else
        toast.error("خطایی رخ داد!", toast_default_options);
}

export const showInfo = (axiosResponse) => toast.info(axiosResponse.data.message,toast_info_options );
 