/* eslint-disable @typescript-eslint/no-unused-vars */
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';

import { db } from 'src/configs/firebase';

export const subscribeToCollection = function ({ path, queryConditions, onUpdate, onError }) {
  let firestoreQueryConditions = null;

  if (queryConditions) {
    firestoreQueryConditions = queryConditions.map((qc) => {
      return where(qc.key, qc.operator, qc.value);
    });
  }

  // const q = query(collection(db, path), where('state', '==', 1));
  let q = null;

  if (firestoreQueryConditions) q = query(collection(db, path), ...firestoreQueryConditions);
  else q = query(collection(db, path));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });

      // eslint-disable-next-line no-console
      console.log(`ON UPDATE ${path}`);

      onUpdate(items);
    },
    (e) => {
      onError(e);
    }
  );

  return unsubscribe;
};
