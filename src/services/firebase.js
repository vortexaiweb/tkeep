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

// Firebase configuration object.
// Placeholders are provided for initial setup. Replace with your actual Firebase project credentials.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Check if config is configured or mock fallback
const isConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY";

let app, db, auth;

try {
  if (isConfigured) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  }
} catch (e) {
  console.warn("Firebase initialization skipped or failed. Falling back to local storage mock mode:", e);
}

export { db, auth, isConfigured };

// Demo Categories for Seeding
const DEMO_CATEGORIES = [
  { id: 'cat_electronics', name: 'Электроника', icon: '📱', sortOrder: 1 },
  { id: 'cat_auto', name: 'Авто и Запчасти', icon: '🚗', sortOrder: 2 },
  { id: 'cat_home', name: 'Дом и Сад', icon: '🏠', sortOrder: 3 },
  { id: 'cat_fashion', name: 'Одежда и Обувь', icon: '👕', sortOrder: 4 },
  { id: 'cat_services', name: 'Услуги', icon: '🛠️', sortOrder: 5 }
];

// Demo Items for Initial Setup
const DEMO_ITEMS = [
  {
    id: 'demo_1',
    title: 'Apple iPhone 15 Pro 128GB Titanium',
    description: 'Идеальное состояние, полный комплект, оригинальный чехол MagSafe в подарок. Состояние аккумулятора 98%. Официальная гарантия.',
    price: 3200,
    currency: 'BYN',
    categoryId: 'cat_electronics',
    images: [
      'https://img.kufar.by/v1/list_thumbs_2x/01/0147983419.jpg',
      'https://img.kufar.by/v1/list_thumbs_2x/01/0147983420.jpg'
    ],
    sourceUrl: 'https://www.kufar.by/item/214983214',
    status: 'active',
    location: 'Минск',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_2',
    title: 'Ноутбук ASUS ROG Strix G16 i7 / RTX 4060',
    description: 'Мощный игровой ноутбук. Экран 165 Гц, Intel Core i7-13650HX, 16 ГБ RAM, 1 ТБ SSD. Отличное состояние, коробочный комплект.',
    price: 4600,
    currency: 'BYN',
    categoryId: 'cat_electronics',
    images: [
      'https://img.kufar.by/v1/list_thumbs_2x/01/0147812984.jpg'
    ],
    sourceUrl: 'https://www.kufar.by/item/214981298',
    status: 'active',
    location: 'Минск',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_3',
    title: 'Комплект оригинальных дисков R18 BMW',
    description: 'Литые диски R18 в стиле 790 M. Подходят на G20, G30. Ровные, без сварки и трещин. Резина в подарок.',
    price: 1850,
    currency: 'BYN',
    categoryId: 'cat_auto',
    images: [
      'https://img.kufar.by/v1/list_thumbs_2x/01/0147910283.jpg'
    ],
    sourceUrl: 'https://www.kufar.by/item/214910283',
    status: 'active',
    location: 'Гродно',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'demo_4',
    title: 'Диван угловой раскладной Scandinavian Grey',
    description: 'Современный стильный диван с механизмом еврокнижка и вместительным бельевым ящиком. Ткань антикоготь.',
    price: 1250,
    currency: 'BYN',
    categoryId: 'cat_home',
    images: [
      'https://img.kufar.by/v1/list_thumbs_2x/01/0147551982.jpg'
    ],
    sourceUrl: '',
    status: 'active',
    location: 'Брест',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// LocalStorage Helper for fallback mode when Firebase credentials are not yet entered
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

// Seed Local / Firestore Data
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

      const itemSnap = await getDocs(collection(db, 'items'));
      if (itemSnap.empty) {
        for (const item of DEMO_ITEMS) {
          await setDoc(doc(db, 'items', item.id), {
            ...item,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      }
    } catch (err) {
      console.warn("Firestore seed fallback to localStorage:", err);
    }
  }

  // Local Storage Seeding
  try {
    if (!localStorage.getItem('tkeep_categories')) {
      setLocalData('categories', DEMO_CATEGORIES);
    }
    if (!localStorage.getItem('tkeep_items')) {
      setLocalData('items', DEMO_ITEMS);
    }
  } catch (e) {
    console.warn("LocalStorage seed access restricted:", e);
  }
};

// SUBSCRIBE / FETCH CATEGORIES
export const subscribeCategories = (callback) => {
  if (db) {
    const q = query(collection(db, 'categories'), orderBy('sortOrder', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (categories.length > 0) {
        callback(categories);
      } else {
        callback(getLocalData('categories', DEMO_CATEGORIES));
      }
    }, (err) => {
      console.warn("Firestore categories error, falling to local:", err);
      callback(getLocalData('categories', DEMO_CATEGORIES));
    });
  } else {
    callback(getLocalData('categories', DEMO_CATEGORIES));
    return () => {};
  }
};

// SUBSCRIBE / FETCH ITEMS
export const subscribeItems = (callback, isAdmin = false) => {
  if (db) {
    const colRef = collection(db, 'items');
    const q = isAdmin ? query(colRef, orderBy('createdAt', 'desc')) : query(colRef, where('status', '==', 'active'));
    
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(items);
    }, (err) => {
      console.warn("Firestore items listener fallback to local:", err);
      const local = getLocalData('items', DEMO_ITEMS);
      callback(isAdmin ? local : local.filter(i => i.status === 'active'));
    });
  } else {
    const local = getLocalData('items', DEMO_ITEMS);
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

// PRODUCT / ITEM CRUD
export const addProductItem = async (itemData) => {
  const newId = itemData.id || `item_${Date.now()}`;
  const payload = {
    id: newId,
    title: itemData.title || 'Новый товар',
    description: itemData.description || '',
    price: Number(itemData.price) || 0,
    currency: itemData.currency || 'BYN',
    categoryId: itemData.categoryId || 'cat_electronics',
    images: itemData.images && itemData.images.length > 0 ? itemData.images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800'],
    sourceUrl: itemData.sourceUrl || '',
    status: itemData.status || 'active',
    location: itemData.location || 'Минск',
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

  const local = getLocalData('items', DEMO_ITEMS);
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

  const local = getLocalData('items', DEMO_ITEMS);
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

  const local = getLocalData('items', DEMO_ITEMS);
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

  // Firebase Auth integration
  const adminEmail = `${login}@tkeep.by`;

  if (auth) {
    try {
      await signInWithEmailAndPassword(auth, adminEmail, password);
    } catch (authError) {
      // If user doesn't exist yet, attempt to create it
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, adminEmail, password);
        } catch (createErr) {
          console.warn("Could not create Firebase Auth user, proceeding with session:", createErr);
        }
      }
    }
  }

  // Save session state
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
