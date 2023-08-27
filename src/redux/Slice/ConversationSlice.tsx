import { createSlice } from "@reduxjs/toolkit";

interface State {
  conversations: any[] | [null];
  currentConversation: object | null;
  currentConversationId: string | null;

  message: any;
  messages: any[];
}

const initialState: State = {
  conversations: [null],
  currentConversation: null,
  currentConversationId: null,

  message: null,
  messages: [],
};

const messageSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    SetConversations: (state, action) => {
      return { ...state, conversations: action.payload.conversations };
    },
    AddConversations: (state, action) => {
      return {
        ...state,
        conversations: [...state.conversations, action.payload.conversation],
      };
    },
    SetCurrentConversation: (state, action) => {
      return {
        ...state,
        currentConversation: action.payload.conversation,
      };
    },
    SetMessages: (state, action) => {
      return { ...state, messages: action.payload.messages };
    },
    SetMessage: (state, action) => {
      return { ...state, message: action.payload.message };
    },
  },
});

export const {
  SetConversations,
  SetCurrentConversation,
  SetMessages,
  AddConversations,
  SetMessage,
} = messageSlice.actions;
export default messageSlice.reducer;
