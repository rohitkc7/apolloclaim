import React, { useState, useEffect, useCallback } from 'react'
import {
  StyleSheet, View, Text, FlatList, TouchableOpacity,
  Modal, TextInput, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { firestore } from '../../firebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'
import DateTimePicker from '@react-native-community/datetimepicker'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import PreviewTable from './previewTable'
import { useUser } from '../context/UserContext'

const ITEMS_PER_PAGE = 8

const fmtDate = (firestoreTs) => {
  if (!firestoreTs) return '—'
  try {
    return firestoreTs.toDate().toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  } catch { return '—' }
}

const Pill = ({ label, color = '#5C2C92' }) => (
  <View style={[styles.pill, { backgroundColor: color + '18', borderColor: color + '40' }]}>
    <Text style={[styles.pillText, { color }]}>{label}</Text>
  </View>
)

const ClaimCard = ({ item, onView, submitter }) => (
  <View style={styles.card}>
    <View style={styles.cardTop}>
      <View style={styles.issueBadge}>
        <Text style={styles.issueNum}>N{String(item.id).padStart(5, '0')}</Text>
      </View>
      <Text style={styles.cardDate}>{fmtDate(item.date)}</Text>
    </View>

    <Text style={styles.customerName}>{item.customerName || 'Unknown Customer'}</Text>
    <Text style={styles.companyName}>{item.companyName || ''}</Text>

    <View style={styles.pillRow}>
      {item.segment    && <Pill label={item.segment}    color="#5C2C92" />}
      {item.tyreSize   && <Pill label={item.tyreSize}   color="#1565C0" />}
      {item.defectArea && <Pill label={item.defectArea} color="#B71C1C" />}
    </View>

    <View style={styles.cardFooter}>
      <View style={styles.cardMeta}>
        <MaterialIcons name="location-on" size={13} color="#999" />
        <Text style={styles.metaText}>{item.location || '—'}</Text>
      </View>
      <TouchableOpacity style={styles.viewBtn} onPress={() => onView(item.id)}>
        <Text style={styles.viewBtnText}>View Details</Text>
        <MaterialIcons name="arrow-forward" size={14} color="#5C2C92" />
      </TouchableOpacity>
    </View>

    {/* Admin-only: show who submitted this claim */}
    {submitter && (
      <View style={styles.submitterRow}>
        <MaterialIcons name="person-outline" size={12} color="#1565C0" />
        <Text style={styles.submitterText}>Submitted by {submitter}</Text>
      </View>
    )}
  </View>
)

const AllClaim = ({ navigation }) => {
  const { authUser, isAdmin }              = useUser()
  const [claims, setClaims]               = useState([])
  const [userMap, setUserMap]             = useState({})   // uid → display name (admin only)
  const [loading, setLoading]             = useState(true)
  const [search, setSearch]               = useState('')
  const [currentPage, setCurrentPage]     = useState(1)
  const [previewVisible, setPreviewVisible]   = useState(false)
  const [previewClaims, setPreviewClaims]     = useState([])
  const [filterVisible, setFilterVisible]     = useState(false)
  const [fromDate, setFromDate]           = useState(new Date(Date.now() - 30 * 864e5))
  const [toDate, setToDate]               = useState(new Date())
  const [showFromPicker, setShowFromPicker] = useState(false)
  const [showToPicker,   setShowToPicker]   = useState(false)

  // Fetch user map for admin view (uid → display name)
  useEffect(() => {
    if (!isAdmin) return
    getDocs(collection(firestore, 'Users')).then(snap => {
      const map = {}
      snap.docs.forEach(d => {
        const data = d.data()
        map[d.id] = data.username || data.email?.split('@')[0] || 'Unknown'
      })
      setUserMap(map)
    }).catch(() => {})
  }, [isAdmin])

  const fetchClaims = useCallback(async () => {
    if (!authUser) return
    setLoading(true)
    try {
      let snap
      if (isAdmin) {
        // Admin sees every claim
        snap = await getDocs(collection(firestore, 'claims'))
      } else {
        // Regular user sees only their own claims
        snap = await getDocs(
          query(collection(firestore, 'claims'), where('userId', '==', authUser.uid))
        )
      }
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => parseInt(a.id) - parseInt(b.id))
      setClaims(data)
    } catch (e) {
      console.error('Error fetching claims:', e)
    } finally {
      setLoading(false)
    }
  }, [authUser, isAdmin])

  useFocusEffect(useCallback(() => { fetchClaims() }, [fetchClaims]))

  const filtered = claims.filter(c => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      c.customerName?.toLowerCase().includes(q) ||
      c.companyName?.toLowerCase().includes(q)  ||
      c.segment?.toLowerCase().includes(q)       ||
      c.defectName?.toLowerCase().includes(q)    ||
      String(c.id).includes(q)                  ||
      (isAdmin && userMap[c.userId]?.toLowerCase().includes(q))
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const safePage   = Math.min(currentPage, totalPages)
  const paginated  = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE)

  const handleViewClaim = (id) =>
    navigation.navigate('SingleClaim', { claimId: id })

  const applyDateFilter = () => {
    const end = new Date(toDate); end.setHours(23, 59, 59)
    const result = claims.filter(c => {
      const d = c.date?.toDate?.()
      return d && d >= fromDate && d <= end
    })
    setPreviewClaims(result)
    setFilterVisible(false)
    setPreviewVisible(true)
  }

  const exportAll = () => {
    setPreviewClaims(claims)
    setPreviewVisible(true)
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>

      {/* Page header with back button */}
      <View style={styles.pageHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Complaint Management</Text>
      </View>

      {/* Admin mode indicator */}
      {isAdmin && (
        <View style={styles.adminBar}>
          <MaterialIcons name="shield" size={13} color="#1565C0" />
          <Text style={styles.adminBarText}>Admin view — showing all claims</Text>
        </View>
      )}

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={18} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder={isAdmin ? 'Search by name, user, company, ID…' : 'Search by name, company, ID…'}
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={t => { setSearch(t); setCurrentPage(1) }}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialIcons name="close" size={16} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
          <MaterialIcons name="filter-list" size={20} color="#5C2C92" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.exportBtn} onPress={exportAll}>
          <MaterialIcons name="file-download" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {loading ? 'Loading…' : `${filtered.length} claim${filtered.length !== 1 ? 's' : ''}`}
          {search ? ` matching "${search}"` : ' total'}
        </Text>
        {!loading && filtered.length > 0 && (
          <Text style={styles.statsPage}>Page {safePage} of {totalPages}</Text>
        )}
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#5C2C92" />
          <Text style={styles.loadingText}>Loading claims…</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <MaterialIcons name="inbox" size={56} color="#ddd" />
          <Text style={styles.emptyTitle}>No claims found</Text>
          <Text style={styles.emptySubtitle}>
            {search ? 'Try a different search term' : 'Submit your first claim to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={paginated}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ClaimCard
              item={item}
              onView={handleViewClaim}
              submitter={isAdmin ? (userMap[item.userId] || item.userId?.slice(0, 8)) : null}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchClaims}
          refreshing={loading}
        />
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageBtn, safePage === 1 && styles.pageBtnDisabled]}
            onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            <MaterialIcons name="chevron-left" size={22} color={safePage === 1 ? '#ccc' : '#5C2C92'} />
          </TouchableOpacity>

          <View style={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '…' ? (
                  <Text key={`d${i}`} style={styles.pageEllipsis}>…</Text>
                ) : (
                  <TouchableOpacity
                    key={p}
                    style={[styles.pageNumBtn, p === safePage && styles.pageNumActive]}
                    onPress={() => setCurrentPage(p)}
                  >
                    <Text style={[styles.pageNumText, p === safePage && styles.pageNumTextActive]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
          </View>

          <TouchableOpacity
            style={[styles.pageBtn, safePage === totalPages && styles.pageBtnDisabled]}
            onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            <MaterialIcons name="chevron-right" size={22} color={safePage === totalPages ? '#ccc' : '#5C2C92'} />
          </TouchableOpacity>
        </View>
      )}

      {/* Date-range filter modal */}
      <Modal visible={filterVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setFilterVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Filter by Date Range</Text>

          <Text style={styles.dateLabel}>From</Text>
          <TouchableOpacity style={styles.datePill} onPress={() => setShowFromPicker(true)}>
            <MaterialIcons name="calendar-today" size={16} color="#5C2C92" />
            <Text style={styles.datePillText}>
              {fromDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </Text>
          </TouchableOpacity>
          {showFromPicker && (
            <DateTimePicker value={fromDate} mode="date" display="default"
              maximumDate={toDate}
              onChange={(_, d) => { if (d) setFromDate(d); setShowFromPicker(false) }} />
          )}

          <Text style={styles.dateLabel}>To</Text>
          <TouchableOpacity style={styles.datePill} onPress={() => setShowToPicker(true)}>
            <MaterialIcons name="event" size={16} color="#5C2C92" />
            <Text style={styles.datePillText}>
              {toDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </Text>
          </TouchableOpacity>
          {showToPicker && (
            <DateTimePicker value={toDate} mode="date" display="default"
              minimumDate={fromDate} maximumDate={new Date()}
              onChange={(_, d) => { if (d) setToDate(d); setShowToPicker(false) }} />
          )}

          <View style={styles.sheetActions}>
            <TouchableOpacity style={styles.sheetCancelBtn} onPress={() => setFilterVisible(false)}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetApplyBtn} onPress={applyDateFilter}>
              <MaterialIcons name="file-download" size={16} color="#fff" />
              <Text style={styles.sheetApplyText}>Export Range</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <PreviewTable
        visible={previewVisible}
        data={previewClaims}
        onClose={() => setPreviewVisible(false)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f8' },

  // Page header
  pageHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#f5f5f8', alignItems: 'center', justifyContent: 'center',
  },
  pageTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },

  adminBar: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#e3f2fd', paddingHorizontal: 16, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#bbdefb',
  },
  adminBarText: { fontSize: 12, color: '#1565C0', fontWeight: '600' },

  // Toolbar
  toolbar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#f4f4f8', borderRadius: 10,
    paddingHorizontal: 10, height: 40,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1a1a1a', height: 40 },
  filterBtn: {
    width: 40, height: 40, borderRadius: 10, borderWidth: 1.5,
    borderColor: '#5C2C92', alignItems: 'center', justifyContent: 'center',
  },
  exportBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#5C2C92', alignItems: 'center', justifyContent: 'center',
  },

  // Stats
  statsBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  statsText: { fontSize: 12, color: '#888' },
  statsPage: { fontSize: 12, color: '#888' },

  // List
  list: { padding: 12, paddingBottom: 8 },

  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  issueBadge: {
    backgroundColor: '#f0e8ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  issueNum:     { fontSize: 12, fontWeight: '700', color: '#5C2C92' },
  cardDate:     { fontSize: 12, color: '#999' },
  customerName: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 2 },
  companyName:  { fontSize: 13, color: '#666', marginBottom: 10 },
  pillRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  pill:         { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  pillText:     { fontSize: 11, fontWeight: '600' },
  cardFooter:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardMeta:     { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText:     { fontSize: 12, color: '#999' },
  viewBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#f0e8ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  viewBtnText: { fontSize: 12, color: '#5C2C92', fontWeight: '700' },

  // Submitter chip (admin only)
  submitterRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 10, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  submitterText: { fontSize: 11, color: '#1565C0', fontWeight: '600' },

  // States
  center:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingBottom: 60 },
  loadingText:   { color: '#999', fontSize: 14, marginTop: 8 },
  emptyTitle:    { fontSize: 17, fontWeight: '700', color: '#555', marginTop: 4 },
  emptySubtitle: { fontSize: 13, color: '#aaa', textAlign: 'center', paddingHorizontal: 32 },

  // Pagination
  pagination: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, paddingHorizontal: 12, gap: 6,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee',
  },
  pageBtn:         { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  pageBtnDisabled: { opacity: 0.35 },
  pageNumbers:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pageNumBtn:      { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  pageNumActive:   { backgroundColor: '#5C2C92' },
  pageNumText:       { fontSize: 13, color: '#555', fontWeight: '600' },
  pageNumTextActive: { color: '#fff' },
  pageEllipsis:      { fontSize: 14, color: '#aaa', paddingHorizontal: 2 },

  // Filter sheet
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
  },
  sheetHandle:   { width: 40, height: 4, backgroundColor: '#ddd', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle:    { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginBottom: 20 },
  dateLabel:     { fontSize: 12, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 },
  datePill:      { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f0e8ff', borderRadius: 12, padding: 14, marginBottom: 16 },
  datePillText:  { fontSize: 15, color: '#5C2C92', fontWeight: '600' },
  sheetActions:  { flexDirection: 'row', gap: 12, marginTop: 8 },
  sheetCancelBtn: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  sheetCancelText: { color: '#555', fontWeight: '600', fontSize: 15 },
  sheetApplyBtn:  { flex: 2, height: 48, borderRadius: 12, backgroundColor: '#5C2C92', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  sheetApplyText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})

export default AllClaim
