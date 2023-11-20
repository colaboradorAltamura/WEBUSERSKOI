import { useContext } from 'react';
import { CurrentUserContext } from 'src/context/CurrentUserContext';

export const useCurrentUser = () => useContext(CurrentUserContext);
