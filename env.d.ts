// env.d.ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<
    Record<string, never>, // Props (пустой объект по умолчанию)
    Record<string, never>, // RawBindings (данные)
    unknown, // Data type
    Record<string, never>, // Computed
    Record<string, never>, // Methods
    Record<string, never>, // Mixins
    Record<string, never>, // Extends
    Record<string, never> // Emits
  >
  export default component
}
