import { ChatControlPanel } from "../modules/control_panel/chat_control_panel";
import { ChatGptInteractor } from '../modules/interactors/chat_gpt/chat_gpt_interactor';
import { BingChatInteractor } from '../modules/interactors/bing_chat/bing_chat_interactor';

let controlPanel: ChatControlPanel

switch (true) {
    case window.location.href.includes('bing.com'):
        controlPanel = new ChatControlPanel(new BingChatInteractor())
        break;
    case window.location.href.includes('chat.openai.com'):
        controlPanel = new ChatControlPanel(new ChatGptInteractor())
        break;
}