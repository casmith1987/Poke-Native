import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput } from 'react-native';
import axios from 'axios';

class Pokedex extends Component {
  constructor() {
    super();
    this.state = {
      pokemon: null,
      text: '',
      notApokemon: false,
      memo: {},
    };
    this.handleChange = this.handleChange.bind(this);
  }
  async componentDidMount() {
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/1');
    this.setState({ ...this.state, pokemon: data });
    let name = data.name;
    if (!this.state.memo[this.state.pokemon.name]) {
      this.setState({
        ...this.state,
        memo: { ...this.state.memo, [data.id]: data },
      });
    }
  }
  async handleChange() {
    if (!this.state.text.length) return;
    if (this.state.memo[this.state.text])
      this.setState({
        ...this.state,
        pokemon: this.state.memo[this.state.text],
        notApokemon: false,
      });
    else {
      try {
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${this.state.text}`
        );
        this.setState({
          ...this.state,
          pokemon: data,
          notApokemon: false,
          memo: { ...this.state.memo, [data.id]: data },
        });
      } catch (err) {
        this.setState({ ...this.state, notApokemon: true });
        console.log(err);
      }
    }
  }
  render() {
    let image;
    if (this.state.notApokemon)
      return (
        <View style={styles.container}>
          <View style={{ height: 80 }}></View>
          <TextInput
            style={{
              height: 30,
              width: 100,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 50,
            }}
            onChangeText={async (text) => {
              await this.setState({ ...this.state, text: text });
              this.handleChange();
            }}
            keyboardType={'numeric'}
          />
          <Text>Pokemon Does Not Exist.</Text>
        </View>
      );
    if (this.state.pokemon !== null) {
      image = { uri: this.state.pokemon.sprites.front_default };
    }
    if (!this.state.pokemon) return <Text>Loading...</Text>;
    else
      return (
        <View style={styles.container}>
          <View style={{ height: 80 }}></View>
          <TextInput
            style={{
              height: 30,
              width: 100,
              borderColor: 'gray',
              borderWidth: 1,
              marginBottom: 50,
            }}
            onChangeText={async (text) => {
              await this.setState({ ...this.state, text: text });
              this.handleChange();
            }}
            keyboardType={'numeric'}
          />
          <Text style={{ fontSize: 30 }}>
            {this.state.pokemon.name[0].toUpperCase() +
              this.state.pokemon.name.slice(1)}
          </Text>
          <Image source={image} style={{ height: 340, width: 340 }} />
          <Text></Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default Pokedex;
