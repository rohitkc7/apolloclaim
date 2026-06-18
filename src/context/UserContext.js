import React, { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { auth, firestore } from '../../firebaseConfig'

export const ADMIN_EMAIL = 'rohitkc7@gmail.com'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser]             = useState(undefined)
  const [userProfile, setUserProfile]       = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setAuthUser(user)
      if (!user) {
        setUserProfile(null)
        setLoadingProfile(false)
      }
    })
  }, [])

  useEffect(() => {
    if (authUser === undefined || !authUser) return

    setLoadingProfile(true)
    return onSnapshot(
      doc(firestore, 'Users', authUser.uid),
      (snap) => {
        const data = snap.exists() ? snap.data() : {}
        setUserProfile({ uid: authUser.uid, ...data })

        // Auto-bootstrap: if this is the designated admin email and not yet admin, promote them.
        if (authUser.email?.toLowerCase() === ADMIN_EMAIL && data.role !== 'admin') {
          setDoc(
            doc(firestore, 'Users', authUser.uid),
            { role: 'admin', approved: true },
            { merge: true },
          ).catch(() => {})
        }

        setLoadingProfile(false)
      },
      () => setLoadingProfile(false),
    )
  }, [authUser])

  const isAdmin    = userProfile?.role === 'admin'
  const isApproved = isAdmin || userProfile?.approved === true

  return (
    <UserContext.Provider value={{ authUser, userProfile, isAdmin, isApproved, loadingProfile }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
