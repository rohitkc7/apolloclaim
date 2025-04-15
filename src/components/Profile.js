import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { auth, firestore } from '../../firebaseConfig'
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { sendPasswordResetEmail } from 'firebase/auth'

const Profile = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [claimCount, setClaimCount] = useState(0)

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = auth.currentUser.uid
      const userDoc = await firestore.collection('Users').doc(uid).get()
      const userData = userDoc.data()

      if (userData) {
        setUsername(userData.username)
        setEmail(userData.email)
      }

      // Fetch number of claims
      const claimsQuery = query(
        collection(firestore, 'claims'),
        where('userId', '==', uid),
      )
      const claimsSnapshot = await getDocs(claimsQuery)
      setClaimCount(claimsSnapshot.size)
    }

    fetchUserData()
  }, [])

  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser
      if (user && user.email) {
        await sendPasswordResetEmail(auth, user.email)
        Alert.alert('Success', 'Password reset email sent.')
      }
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <Text style={styles.value}>{userData?.username}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{userData?.email}</Text>

      <Text style={styles.label}>Claims Submitted: {claimCount}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Change Password" onPress={handleChangePassword} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 30,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
})

export default Profile
