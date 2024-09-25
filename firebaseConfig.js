// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from 'firebase/firestore' // Import Firestore
import { getAnalytics, isSupported } from 'firebase/analytics' // Import Analytics (if needed)

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCeKeATx4jKUbFburEcGEqvZdn51MzLxq0',
  authDomain: 'apolloclaim-afdda.firebaseapp.com',
  projectId: 'apolloclaim-afdda',
  storageBucket: 'apolloclaim-afdda.appspot.com',
  messagingSenderId: '267318011259',
  appId: '1:267318011259:web:6e6f02161e244cfff589de',
  measurementId: 'G-9KRV5GEQBK',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

// Initialize Firestore
const firestore = getFirestore(app)

// Initialize Analytics (conditionally, since React Native might not support it)
const initializeAnalytics = async (app) => {
  const analyticsSupported = await isSupported()
  if (analyticsSupported) {
    const analytics = getAnalytics(app)
    console.log('Analytics initialized')
  } else {
    console.log('Analytics not supported in this environment')
  }
}

initializeAnalytics(app) // Initialize Analytics if supported

// Export the services for use in other parts of your app
export { auth, firestore }
