/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Staff Portal password. Bundled into the client, so it is not a real secret. */
  readonly VITE_ADMIN_PASSWORD?: string;
}
