import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { auth, firestore } from '../../firebaseConfig'
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'

const Login = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        setMessage(`Welcome, ${currentUser.email}`)
      } else {
        setMessage('')
      }
    })
    return () => unsubscribe()
  }, [])

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, username, password)
      setMessage('Logged in successfully!')
      setEmail('')
      setUsername('')
      setPassword('')
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setMessage('You have been Logged out')
    } catch (error) {
      setMessage(`Logout error: ${error.message}`)
    }
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>You are logged in as {user.email}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Login" onPress={handleLogin} />
        </>
      )}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
    color: 'green',
  },
})

export default Login
