import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  name: 'create-chrome-ext',
  description: '',
  version: '0.0.0',
  manifest_version: 3,
  icons: {
    '16': 'img/logo-16.png',
    '32': 'img/logo-34.png',
    '48': 'img/logo-48.png',
    '128': 'img/logo-128.png',
  },
  action: {
    default_popup: 'src/popup/index.html',
    default_icon: 'img/logo-48.png',
  },
  options_page: 'src/options/index.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://chat.openai.com/*', 'https://www.bing.com/*'],
      js: ['src/content/index.ts'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
  permissions: [
    "tabs",
  ],
  commands: {
    start_stop_speech_recognizing: {
      suggested_key: {
        default: "Alt+Up",
      },
      description: "Start/Stop speech recognizing."
    },
    stop_speech_recognizing_and_send: {
      suggested_key: {
        default: "Alt+Right",
      },
      description: "Stop speech recognizing and send."
    },
    stop_speech_recognizing: {
      suggested_key: {
        default: "Alt+Left",
      },
      description: "Stop speech recognizing."
    },
  },
})
