import { makeAutoObservable } from "mobx";

class UIStore {
  categories: string = "Popular";
  selectedArticle: any = null;

  constructor() {
    makeAutoObservable(this);
  }
  // Category methods
  setCategory(value: string) {
    this.categories = value;
  }

  clearCategory() {
    this.categories = "";
  }
  //Selected Article
  setSelectedArticle(article: any) {
    this.selectedArticle = article;
  }

  clearSelectedArticle() {
    this.selectedArticle = null;
  }
}

export default UIStore;
