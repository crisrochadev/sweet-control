import { app, userAuth } from './firebase'
import { getFirestore, collection, query, getDocs, orderBy, getDoc, limit, addDoc, updateDoc, deleteDoc, doc, where, disableNetwork, enableNetwork } from "firebase/firestore";
import moment from 'moment';



// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export async function createExpense(data) {
  try {
    const user = await userAuth()
    data.userid = user.uid; // Adiciona o userid ao documento
    const docRef = await addDoc(collection(db, "expenses"), data);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
}

export async function createWallet(data) {
  try {
    const user = await userAuth()
    data.userid = user.uid; // Adiciona o userid ao documento
    const docRef = await addDoc(collection(db, "wallets"), data);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
}

export async function createSafe(data) {
  try {
    const user = await userAuth()
    data.userid = user.uid; // Adiciona o userid ao documento
    const docRef = await addDoc(collection(db, "safes"), data);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
}

export async function getDefaultWallet() {
  try {
    const user = await userAuth()
    const res = await getDocs(query(collection(db, "wallets"), where('default', '==', true), where('userid', '==', user.uid)));
    let wallet = {};
    res.forEach(doc => {
      wallet = doc.data();
      wallet['id'] = doc.id;
    });

    return wallet;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getWallet(id) {
  try {
    const user = await userAuth()
    const docRef = doc(db, "wallets", id);
    const res = await getDoc(docRef);

    if (res.exists() && res.data().userid === user.uid) {
      let wallet = res.data();
      wallet['id'] = res.id;
      return wallet;
    } else {
      return {};
    }
  } catch (error) {
    console.error(error);
    return {};
  }
}
export async function getWallets() {
  try {
    const user = await userAuth()
    const res = await getDocs(query(collection(db, "wallets"), where('userid', '==', user.uid)));

    let wallets = res.docs.map((doc) => {
      let walletData = { ...doc.data() } // Criação explícita do objeto
      walletData['id'] = doc.id;
      return walletData;
    });

    return wallets;
  } catch (error) {
    console.error(error);
    return [];
  }
}
export async function getSafes(wallet) {
  try {
    const user = await userAuth()
    const res = await getDocs(query(collection(db, "safes"), where('userid', '==', user.uid), where('walletid' , '==' , wallet)));


    let safes = res.docs.map((doc) => {
      let safeData = { ...doc.data() } // Criação explícita do objeto

      safeData['id'] = doc.id;
      if(safeData.value) safeData['value'] = Number(safeData.value.replace(',', '.'));
      return safeData;
    });

    return safes;
  } catch (error) {
    console.error(error);
    return [];
  }
}


export async function getExpensesForMonth(dte,  walletId) {
  try {

    const user = await userAuth()
    const [day, month, year] = dte.split('/');
    const startOfMonth = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
    const endOfMonth = moment(startOfMonth).endOf('month');

    // Referência da coleção de despesas
    let expensesQuery = collection(db, "expenses");

    // Aplicar os filtros de tipo e carteira
    let filters = [where('userid', '==', user.uid)];

    if (walletId) {
      filters.push(where('wallet', '==', walletId));
    }

    // Aplicar os filtros ao query
    expensesQuery = query(expensesQuery, ...filters);

    const querySnapshot = await getDocs(expensesQuery);

    const expenses = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(expense => {
        const expenseDate = moment(expense.date, 'DD/MM/YYYY');
        const expenseDelectedDate = moment(expense.delectedDate, 'DD/MM/YYYY');
        const delectedType = expense.delectedType;
        let isMonth = expenseDate.isSameOrAfter(startOfMonth) && expenseDate.isSameOrBefore(endOfMonth);
        let isFixed = expense.repeat && expense.repeat.value == 3; // Verifica se repeat existe
        let isNextDeleted = delectedType == '2' && expenseDelectedDate.isSameOrBefore(endOfMonth);
        let isDeletedOters = delectedType == '1' && expenseDate.isSameOrBefore(endOfMonth) && expenseDate.isSameOrAfter(startOfMonth);

        if (isFixed) {
          if (!isNextDeleted && !isDeletedOters) {
            return expense;
          }
        } else if (isMonth) {
          return expense;
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
    const expenseRef = doc(db, "expenses", expenseId);
    await updateDoc(expenseRef, updatedData);
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
    await disableNetwork(db);
    setTimeout(async () => await enableNetwork(db) , 500)
    ;
    return true;
  } catch (e) {
    console.error("Error deleting document: ", e);
    return false;
  }
}

export async function getExpense(key, value) {
  try {
    const user = await userAuth()
    // Cria a query para buscar documentos onde key = value e userid = user.uid
    const expensesQuery = query(
      collection(db, "expenses"),
      where(key, "==", value),
      where('userid', '==', user.uid)
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
