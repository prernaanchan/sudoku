import { ref, computed, onScopeDispose } from 'vue'

export function useTimer() {
  const elapsed = ref(0)
  let intervalId: ReturnType<typeof setInterval> | null = null

  function start() {
    if (intervalId) return
    intervalId = setInterval(() => { elapsed.value++ }, 1000)
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function reset() {
    stop()
    elapsed.value = 0
  }

  const formatted = computed(() => {
    const m = Math.floor(elapsed.value / 60).toString().padStart(2, '0')
    const s = (elapsed.value % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  })

  onScopeDispose(() => stop())

  return { elapsed, formatted, start, stop, reset }
}
