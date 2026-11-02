import { calculateDeck } from './models.js';
const worker = globalThis as unknown as { onmessage: (event: MessageEvent) => void; postMessage: (data: unknown) => void };
worker.onmessage = (event: MessageEvent) => {
    try { worker.postMessage({ results: event.data.map(calculateDeck) }); }
    catch (error) { worker.postMessage({ error: error instanceof Error ? error.message : '计算失败。' }); }
};
