import React, { ComponentProps, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Yup from 'yup';

import colors from '../../config/colors';
import Modal from '../AppModal';
import defaultStyle from '../../config/style';
import { Sort } from '../../api/reportList';
import Text from '../Text';
import {
  Form,
  FormPicker,
  FormField,
  FormImagePicker,
  FormListMaker,
  FormMultiPicker,
  FormSelectItem,
  FormSwitch,
  FormTextAreaPreview,
  SubmitButton,
  FormGroupPicker,
  TimePicker,
  FormDateRangePicker,
  ErrorMessage,
} from './index';

interface FilterItem {
  type: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  id: string;
  name: string;
  list: [];
  placeholder?: string;
  label?: string;
  value: string & string[];
  verticalElementInIT: any;
  borderColor?: string;
}

interface FiltersProps {
  onSetFilters: (filters: SelectedFilters) => void;
  onResetFilters: () => void;
  firstData: FilterItem[];
  defaultFilters: SelectedFilters;
}

export interface SelectedFilters {
  filters: {
    [key: string]: string | string[];
  };
  sort: Sort;
}

function Filters({
  onSetFilters,
  onResetFilters,
  firstData,
  defaultFilters,
}: FiltersProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [data, setData] = useState<FilterItem[]>(firstData);
  const [filterSelect, setFilterSelect] = useState<boolean>(false);
  const width = Dimensions.get('window').width * 0.82;

  useEffect(() => {
    setData(firstData);
    const firstFiltersValues = firstData
      .filter(
        (element) =>
          element.name !== 'sorttype' &&
          element.name !== 'sortdirection' &&
          element.value
      )
      .map((filter) => filter.value);

    if (firstFiltersValues.flat().length > 0) {
      setFilterSelect(true);
    } else {
      setFilterSelect(false);
    }
  }, [firstData]);

  const renderFormComponent = (item: FilterItem) => {
    if (item.type === 'FormPicker') {
      return (
        <FormPicker
          firstValue={item.value}
          icon={item.icon}
          key={item.id}
          name={item.name}
          list={item.list}
          borderColor={item.borderColor}
          width={0.9}
          placeholder={{
            label: item.placeholder,
            value: null,
            color: colors.dark,
          }}
        />
      );
    } else if (item.type === 'FormGroupPicker') {
      return (
        <FormGroupPicker
          firstValue={item.value}
          icon={item.icon}
          key={item.id}
          name={item.name}
          list={item.list}
          width={0.9}
          label={item.label}
          verticalElementInIT={item.verticalElementInIT}
        />
      );
    } else if (item.type === 'FormDateRangePicker') {
      return (
        <FormDateRangePicker
          firstValue={item.value}
          icon={item.icon}
          key={item.id}
          name={item.name}
          placeholder={item.placeholder as string}
          width={0.9}
          borderColor={item.borderColor}
          setIsOpen={setIsOpen}
        />
      );
    }
  };

  const validationSchema = Yup.object().shape({});

  const handleSubmit = (filters: any) => {
    const sortAndFilters = {
      sort: {
        sorttype: filters.sorttype,
        sortdirection: filters.sortdirection,
      },
      filters: filters,
    };
    setVisible(false);
    onSetFilters(sortAndFilters);
  };

  return (
    <>
      <View style={defaultStyle.rtlRow}>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <View style={[defaultStyle.rtlRow, styles.trigerContainer]}>
            <MaterialCommunityIcons
              name={filterSelect ? 'filter-check-outline' : 'filter-outline'}
              size={30}
              color={filterSelect ? colors.secondary : colors.dark}
              style={styles.icon}
            />
            <Text style={{ fontSize: 14 }}>general.filterAndSort</Text>
          </View>
        </TouchableOpacity>
        {filterSelect && (
          <View style={styles.separator}>
            <Text> </Text>
          </View>
        )}
        {filterSelect && (
          <TouchableOpacity
            onPress={() => {
              onSetFilters(defaultFilters);
              onResetFilters();
            }}
            style={{ justifyContent: 'center' }}
          >
            <Text
              style={{ fontSize: 14, color: colors.secondary, marginTop: 4 }}
            >
              general.cleanFilters
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Modal
        visible={visible}
        setVisible={setVisible}
        style={styles.modalStyle}
      >
        <View
          style={[
            styles.modalContainer,
            defaultStyle.rtlAlignItems,
            { width: width },
          ]}
        >
          <View style={[defaultStyle.rtlRow, styles.header]}>
            <Text style={{fontWeight: 'bold'}}>general.filterAndSort</Text>
          </View>
          <Form
            initialValues={{
              ...defaultFilters.filters,
              ...defaultFilters.sort,
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {data?.map((item) => renderFormComponent(item))}
            <View style={styles.separatorItems}></View>
            {!isOpen && (
              <SubmitButton title="general.ok" style={styles.submit} />
            )}
          </Form>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: colors.light,
  },
  modalContainer: {
    flex: 1,
  },
  trigerContainer: {
    padding: 10,
    alignItems: 'center',
  },
  header: {
    padding: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  icon: {
    paddingHorizontal: 5,
  },
  separator: {
    marginLeft: 8,
    marginRight: -6,
    borderLeftWidth: 1,
    borderColor: colors.medium,
    marginVertical: 10,
  },
  separatorItems: {
    flex: 1,
  },
  submit: {
    marginTop: 20,
  },
});

export default Filters;
