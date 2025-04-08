import { contextBridge } from 'electron';

// Ejemplo básico
contextBridge.exposeInMainWorld('api', {
  sayHello: () => console.log("Hello from Electron!")
});
