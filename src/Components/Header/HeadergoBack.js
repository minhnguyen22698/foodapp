import React, {Component, useState, useEffect} from 'react';
import {TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
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
  const [text, setText] = useState();
  const [allowSearch, setAllowSearch] = useState(props.allowSearch || false);
  const onSearchClick = () => {
    setSearch(true);
    console.log('press');
  };
  const onChangeSearch = (val) => {
    setText(val);
  };
  useEffect(() => {
    StatusBar.setBackgroundColor('rgba(0,0,0,0)');
    StatusBar.setTranslucent(true);
  });

  return !search ? (
    <Header transparent>
      <Left>
        <Icons
          name={'arrow-back-outline'}
          size={26}
          color={props.color || 'black'}
          onPress={props.onGoBack}
        />
      </Left>
      <Body style={s.title}>
        <Title style={s.text(props.color)}>{i18n.t(`${props.title}`)}</Title>
      </Body>
      {allowSearch ? (
        <Right>
          <TouchableOpacity onPress={onSearchClick}>
            <Icons
              name={'search-outline'}
              size={26}
              color={props.color || '#00000'}
            />
          </TouchableOpacity>
        </Right>
      ) : null}
    </Header>
  ) : (
    <Header transparent searchBar rounded>
      <View style={{justifyContent: 'center'}}>
        <Icons
          name={'chevron-back-outline'}
          onPress={() => setSearch(false)}
          size={30}
          color={'black'}
        />
      </View>
      <Item>
        <Input
          value={text}
          onChangeText={onChangeSearch}
          placeholder={i18n.t('search')}
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
    fontFamily: 'cooperb',
    color: color || 'black',
  }),
});

export default navHeader;
