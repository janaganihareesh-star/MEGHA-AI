import { useSelector, useDispatch } from 'react-redux';
import {
  fetchVoiceConversations,
  fetchVoiceMessages,
  setCurrentConversation,
  clearVoice
} from '../store/voiceSlice';

export default function useVoice() {
  const dispatch = useDispatch();
  const voiceState = useSelector((state) => state.voice);

  const loadVoiceConversations = () => dispatch(fetchVoiceConversations());
  const loadVoiceMessages = (id) => dispatch(fetchVoiceMessages(id));
  const selectVoiceConversation = (conv) => dispatch(setCurrentConversation(conv));
  const resetVoice = () => dispatch(clearVoice());

  return {
    ...voiceState,
    fetchConversations: loadVoiceConversations,
    fetchMessages: loadVoiceMessages,
    setCurrentConversation: selectVoiceConversation,
    clearVoice: resetVoice
  };
}