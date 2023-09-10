import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../config/colors';

import Text from './Text';

function Score({ title, score, time, rank }) {
  return (
    <View style={styles.container}>
      <Text style={styles.rank}>{rank}</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.score}>{score}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: colors.medium,
  },
  rank: {
    paddingRight: 10,
  },
  title: {
    color: colors.black,
    fontWeight: 'bold',
  },
  time: {
    marginHorizontal: 10,
    fontSize: 12,
    textAlign: 'center',
    alignSelf: 'center',
    paddingTop: 7,
  },
  scoreContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    right: 20,
    position: 'absolute',
  },
  score: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default Score;
