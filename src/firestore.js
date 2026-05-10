import { app } from "./firebase.js";
import { getFirestore } from "firebase/firestore";

export const db = getFirestore(app);
