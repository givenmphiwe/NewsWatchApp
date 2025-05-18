import UIStore from './UIStore';

class RootStore {
  uiStore: UIStore;

  constructor() {
    this.uiStore = new UIStore();
  }
}

const rootStore = new RootStore();
export default rootStore;