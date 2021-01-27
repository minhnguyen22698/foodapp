import React, {Component, useState, useEffect} from 'react';
import {TouchableOpacity, StyleSheet, View, StatusBar} from 'react-native';
import Icons from 'react-native-vector-icons/dist/Ionicons';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Item,
  Input,
} from 'native-base';
import i18n from './../i18n';
function navHeader(props) {
  const [search, setSearch] = useState(false);
  const [text, setText] = useState(props.search || '');
  const onSearchClick = () => {
    setSearch(true);
  };
  const [allowSearch, setAllowSearch] = useState(props.allowSearch || false);
  const [allowSetting, setAllowSetting] = useState(props.setting || false);
  const [allowAddnew, setAllowAddnew] = useState(props.addnew || false);

  useEffect(() => {
    StatusBar.setBackgroundColor('rgba(0,0,0,0)');
    StatusBar.setTranslucent(true);
  });
  const onCancelSearch=()=>{
    props.cancelSearch();
    setSearch(false)
  }

  return !search ? (
    <Header transparent>
      <Body style={s.title}>
        <Title style={s.text(props.color)}>{i18n.t(`${props.title}`)}</Title>
      </Body>

      <Right style={{alignItems: 'center'}}>
        {allowSearch ? (
          <TouchableOpacity onPress={onSearchClick}>
            <Icons name={'search-outline'} size={26} color={'#000000'} />
          </TouchableOpacity>
        ) : null}
        {allowAddnew ? (
          <Icons
            onPress={props.onAddNew}
            style={{padding: 5}}
            name={'add-circle-outline'}
            size={26}
          />
        ) : null}
        {allowSetting ? (
          <Icons
            style={{padding: 5}}
            name="medical-outline"
            size={26}
            onPress={props.onSetting}
          />
        ) : null}
      </Right>
    </Header>
  ) : (
    <Header transparent searchBar rounded>
      <View style={{justifyContent: 'center'}}>
        <Icons
          name={'chevron-back-outline'}
          onPress={onCancelSearch}
          size={30}
          color={'black'}
        />
      </View>
      <Item>
        <Input
          value={props.search}
          onChangeText={props.onChangeSearch}
          placeholder={i18n.t('search')}
          onSubmitEditing={props.onSubmitSearch}
        />
        {/* {text !== '' ? null : (
          <Icons
            name={'close-outline'}
            onPress={() => console.log('searching')}
            size={40}
            color={'black'}
          />
        )} */}
      </Item>
    </Header>
  );
}

const s = StyleSheet.create({
  back: {
    backgroundColor: 'red',
  },
  text: (color) => ({
    fontSize: 20,
    fontFamily: 'cooperb',
    color: color || 'white',
  }),
});

export default navHeader;
