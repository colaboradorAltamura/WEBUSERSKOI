import { useContext } from 'react';
import { DynamicsContext } from 'src/context/DynamicsContext';

export const useDynamics = () => useContext(DynamicsContext);
