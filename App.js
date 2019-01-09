import React, { Component } from 'react';
import { View, Alert } from 'react-native';

import stripe from 'tipsi-stripe';
import Config from 'react-native-config';

stripe.setOptions({
  publishableKey: Config.STRIPE_PUBLISHABLE_KEY,
  androidPayMode: 'test',
});

import pay from './src/helpers/pay';
import ItemBox from './src/components/ItemBox';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.access_token = 'AN ACCESS TOKEN FROM YOUR DB';
    this.currency_code = 'USD';

    this.item = {
      title: 'Loop 720',
      price: 1,
      image: require('./src/images/loop720.jpg')
    };
  }


  state = {
    isPaying: false,
    canPay: false
  }


  async componentDidMount() {
    const device_supported = await stripe.deviceSupportsAndroidPay();
    const can_make_android_pay_payments = await stripe.canMakeAndroidPayPayments();

    if(device_supported && can_make_android_pay_payments){
      this.setState({
        canPay: true
      });
    }
  }


  payItem = async () => {
    this.setState({
      isPaying: true
    });

    try {
      const token = await stripe.paymentRequestWithNativePay({
        total_price: this.item.price.toFixed(2),
        currency_code: this.currency_code,
        shipping_address_required: true,
        line_items: [
          {
            currency_code: this.currency_code,
            description: this.item.title,
            total_price: this.item.price.toFixed(2),
            unit_price: this.item.price.toFixed(2),
            quantity: '1',
          }
        ],

      });

      const response = await pay(this.item.price, this.item.title, this.access_token, token.tokenId);
      if (response) {
        Alert.alert("Done!", "Payment successful");
      } else {
        Alert.alert("Error occurred", "Something went wrong while processing payment. Please try again.");
      }

    } catch (e) {
      console.log("error getting token: ", e);
    }

    this.setState({
      isPaying: false
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <ItemBox
          {...this.item}
          canPay={this.state.canPay}
          isPaying={this.state.isPaying}
          payAction={this.payItem} />
      </View>
    );
  }
}


const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  }
};