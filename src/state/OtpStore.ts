import { makeAutoObservable } from "mobx";

class OtpStore {
  otp: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setOtp(value: string) {
    this.otp = value;
  }

  clearOtp() {
    this.otp = "";
  }
}

const otpStore = new OtpStore();
export default otpStore;
