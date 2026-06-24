import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  togglePin
} from '../store/memorySlice';

export default function useMemory() {
  const dispatch = useDispatch();
  const memoryState = useSelector((state) => state.memory);

  const loadMemories = (grouped) => dispatch(fetchMemories(grouped));
  const saveMemory = (data) => dispatch(createMemory(data)).unwrap();
  const editMemory = (id, data) => dispatch(updateMemory({ id, data })).unwrap();
  const removeMemory = (id) => dispatch(deleteMemory(id)).unwrap();
  const pin = (id) => dispatch(togglePin(id)).unwrap();

  return {
    ...memoryState,
    fetchMemories: loadMemories,
    createMemory: saveMemory,
    updateMemory: editMemory,
    deleteMemory: removeMemory,
    togglePin: pin
  };
}