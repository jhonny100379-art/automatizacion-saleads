import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';

const stepTimeoutMs = parseInt(process.env.STEP_TIMEOUT_MS || '60000', 10);
setDefaultTimeout(stepTimeoutMs); // 60 s por defecto (p. ej. selección de idioma + pausa)

Before(async function () {
  await this.init();
});

After(async function () {
  const segundos = parseInt(process.env.PAUSE_AFTER_SECONDS || '0', 10);
  if (segundos > 0) {
    await new Promise((r) => setTimeout(r, segundos * 1000));
  }
  await this.close();
});
