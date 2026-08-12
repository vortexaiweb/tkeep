import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';

// Real Firebase configuration for tkeep-cfdad
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD17ubRJ7KtP2YMQTfIz0UxB7DjY_XxHko",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tkeep-cfdad.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tkeep-cfdad",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tkeep-cfdad.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1006028062915",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1006028062915:web:5cf894bbd00d43c33ca276",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1CLYLVJEJB"
};

let app, db, auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (e) {
  console.warn("Firebase initialization warning:", e);
}

export { db, auth };

// Demo Categories for Seeding
const DEMO_CATEGORIES = [
  { id: 'cat_services', name: 'Услуги', icon: '🛠️', sortOrder: 1 },
  { id: 'cat_electronics', name: 'Электроника', icon: '📱', sortOrder: 2 },
  { id: 'cat_auto', name: 'Авто и Запчасти', icon: '🚗', sortOrder: 3 },
  { id: 'cat_home', name: 'Дом и Сад', icon: '🏠', sortOrder: 4 }
];

// Initial Demo Items (STRICTLY EMPTY)
const DEMO_ITEMS = [];

// LocalStorage Helper for offline fallback
const getLocalData = (key, defaultVal) => {
  try {
    const data = localStorage.getItem(`tkeep_${key}`);
    return data ? JSON.parse(data) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setLocalData = (key, value) => {
  try {
    localStorage.setItem(`tkeep_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Error writing to localStorage", e);
  }
};

// Seed Initial Data to Firestore
export const seedInitialData = async () => {
  if (db) {
    try {
      const catSnap = await getDocs(collection(db, 'categories'));
      if (catSnap.empty) {
        for (const cat of DEMO_CATEGORIES) {
          await setDoc(doc(db, 'categories', cat.id), {
            name: cat.name,
            icon: cat.icon,
            sortOrder: cat.sortOrder,
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (err) {
      console.warn("Firestore categories seed fallback:", err);
    }
  }

  try {
    if (!localStorage.getItem('tkeep_categories')) {
      setLocalData('categories', DEMO_CATEGORIES);
    }
    if (!localStorage.getItem('tkeep_items')) {
      setLocalData('items', []);
    }
  } catch (e) {
    console.warn("LocalStorage seed access restricted:", e);
  }
};

// SUBSCRIBE / FETCH CATEGORIES (Realtime Cloud Sync)
export const subscribeCategories = (callback) => {
  if (db) {
    const q = query(collection(db, 'categories'), orderBy('sortOrder', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (categories.length > 0) {
        callback(categories);
        setLocalData('categories', categories);
      } else {
        callback(getLocalData('categories', DEMO_CATEGORIES));
      }
    }, (err) => {
      console.warn("Firestore categories realtime listener fallback:", err);
      callback(getLocalData('categories', DEMO_CATEGORIES));
    });
  } else {
    callback(getLocalData('categories', DEMO_CATEGORIES));
    return () => {};
  }
};

// SUBSCRIBE / FETCH ITEMS (Realtime Cloud Sync across ALL users globally)
export const subscribeItems = (callback, isAdmin = false) => {
  if (db) {
    const colRef = collection(db, 'items');
    const q = isAdmin ? query(colRef, orderBy('createdAt', 'desc')) : query(colRef, where('status', '==', 'active'));
    
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(items);
      setLocalData('items', items);
    }, (err) => {
      console.warn("Firestore items realtime listener fallback:", err);
      const local = getLocalData('items', []);
      callback(isAdmin ? local : local.filter(i => i.status === 'active'));
    });
  } else {
    const local = getLocalData('items', []);
    callback(isAdmin ? local : local.filter(i => i.status === 'active'));
    return () => {};
  }
};

// CATEGORY CRUD
export const addCategoryItem = async (categoryData) => {
  const newId = `cat_${Date.now()}`;
  const payload = {
    id: newId,
    name: categoryData.name,
    icon: categoryData.icon || '📦',
    sortOrder: Number(categoryData.sortOrder) || 1,
    createdAt: new Date().toISOString()
  };

  if (db) {
    try {
      await setDoc(doc(db, 'categories', newId), {
        ...payload,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Firestore addCategory error:", e);
    }
  }

  const local = getLocalData('categories', DEMO_CATEGORIES);
  local.push(payload);
  setLocalData('categories', local);
  return payload;
};

export const updateCategoryItem = async (id, categoryData) => {
  if (db) {
    try {
      await updateDoc(doc(db, 'categories', id), {
        ...categoryData,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Firestore updateCategory error:", e);
    }
  }

  const local = getLocalData('categories', DEMO_CATEGORIES);
  const index = local.findIndex(c => c.id === id);
  if (index !== -1) {
    local[index] = { ...local[index], ...categoryData };
    setLocalData('categories', local);
  }
};

export const deleteCategoryItem = async (id) => {
  if (db) {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {
      console.error("Firestore deleteCategory error:", e);
    }
  }

  const local = getLocalData('categories', DEMO_CATEGORIES);
  const filtered = local.filter(c => c.id !== id);
  setLocalData('categories', filtered);
};

// PRODUCT / ITEM CRUD (Direct Cloud Database Writes)
export const addProductItem = async (itemData) => {
  const newId = itemData.id || `item_${Date.now()}`;
  const payload = {
    id: newId,
    title: itemData.title || 'Новый товар',
    description: itemData.description || '',
    price: Number(itemData.price) || 0,
    currency: itemData.currency || 'BYN',
    categoryId: itemData.categoryId || 'cat_services',
    images: itemData.images && itemData.images.length > 0 ? itemData.images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800'],
    sourceUrl: itemData.sourceUrl || '',
    status: itemData.status || 'active',
    portfolio: Array.isArray(itemData.portfolio) ? itemData.portfolio : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (db) {
    try {
      await setDoc(doc(db, 'items', newId), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Firestore addProduct error:", e);
    }
  }

  const local = getLocalData('items', []);
  local.unshift(payload);
  setLocalData('items', local);
  return payload;
};

export const updateProductItem = async (id, itemData) => {
  if (db) {
    try {
      await updateDoc(doc(db, 'items', id), {
        ...itemData,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Firestore updateProduct error:", e);
    }
  }

  const local = getLocalData('items', []);
  const index = local.findIndex(i => i.id === id);
  if (index !== -1) {
    local[index] = { ...local[index], ...itemData, updatedAt: new Date().toISOString() };
    setLocalData('items', local);
  }
};

export const deleteProductItem = async (id) => {
  if (db) {
    try {
      await deleteDoc(doc(db, 'items', id));
    } catch (e) {
      console.error("Firestore deleteProduct error:", e);
    }
  }

  const local = getLocalData('items', []);
  const filtered = local.filter(i => i.id !== id);
  setLocalData('items', filtered);
};

export const toggleProductStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === 'active' ? 'draft' : 'active';
  await updateProductItem(id, { status: newStatus });
  return newStatus;
};

// ADMIN AUTHENTICATION (d2c / 787352 mapping & Firebase Auth)
export const authenticateAdmin = async (login, password) => {
  const validLogin = login === 'd2c';
  const validPassword = password === '787352';

  if (!validLogin || !validPassword) {
    throw new Error('Неверный логин или пароль администратора!');
  }

  const adminEmail = `${login}@tkeep.by`;

  if (auth) {
    try {
      await signInWithEmailAndPassword(auth, adminEmail, password);
    } catch (authError) {
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, adminEmail, password);
        } catch (createErr) {
          console.warn("Could not create Firebase Auth user, proceeding with session:", createErr);
        }
      }
    }
  }

  localStorage.setItem('tkeep_admin_authenticated', 'true');
  localStorage.setItem('tkeep_admin_user', JSON.stringify({ username: 'd2c', role: 'admin', email: adminEmail }));
  return { username: 'd2c', role: 'admin', email: adminEmail };
};

export const logoutAdminSession = async () => {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("SignOut error:", e);
    }
  }
  localStorage.removeItem('tkeep_admin_authenticated');
  localStorage.removeItem('tkeep_admin_user');
};

export const checkAdminAuthenticated = () => {
  if (auth && auth.currentUser) {
    return true;
  }
  return localStorage.getItem('tkeep_admin_authenticated') === 'true';
};
