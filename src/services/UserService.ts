import firestore from '@react-native-firebase/firestore';

export const saveUserRole = async (uid: string, role: string) => {
  await firestore().collection('users').doc(uid).set(
    {
      role,
      createdAt: firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
};

export const getUserRole = async (uid: string): Promise<string | null> => {
  const doc = await firestore().collection('users').doc(uid).get();
  return doc.exists() ? (doc.data()?.role as string) : null;
};
