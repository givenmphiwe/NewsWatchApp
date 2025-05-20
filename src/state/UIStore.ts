import { makeAutoObservable } from "mobx";

class UIStore {
  otp: string = "";
  isLoading: boolean = false;
  categories: string = "Popular";

  constructor() {
    makeAutoObservable(this);
  }

  // OTP methods
  setOtp(value: string) {
    this.otp = value;
  }

  clearOtp() {
    this.otp = "";
  }

  // Category methods
  setCategory(value: string) {
    this.categories = value;
  }

  clearCategory() {
    this.categories = "";
  }

  // Loader methods
  showLoader() {
    this.isLoading = true;
  }
  hideLoader() {
    this.isLoading = false;
  }
}

export default UIStore;
