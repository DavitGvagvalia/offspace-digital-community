import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";


const Students = collection(db, "Students");


