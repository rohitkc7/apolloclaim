import React from 'react'
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native'
import { BarChart, PieChart } from 'react-native-chart-kit'

const FitmentTracking = () => {
  const barData = {
    labels: ['Segment A', 'Segment B', 'Segment C', 'Segment D'], // x-axis labels
    datasets: [
      {
        data: [40, 60, 80, 20],
      },
    ],
  }

  const pieData = [
    {
      name: 'Segment A',
      population: 215,
      color: 'rgba(131, 167, 234, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Segment B',
      population: 280,
      color: '#F00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Segment C',
      population: 527,
      color: 'green',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Segment D',
      population: 853,
      color: '#FF8300',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ]

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fitment Tracking Analysis</Text>

      {/* Bar Chart */}
      <Text style={styles.chartTitle}>
        Bar Chart - Fitment Count per Segment
      </Text>
      <BarChart
        data={barData}
        width={Dimensions.get('window').width - 30}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={styles.chartStyle}
      />

      {/* Pie Chart */}
      <Text style={styles.chartTitle}>Pie Chart - Fitment Distribution</Text>
      <PieChart
        data={pieData}
        width={Dimensions.get('window').width - 30}
        height={220}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  chartStyle: {
    marginVertical: 10,
    borderRadius: 16,
  },
})

export default FitmentTracking
