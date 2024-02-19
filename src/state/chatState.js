import { signal } from "@preact/signals-react";
import {v4} from 'uuid';

export const chatIsWaitingForResponse = signal(false);
export const chatLoadingMessageId = signal("");
export const chatReceiveChatMessage = signal(null);
export const chatClear = signal(false);
export const chatSessionId = signal(v4());
export const showAuthModal = signal(false);
export const userChatsCount = signal(0);
export const isGuestUser = signal(true);
export const loggedInUser = signal(null);
export const chatSessions = signal(null);