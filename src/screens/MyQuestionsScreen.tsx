import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import Screen from '../components/Screen';
import colors from '../config/colors';
import Activityindicator from '../components/Activityindicator';
import NoResults from '../components/NoResults';
import AddItem from '../components/addItem';
import routes from '../navigation/routes';
import CardItem from '../components/cardItem';
import showError from '../components/notifications/showError';
import askBeforeDelete from '../components/askBeforeDelete';
import showOk from '../components/notifications/showOk';
import ListItemMoreOptions from '../components/ListItemMoreOptions';

function MyQuestionsScreen({ navigation, route }) {
  const site = route.params;
  const [loading, setLoading] = useState(false);
  const [employeeList, setEmployeeList] = useState('');
  const isFocused = useIsFocused();

  const apiSiteList = async () => {
    site.siteId;
    const response = await employeeNameApi.get(site.siteId);
    if (!response) {
      setLoading(false);
      return setEmployeeList('');
    }
    setEmployeeList(response.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    apiSiteList();
  }, [navigation, isFocused]);

  const handleAddPress = () => {
    navigation.navigate(routes.QUESTION_ADD_EDIT.name);
  };
  const handleOnPress = (item) => {
    item.edit = true;
    navigation.navigate(routes.QUESTION_ADD_EDIT.name, item);
  };

  const handleDeleteOnePress = async (item) => {
    item.siteId = site.siteId;
    const answer = await askBeforeDelete(
      'alerts.deleteEmployee.fromSite.title',
      'alerts.deleteEmployee.fromSite.text'
    );
    if (answer) {
      if (answer === 'pass') return;
      const result = await employeeNameApi.remove(item);
      if (!result.ok) return showError(result.data.error);
      showOk(result.data.msg);
      apiSiteList();
    }
  };

  return (
    <Screen style={{ paddingTop: 0 }}>
      <Activityindicator visible={loading} />
      {employeeList.length === 0 && !loading && (
        <NoResults
          title={``}
          text="NoResults.noPatrols.text"
          iconName="account"
        />
      )}
      <FlatList
        data={employeeList}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <CardItem
            sizeImg={50}
            title={item.name}
            bold={true}
            subTitle={''}
            onPress={() => handleOnPress(item)}
            renderLeftActions={() => (
              <ListItemMoreOptions
                deleteme
                onPressDelete={() => handleDeleteOnePress(item)}
              />
            )}
          />
        )}
      />
      <AddItem
        iconName="plus"
        backgroundColor={colors.secondary}
        onPress={handleAddPress}
      />
    </Screen>
  );
}

export default MyQuestionsScreen;
