import React, { useState, useRef } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { auth } from '../../firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'

const Login = ({ navigation }) => {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const passwordRef = useRef(null)

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      // onAuthStateChanged in App.js will switch to the main navigator automatically
    } catch (e) {
      const msg = e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password'
        ? 'Incorrect email or password.'
        : e.code === 'auth/user-not-found'
          ? 'No account found with this email.'
          : e.code === 'auth/too-many-requests'
            ? 'Too many attempts. Try again later.'
            : 'Login failed. Please try again.'
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
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/apollologo-1.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Apollo Claims</Text>
            <Text style={styles.tagline}>Sign in to your account</Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            {error ? (
              <View style={styles.errorBox}>
                <MaterialIcons name="error-outline" size={16} color="#B71C1C" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="email" size={18} color="#aaa" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#bbb"
                value={email}
                onChangeText={t => { setEmail(t); setError('') }}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>

            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="lock-outline" size={18} color="#aaa" style={styles.inputIcon} />
              <TextInput
                ref={passwordRef}
                style={[styles.input, { flex: 1 }]}
                placeholder="Your password"
                placeholderTextColor="#bbb"
                value={password}
                onChangeText={t => { setPassword(t); setError('') }}
                secureTextEntry={!showPw}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPw(v => !v)} style={styles.eyeBtn}>
                <MaterialIcons name={showPw ? 'visibility-off' : 'visibility'} size={18} color="#aaa" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.loginBtnText}>Sign In</Text>
              }
            </TouchableOpacity>
          </View>

          {/* Sign up link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#f5f5f8' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },

  header: { alignItems: 'center', marginBottom: 32 },
  logo:   { width: 160, height: 80, marginBottom: 12 },
  appName:  { fontSize: 26, fontWeight: '800', color: '#5C2C92', letterSpacing: 0.3 },
  tagline:  { fontSize: 14, color: '#888', marginTop: 4 },

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
    backgroundColor: '#fafafa', marginBottom: 18, paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: { marginRight: 8 },
  input:     { flex: 1, fontSize: 15, color: '#1a1a1a' },
  eyeBtn:    { padding: 4 },

  loginBtn: {
    backgroundColor: '#5C2C92', borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  footer:     { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: '#888' },
  footerLink: { fontSize: 14, color: '#5C2C92', fontWeight: '700' },
})

export default Login
