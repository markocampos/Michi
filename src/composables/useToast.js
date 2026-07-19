import { reactive } from 'vue';

const toasts = reactive([]);
let nextId = 0;

export function useToast() {
  function show(message, type = 'success', duration = 2500) {
    const id = nextId++;
    toasts.push({ id, message, type, leaving: false });
    setTimeout(() => dismiss(id), duration);
  }

  function dismiss(id) {
    const idx = toasts.findIndex(t => t.id === id);
    if (idx !== -1) toasts.splice(idx, 1);
  }

  return {
    toasts,
    showToast: show,
    success: (msg, dur) => show(msg, 'success', dur),
    info: (msg, dur) => show(msg, 'info', dur),
    warning: (msg, dur) => show(msg, 'warning', dur),
    dismiss,
  };
}
