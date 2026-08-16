import { db } from "../../firebase.js";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";


const Courses = collection(db, "Courses");

const getCourse = async (id: string) => {
    const docRef = doc(Courses, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null;
    }
};


const getCourses = async () => {
    const querySnapshot = await getDocs(Courses);
    const courses: any[] = [];
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        courses.push({ id: doc.id, ...doc.data() });
    });

    if (courses.length === 0) {
        console.log("No courses!");
        return null;
    }

    return courses;

};


const getPrivateStudents = async (courseId: string) => {
    const privateStudents = collection(db, courseId, "PrivateStudents");
    const querySnapshot = await getDocs(privateStudents);
    const students: any[] = [];
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        students.push({ id: doc.id, ...doc.data() });
    });
    return students;

}


const getPrivateStudent = async (courseId: string,studentId: string) => {
    const docRef = doc(db,"Courses",courseId,"PrivateStudents",studentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    console.log(docSnap.data());
    return null;
};




export { getCourse, getCourses, getPrivateStudents, getPrivateStudent };