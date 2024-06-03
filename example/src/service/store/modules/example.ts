import { defineStore } from 'pinia';

interface ExampleState {
  count: number;
}

export const useExampleStore = defineStore({
	id: 'example',
  state: (): ExampleState => ({
    count: 0
  }),
  getters: {
    getDoubleCount(): number {
      return this.count * 2
		}
  },
	actions: {
		setCount(count: number): void {
			this.count = count
		}
	},
  persist: true
})
