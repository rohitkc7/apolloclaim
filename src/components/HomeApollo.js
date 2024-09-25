import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { DrawerContentScrollView } from '@react-navigation/drawer'

const HomeApollo = (props) => {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer}
    >
      <View style={styles.itemsContainer}>
        <Image
          source={require('../../assets/apollologo-1.png')}
          style={styles.apolloLogo}
        ></Image>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.itemBox}
            onPress={() => props.navigation.navigate('Scrap Analysis')}
          >
            <Image
              source={require('../../assets/tire-pressure.png')}
              style={styles.backgroundImage}
            />
            <Text style={styles.itemText}>Scrap Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemBox}
            onPress={() => props.navigation.navigate('Complaint Management')}
          >
            <Image
              source={require('../../assets/comments.png')}
              style={styles.backgroundImage}
            />
            <Text style={styles.itemText}>Complaint Management</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.itemBox}
            onPress={() => props.navigation.navigate('Fitment Survey')}
          >
            <Image
              source={require('../../assets/survey.png')}
              style={styles.backgroundImage}
            />
            <Text style={styles.itemText}>Fitment Survey</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemBox}
            onPress={() => props.navigation.navigate('Fitment Tracking')}
          >
            <Image
              source={require('../../assets/tracking.png')}
              style={styles.backgroundImage}
            />
            <Text style={styles.itemText}>Fitment Tracking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#5C2C92',
    borderRadius: 10, // Rounded corners
    elevation: 5, // Shadow for Android
    shadowColor: '#5C2C92',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 20,
    margin: 10,
  },
  itemsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  apolloLogo: {
    width: 250,
    height: 150,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  itemBox: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '80%',
    height: '70%',
    resizeMode: 'contain',
    opacity: 0.8,
    top: 0,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    position: 'absolute',
    zIndex: 1,
  },
})

export default HomeApollo
