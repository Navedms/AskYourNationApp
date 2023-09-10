import React, {
  ComponentProps,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useFormikContext } from 'formik';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ErrorMessage from './ErrorMessage';
import colors from '../../config/colors';
import defaultStyle from '../../config/style';
import Text from '../Text';
import TextInput from '../AppTextInput';
import { TouchableOpacity } from 'react-native';
import FormSelectItem from './FormSelectItem';
import askBeforeDelete from '../askBeforeDelete';

export interface Item {
  value: string;
  id: string;
}

interface AppFormListMakerProps {
  firstValue?: Item[];
  selectFirstValue: 'Single' | 'Multi';
  name: string;
  title: string;
  selectName: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  placeholder: string;
  optionPlaceholder?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  border?: number;
  backgroundColor?: string;
  placeholderColor?: string;
  width?: number;
  fixedPadding?: number;
  disabled?: boolean;
  limit?: number;
  onChange?: (name: string, value: Item[] | null) => void;
  onPress: (name: string, value: string) => void;
  scrollViewRef: any;
  style?: Object;
}

function AppFormListMaker({
  firstValue,
  selectFirstValue,
  name,
  selectName,
  title,
  icon,
  placeholder,
  optionPlaceholder = 'Add Option',
  border = 1,
  backgroundColor = colors.veryLight,
  placeholderColor = colors.dark,
  width = 1,
  fixedPadding = 40,
  disabled,
  limit = 0,
  onChange,
  onPress,
  scrollViewRef,
  style,
}: AppFormListMakerProps) {
  const { setFieldValue, errors, touched } = useFormikContext();
  const [value, setValue] = useState<Item[]>(firstValue || []);

  const windowWidth = (Dimensions.get('window').width - fixedPadding) * width;

  const handleFirstValue = (firstValue: Item[]) => {
    if (firstValue?.length > 0) {
      setFieldValue(name, firstValue);
      setValue(firstValue);
    } else if (value?.length === 0) {
      handleAddOption();
    }
  };

  const handleOnChangeText = (id: string, text: string) => {
    const index = value.findIndex((obj) => obj.id == id);
    const newValueList = value;
    newValueList[index].value = text;
    setValue(newValueList);

    onChange && onChange(name, newValueList);
    setFieldValue(name, newValueList);
  };

  const handleOnPress = (name: string, value: string) => {
    onPress && onPress(name, value);
    setFieldValue(name, value);
  };

  useEffect(() => {
    handleFirstValue(firstValue);
  }, [firstValue]);

  const handleAddOption = () => {
    if (value?.length < limit || limit === 0) {
      setValue([...value, { id: `option-${value.length + 1}`, value: '' }]);
      scrollViewRef && scrollViewRef.current?.scrollToEnd();
    }
  };

  const handleDeleteOption = async (id: string) => {
    const answer = await askBeforeDelete(
      'alerts.deleteFormListMaker.title',
      'alerts.deleteFormListMaker.text'
    );
    if (answer) {
      if (answer === 'pass') return;
      const tempList = value
        .filter((obj) => obj.id !== id)
        .map((obj, index) => {
          obj.id = `option-${index + 1}`;
          return obj;
        });
      setValue(tempList);

      onChange && onChange(name, tempList);
      setFieldValue(name, tempList);
    }
  };

  return (
    <>
      <View
        style={[
          styles.container,
          style,
          {
            backgroundColor: backgroundColor,
            borderWidth: border,
            width: windowWidth,
          },
        ]}
      >
        <View style={[defaultStyle.rtlRow, styles.header]}>
          <View style={[defaultStyle.rtlRow, styles.headerInner]}>
            {icon && (
              <MaterialCommunityIcons
                name={icon}
                size={28}
                color={colors.dark}
                style={styles.icon}
              />
            )}
            <Text style={{ color: placeholderColor }}>{placeholder}</Text>
          </View>
          <TouchableOpacity
            disabled={
              disabled ||
              (!value[value.length - 1]?.value && value.length) ||
              (value?.length >= limit && limit !== 0)
            }
            onPress={handleAddOption}
            style={[
              styles.addBtn,
              {
                opacity:
                  disabled ||
                  (!value[value.length - 1]?.value && value.length) ||
                  (value?.length >= limit && limit !== 0)
                    ? 0.5
                    : 1,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="plus"
              size={28}
              color={colors.primary}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        {value?.map((item: Item, index: number) => (
          <View
            key={item.id}
            style={[defaultStyle.rtlRow, styles.listContainer]}
          >
            <View style={[defaultStyle.rtlRow, styles.headerInner]}>
              <Text style={[{ color: colors.dark }, defaultStyle.bold]}>{`.${(
                index + 1
              ).toString()}`}</Text>
              <TextInput
                value={item.value}
                style={[styles.textInput, { backgroundColor: backgroundColor }]}
                onChangeText={(value: any) =>
                  handleOnChangeText(item.id, value)
                }
                placeholder={optionPlaceholder}
                noLabel={true}
              />
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteOption(item.id)}
              disabled={disabled || !item.value}
            >
              <MaterialCommunityIcons
                name="delete"
                size={20}
                color={
                  disabled || !item.value ? colors.disabled : colors.lightDelete
                }
              />
            </TouchableOpacity>
          </View>
        ))}
        <View style={{ padding: 10 }}>
          <FormSelectItem
            name={selectName}
            title={title}
            firstValue={selectFirstValue === 'Multi' ? true : false}
            onPress={(value: boolean) =>
              handleOnPress(selectName, value ? 'Multi' : 'Single')
            }
          />
        </View>
      </View>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginVertical: 10,
    paddingBottom: 15,
    justifyContent: 'flex-start',
    zIndex: 1,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerInner: {
    alignItems: 'center',
  },
  listContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
  },
  addBtn: {
    alignSelf: 'flex-end',
  },
  icon: {
    marginLeft: 10,
    marginRight: 14,
    marginVertical: 12,
  },
  textInput: {
    borderRadius: 0,
    borderBottomColor: colors.dark,
    borderBottomWidth: 1,
    width: '90%',
  },
});

export default AppFormListMaker;
