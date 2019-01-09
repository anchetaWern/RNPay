import React, { Component } from 'react';
import { View, Text, Button, ActivityIndicator, Image } from 'react-native';

const ItemBox = ({ title, price, image, canPay, isPaying, payAction }) => {

  return (
    <View>
      <Image
        style={styles.image}
        source={image} />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
      </View>

      {
        isPaying &&
        <ActivityIndicator size="large" color="#0000ff" />
      }

      <View style={styles.buttonContainer}>
      {
        canPay && !isPaying &&
        <Button
          onPress={payAction}
          title="Buy Now"
          color="#841584"
        />
      }

      {
        !canPay &&
        <View style={styles.alertContainer}>
          <Text style={styles.errorText}>Can't accept payments</Text>
        </View>
      }
      </View>

    </View>
  );

}

export default ItemBox;

const styles = {
  image: {
    width: 170,
    height: 150
  },
  textContainer: {
    alignItems: 'center'
  },
  title: {
    fontSize: 20
  },
  price: {
    fontSize: 23,
    fontWeight: 'bold'
  },
  buttonContainer: {
    margin: 10
  },
  alertContainer: {
    width: 150
  },
  errorText: {
    color: 'red'
  }
};