import { app } from './firebase'
import { getFirestore, collection, query, getDocs, orderBy, limit, addDoc, updateDoc, deleteDoc, doc, where } from "firebase/firestore";
import moment from 'moment';

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export async function createExpense(data) {
  try {
    const docRef = await addDoc(collection(db, "expenses"), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
}

export async function getExpensesForMonth(dte) {
  console.log(dte);
  try {
    const [day, month, year] = dte.split('/');
    const startOfMonth = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
    const endOfMonth = moment(startOfMonth).endOf('month');

    const expensesQuery = query(collection(db, "expenses"));
    const querySnapshot = await getDocs(expensesQuery);

    const expenses = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(expense => {
        console.log(expense);
        const expenseDate = moment(expense.date, 'DD/MM/YYYY');
        const expenseDelectedDate = moment(expense.delectedDate, 'DD/MM/YYYY');
        const delectedType = expense.delectedType
        let isMonth = expenseDate.isSameOrAfter(startOfMonth) && expenseDate.isSameOrBefore(endOfMonth);
        let isFixed = expense.repeat && expense.repeat.value == 3; // Verifica se repeat existe
        let isNextDeleted = delectedType == '2' && expenseDelectedDate.isSameOrBefore(endOfMonth);
        let isDeletedOters = delectedType == '1' && expenseDate.isSameOrBefore(endOfMonth) && expenseDate.isSameOrAfter(startOfMonth)
        if (isFixed) {
          if (!isNextDeleted && !isDeletedOters) {
            return expense
          }
        } else if (isMonth) {
          return expense
        }
      });

    return expenses;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
}

export async function updateExpense(expenseId, updatedData) {
  try {
    console.log(expenseId)
    const expenseRef = doc(db, "expenses", expenseId);
    await updateDoc(expenseRef, updatedData);
    console.log("Document updated with ID: ", expenseId);
    return true;
  } catch (e) {
    console.error("Error updating document: ", e);
    return false;
  }
}

export async function deleteExpense(expenseId) {
  try {
    const expenseRef = doc(db, "expenses", expenseId);
    await deleteDoc(expenseRef);
    console.log("Document deleted with ID: ", expenseId);
    return true;
  } catch (e) {
    console.error("Error deleting document: ", e);
    return false;
  }
}

export async function getExpense(key, value) {
  try {
    // Cria a query para buscar documentos onde key = value
    const expensesQuery = query(
      collection(db, "expenses"),
      where(key, "==", value)
    );

    const querySnapshot = await getDocs(expensesQuery);

    const expenses = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }));

    return expenses;
  } catch (error) {
    console.error(error);
    return [];
  }
}
