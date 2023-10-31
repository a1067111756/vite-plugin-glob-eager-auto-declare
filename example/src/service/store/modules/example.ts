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
		setCount(): void {
			this.count = this.count + 1
		}
	}
})
