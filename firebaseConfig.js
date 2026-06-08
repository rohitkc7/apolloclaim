import { initializeApp, getApps } from 'firebase/app'
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCeKeATx4jKUbFburEcGEqvZdn51MzLxq0',
  authDomain: 'apolloclaim-afdda.firebaseapp.com',
  projectId: 'apolloclaim-afdda',
  storageBucket: 'apolloclaim-afdda.appspot.com',
  messagingSenderId: '267318011259',
  appId: '1:267318011259:web:6e6f02161e244cfff589de',
}

// Prevent duplicate app initialization on hot reload
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0]

// Prevent duplicate auth initialization on hot reload
let auth
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
} catch (e) {
  auth = getAuth(app)
}

const firestore = getFirestore(app)

export { auth, firestore }
