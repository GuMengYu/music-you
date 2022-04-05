import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Test',
  setup() {
    return () => (
      <div>
        <h1>Test</h1>
        <p>This is a test component</p>
      </div>
    )
  }
})