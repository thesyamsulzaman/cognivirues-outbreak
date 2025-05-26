type DisclosureCallbacks = {
  onOpen?: () => void;
  onClose?: () => void;
};

export class Disclosure {
  private _isOpen: boolean;
  private readonly onOpen?: () => void;
  private readonly onClose?: () => void;

  constructor(initial: boolean = false, callbacks: DisclosureCallbacks = {}) {
    this._isOpen = initial;
    this.onOpen = callbacks.onOpen;
    this.onClose = callbacks.onClose;
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  open(): void {
    if (!this._isOpen) {
      this.onOpen?.();
      this._isOpen = true;
    }
  }

  close(): void {
    if (this._isOpen) {
      this.onClose?.();
      this._isOpen = false;
    }
  }

  toggle(): void {
    this._isOpen ? this.close() : this.open();
  }
}
