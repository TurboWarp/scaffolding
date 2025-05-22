/// <reference path="./node_modules/@turbowarp/types/index.d.ts" />

declare module "@turbowarp/scaffolding" {
  class Scaffolding {
    width: number;
    height: number;
    resizeMode: "preserve-ratio" | "dynamic-resize" | "stretch";
    editableLists: boolean;
    shouldConnectPeripherals: boolean;
    usePackagedRuntime: boolean;
    appendTo(element: HTMLElement): void;
    relayout(): void;
    setup(): void;
    setUsername(username: string): void;
    loadProject(project: ArrayBuffer | Uint8Array): Promise<void>;
    start(): void;
    greenFlag(): void;
    stopAll(): void;
    vm: import('scratch-vm');
  }
}
