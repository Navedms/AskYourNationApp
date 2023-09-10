import React, { useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import NoResults from '../components/NoResults';
import Screen from '../components/Screen';
import Score from '../components/Score';

function HighScoresScreen({ navigation }) {
  const isFocused = useIsFocused();

  const data = [];

  return (
    <Screen style={styles.container}>
      {data.length === 0 ? (
        <NoResults
          title="No results to display"
          text="Play the game, and your best results will appear here"
          iconName="home"
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Score
              rank={index + 1}
              title={item.name}
              score={item.score}
              time={item.time}
            />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  btnsContainer: {
    padding: 10,
  },
});

export default HighScoresScreen;
