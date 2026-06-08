import React, { useState, useRef } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { auth, firestore } from '../../firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const emailRef    = useRef(null)
  const passwordRef = useRef(null)
  const confirmRef  = useRef(null)

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password || !confirm) {
      setError('All fields are required.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await setDoc(doc(firestore, 'Users', user.uid), {
        username: username.trim(),
        email: email.trim(),
        createdAt: new Date().toISOString(),
      })
      // onAuthStateChanged in App.js switches to main app automatically
    } catch (e) {
      const msg = e.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists.'
        : e.code === 'auth/invalid-email'
          ? 'Please enter a valid email address.'
          : e.code === 'auth/weak-password'
            ? 'Password is too weak.'
            : 'Signup failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={22} color="#5C2C92" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/apollologo-1.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Create Account</Text>
            <Text style={styles.tagline}>Join Apollo Claims today</Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            {error ? (
              <View style={styles.errorBox}>
                <MaterialIcons name="error-outline" size={16} color="#B71C1C" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {[
              { label: 'Full Name',        icon: 'person-outline',  value: username,  setter: setUsername, ref: null,        next: emailRef,    placeholder: 'Your full name',     secure: false, type: 'default'       },
              { label: 'Email',            icon: 'email',           value: email,     setter: setEmail,    ref: emailRef,    next: passwordRef, placeholder: 'you@example.com',    secure: false, type: 'email-address' },
              { label: 'Password',         icon: 'lock-outline',    value: password,  setter: setPassword, ref: passwordRef, next: confirmRef,  placeholder: 'Min. 6 characters',  secure: true,  type: 'default'       },
              { label: 'Confirm Password', icon: 'lock-outline',    value: confirm,   setter: setConfirm,  ref: confirmRef,  next: null,        placeholder: 'Repeat password',    secure: true,  type: 'default'       },
            ].map(({ label, icon, value, setter, ref, next, placeholder, secure, type }) => (
              <View key={label}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <View style={styles.inputWrap}>
                  <MaterialIcons name={icon} size={18} color="#aaa" style={styles.inputIcon} />
                  <TextInput
                    ref={ref}
                    style={[styles.input, { flex: 1 }]}
                    placeholder={placeholder}
                    placeholderTextColor="#bbb"
                    value={value}
                    onChangeText={t => { setter(t); setError('') }}
                    secureTextEntry={secure && !showPw}
                    keyboardType={type}
                    autoCapitalize={type === 'email-address' ? 'none' : 'words'}
                    returnKeyType={next ? 'next' : 'done'}
                    blurOnSubmit={!next}
                    onSubmitEditing={() => next?.current?.focus()}
                  />
                  {secure && (
                    <TouchableOpacity onPress={() => setShowPw(v => !v)} style={styles.eyeBtn}>
                      <MaterialIcons name={showPw ? 'visibility-off' : 'visibility'} size={18} color="#aaa" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.signupBtn, loading && styles.signupBtnDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.signupBtnText}>Create Account</Text>
              }
            </TouchableOpacity>
          </View>

          {/* Login link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#f5f5f8' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingTop: 16 },

  backBtn: { marginBottom: 8, alignSelf: 'flex-start', padding: 4 },

  header: { alignItems: 'center', marginBottom: 28 },
  logo:   { width: 140, height: 70, marginBottom: 12 },
  appName:  { fontSize: 24, fontWeight: '800', color: '#5C2C92' },
  tagline:  { fontSize: 13, color: '#888', marginTop: 4 },

  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },

  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fdecea', borderRadius: 10, padding: 12, marginBottom: 16,
  },
  errorText: { color: '#B71C1C', fontSize: 13, flex: 1 },

  fieldLabel: {
    fontSize: 12, fontWeight: '700', color: '#555',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#e8e8e8', borderRadius: 12,
    backgroundColor: '#fafafa', marginBottom: 16, paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: { marginRight: 8 },
  input:     { fontSize: 15, color: '#1a1a1a' },
  eyeBtn:    { padding: 4 },

  signupBtn: {
    backgroundColor: '#5C2C92', borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },
  signupBtnDisabled: { opacity: 0.6 },
  signupBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  footer:     { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: '#888' },
  footerLink: { fontSize: 14, color: '#5C2C92', fontWeight: '700' },
})

export default Signup
