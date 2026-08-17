import { Timestamp } from "firebase/firestore";

import type { CreateGroup, Group } from "../types/group.types";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  updateDocument,
} from "./utils";

const GROUPS_COLLECTION = "Groups";

function getGroupsCollection(courseId: string) {
  return ["Courses", courseId, GROUPS_COLLECTION];
}

const getGroups = async (courseId: string) =>
  listDocuments<Group>(getGroupsCollection(courseId));

const getGroup = async (courseId: string, id: string) =>
  getDocument<Group>(getGroupsCollection(courseId), id);

const addGroup = async (group: CreateGroup) =>
  createDocument<Group, CreateGroup>(getGroupsCollection(group.courseId), group, {
    createdAt: Timestamp.now(),
  });

const updateGroup = async (
  courseId: string,
  id: string,
  group: Partial<CreateGroup>,
) =>
  updateDocument<Group>(getGroupsCollection(courseId), id, group, {
    updatedAt: Timestamp.now(),
  });

const deleteGroup = async (courseId: string, id: string) =>
  deleteDocument(getGroupsCollection(courseId), id);

export { addGroup, deleteGroup, getGroup, getGroups, updateGroup };
