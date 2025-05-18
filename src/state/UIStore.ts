import { makeAutoObservable } from "mobx";

class UIStore {
  otp: string = "";
  isLoading: boolean = false;
  isDrawerOpen: boolean = false;

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

  // Loader methods
  showLoader() {
    this.isLoading = true;
  }
  hideLoader() {
    this.isLoading = false;
  }

  // Drawer methods
  openDrawer() {
    this.isDrawerOpen = true;
  }
  closeDrawer() {
    this.isDrawerOpen = false;
  }
  
}

export default UIStore;