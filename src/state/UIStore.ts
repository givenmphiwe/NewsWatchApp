import { makeAutoObservable } from "mobx";

class UIStore {
  otp: string = "";
  isLoading: boolean = false;
  categories: string = "Popular";
  newsCache: Record<string, any[]> = {};

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
  //caching the news
  setNewsForCategory(category: string, articles: any[]) {
    this.newsCache[category] = articles;
  }

  getNewsForCategory(category: string): any[] {
    return this.newsCache[category] || [];
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
