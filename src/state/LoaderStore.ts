import { makeAutoObservable } from "mobx";

class LoaderStore {
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  showLoader() {
    this.isLoading = true;
  }

  hideLoader() {
    this.isLoading = false;
  }
}

const loaderStore = new LoaderStore();
export default loaderStore;
