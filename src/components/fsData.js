import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  doc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query,
  where,
  getDoc 
} from "firebase/firestore";

// ...existing Group Operations code...

export async function getPCs() {
  const pcCollection = collection(db, "PC");
  const pcSnapshot = await getDocs(pcCollection);
  return pcSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function updatePCStatus(pcId, status, currentUser) {
  const pcRef = doc(db, "PC", pcId);
  return await updateDoc(pcRef, {
    status,
    currentUser,
    since: new Date()
  });
}

export async function addPC(groupId, pcData = {}) {
  const pcCollection = collection(db, "PC");
  const groupDocRef = doc(db, "Group", groupId);
  return await addDoc(pcCollection, {
    name: pcData.name || "PC Name",
    status: pcData.status || "available",
    group_id: groupDocRef,
    currentUser: pcData.currentUser || "",
    since: pcData.since || new Date(),
    verbose_name: pcData.verbose_name || "Verbose Name",
    verbose_name_plural: pcData.verbose_name_plural || "Verbose Names"
  });
}

// ...existing remaining code...
