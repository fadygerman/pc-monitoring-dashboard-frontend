
import { db } from "./firebase";
import { collection, addDoc, doc } from "firebase/firestore";

export async function addGroup() {
  const groupCollection = collection(db, "Group");
  return await addDoc(groupCollection, {
    name: "Group Name",
    ordering: 1,
    verbose_name: "Verbose Name",
    verbose_name_plural: "Verbose Names"
  });
}

export async function addPC(groupId) {
  const pcCollection = collection(db, "PC");
  const groupDocRef = doc(db, "Group", groupId);
  return await addDoc(pcCollection, {
    name: "PC Name",
    status: "available",
    group_id: groupDocRef,
    currentUser: "User Name",
    since: new Date(),
    verbose_name: "Verbose Name",
    verbose_name_plural: "Verbose Names"
  });
}