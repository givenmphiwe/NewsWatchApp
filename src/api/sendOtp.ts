import axios from 'axios';

export async function sendOtp(email: string) {
  try {
    const response = await axios.post("https://otp-server-rho.vercel.app/send-otp", {
      email,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Unexpected error occurred";
    throw new Error(message);
  }
}
