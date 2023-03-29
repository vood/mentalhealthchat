import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Purchases from 'react-native-purchases';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

type PaymentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Payment'
>;

type Props = {
  navigation: PaymentScreenNavigationProp;
};

const PaymentScreen: React.FC<Props> = ({navigation}) => {
  const purchaseSubscription = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        const {availablePackages} = offerings.current;
        await Purchases.purchasePackage(availablePackages[0]);
        navigation.goBack();
      } else {
        console.log('No offerings available');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscribe for $30/month</Text>
      <TouchableOpacity style={styles.button} onPress={purchaseSubscription}>
        <Text style={styles.buttonText}>Subscribe Now</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    backgroundColor: '#3b73e9',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  backButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default PaymentScreen;
