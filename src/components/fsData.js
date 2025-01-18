import { db } from "..firebase";
import { 
  collection, 
  addDoc, 
  doc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query,
  where,
  getDoc // Import getDoc
} from "firebase/firestore";

// Group Operations
export async function addGroup(groupData = {}) {
  const groupCollection = collection(db, "Group");
  return await addDoc(groupCollection, {
    name: groupData.name || "Group Name",
    ordering: groupData.ordering || 1,
    verbose_name: groupData.verbose_name || "Verbose Name",
    verbose_name_plural: groupData.verbose_name_plural || "Verbose Names"
  });
}

export async function getGroups() {
  const groupCollection = collection(db, "Group");
  const groupSnapshot = await getDocs(groupCollection);
  return groupSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// PC Operations
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

export async function getPCsByGroup(groupId) {
  const pcCollection = collection(db, "PC");
  const groupRef = doc(db, "Group", groupId);
  const q = query(pcCollection, where("group_id", "==", groupRef));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function deletePC(pcId) {
  const pcRef = doc(db, "PC", pcId);
  return await deleteDoc(pcRef);
}

export async function getPCById(pcId) {
  const pcRef = doc(db, "PC", pcId);
  const pcDoc = await getDoc(pcRef);
  if (pcDoc.exists()) {
    return { id: pcDoc.id, ...pcDoc.data() };
  } else {
    throw new Error("PC not found");
  }
}