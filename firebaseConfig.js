// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth' // Import Auth
import { getFirestore } from 'firebase/firestore' // Import Firestore
import { getAnalytics } from 'firebase/analytics' // Import Analytics (if needed)

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

// Initialize Firebase services
const auth = getAuth(app) // Initialize Auth
const firestore = getFirestore(app) // Initialize Firestore
const analytics = getAnalytics(app) // Initialize Analytics (if used)

// Export the services for use in other parts of your app
export { auth, firestore }
