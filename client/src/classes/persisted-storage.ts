export class PersistedStorage {
  name: string;

  constructor({ name }) {
    this.name = name;
  }

  get() {
    const storedEntries = window.localStorage.getItem(this.name);
    return storedEntries ? JSON.parse(storedEntries) : [];
  }

  save(entries: any) {
    window.localStorage.setItem(this.name, JSON.stringify(entries));
  }
}
