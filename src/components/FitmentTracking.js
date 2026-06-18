import React from 'react'
import {
  View, Text, ScrollView, Dimensions, StyleSheet, TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { BarChart, PieChart } from 'react-native-chart-kit'

const FitmentTracking = ({ navigation }) => {
  const barData = {
    labels: ['Seg A', 'Seg B', 'Seg C', 'Seg D'],
    datasets: [{ data: [40, 60, 80, 20] }],
  }

  const pieData = [
    { name: 'Segment A', population: 215, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 13 },
    { name: 'Segment B', population: 280, color: '#E53935', legendFontColor: '#7F7F7F', legendFontSize: 13 },
    { name: 'Segment C', population: 527, color: '#43A047', legendFontColor: '#7F7F7F', legendFontSize: 13 },
    { name: 'Segment D', population: 853, color: '#FF8300', legendFontColor: '#7F7F7F', legendFontSize: 13 },
  ]

  const chartWidth = Dimensions.get('window').width - 32

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.title}>Fitment Tracking</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Fitment Count per Segment</Text>
        <View style={styles.chartCard}>
          <BarChart
            data={barData}
            width={chartWidth}
            height={200}
            yAxisLabel=""
            chartConfig={barConfig}
            style={styles.chart}
          />
        </View>

        <Text style={styles.sectionLabel}>Fitment Distribution</Text>
        <View style={styles.chartCard}>
          <PieChart
            data={pieData}
            width={chartWidth}
            height={200}
            chartConfig={barConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const barConfig = {
  backgroundColor: '#5C2C92',
  backgroundGradientFrom: '#7B3FBE',
  backgroundGradientTo: '#5C2C92',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: { borderRadius: 16 },
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#f5f5f8' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#f5f5f8', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },

  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: '#aaa',
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginTop: 20, marginBottom: 12,
  },
  chartCard: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  chart: { borderRadius: 16 },
})

export default FitmentTracking
