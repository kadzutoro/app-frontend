import axios from 'axios';
import toast from 'react-hot-toast';

export const sendDataEmail = async (data, token) => {
    try {
        await axios.post('/users/need-help', data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        }); toast.success('Successfully sent!');
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Oops. Something went wrong.';
    toast.error(`Error: ${errorMessage}`);
    }
}