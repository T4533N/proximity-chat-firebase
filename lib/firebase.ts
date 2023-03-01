import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7np738uwZWm_o_UPefW4FWsVmK4JJ2BE",
  authDomain: "proximity-chat-1bb86.firebaseapp.com",
  projectId: "proximity-chat-1bb86",
  storageBucket: "proximity-chat-1bb86.appspot.com",
  messagingSenderId: "330770193858",
  appId: "1:330770193858:web:8a52d0f1661a2def258a5b",
  measurementId: "G-EJ8RGE33LK",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function sendMessage(roomId: string, displayName: string, text: string) {
  try {
    await addDoc(collection(db, "chat-rooms", roomId, "messages"), {
      displayName: displayName,
      text: text.trim(),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
}

function getMessages(roomId: string, callback: (message: any) => void) {
  return onSnapshot(
    query(
      collection(db, "chat-rooms", roomId, "messages"),
      orderBy("timestamp", "asc")
    ),
    (querySnapshot) => {
      const messages = querySnapshot.docs.map((x) => ({
        id: x.id,
        ...x.data(),
      }));

      callback(messages);
    }
  );
}

export { sendMessage, getMessages };
