export type KeyboardMenuOption = {
  label: string;
  description: string;
  disabled?: boolean;
  handler?: () => void;
  children?: Array<KeyboardMenuOption>;
  right?: any;
};

export class KeyboardMenu {
  options: Array<KeyboardMenuOption>;
  prevFocus: null;

  constructor() {
    this.options = [];
    this.prevFocus = null;
  }

  setOptions(options: Array<any>) {
    this.options = options;
  }
}
