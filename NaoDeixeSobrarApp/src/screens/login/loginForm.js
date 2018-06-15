//import liraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Image, ImageBackground } from 'react-native';
import ls from 'react-native-local-storage';
import { urlBackend } from '../../utils/urlUtils';

// create a component
export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
          user: '',
          password: '',
          loading: false,
        };
        this.doLogin = this.doLogin.bind(this);
      }
    
    doLogin() {
        fetch(`${urlBackend()}NaoDeixeSobrarRest/rest/user/login`, {
            method: 'POST',
            headers: {
                //accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.user,
                password: this.state.password
            }),
        }).then((result) => {
            this.setState({ loading: false });
            result.json().then((resultado) => {
                if (result.ok) {
                ls.save('ls.token', resultado.token);
                alert(`Usuário logado com sucesso: ${resultado.token}`);
                //this.props.navigation.navigate('Consulta')
            } else {
                if (resultado.length > 0) {
                    alert(resultado[0].mensagem);
                } else {
                    alert(resultado.mensagem);
                }
            }
            })
        }).catch((error) => {
            alert('erro');
            this.setState({ loading: false });
            alert(error.message);
        });
    };

    render() {
        return (
            <ImageBackground resizeMode="contain" style={styles.mainContainer} source={require('../../images/background.jpg')}>
                <KeyboardAvoidingView behavior="padding" style={styles.mainContainer} >
                    <View style={styles.loginContainer}>
                        <Image resizeMode="contain" style={styles.logo} source={require('../../images/logo.png')} />
                    </View>
                    <View style={styles.container}>
                        <TextInput style = {styles.input} 
                                    autoCapitalize="none" 
                                    onSubmitEditing={() => this.passwordInput.focus()} 
                                    autoCorrect={false} 
                                    keyboardType='email-address' 
                                    returnKeyType="next" 
                                    placeholder='LOGIN' 
                                    placeholderTextColor='rgb(105,105,105)'
                                    value={this.state.user}
                                    onChangeText={(user) => this.setState({ user })}
                        />
                        <TextInput style = {styles.input}   
                                returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                                placeholder='SENHA' 
                                placeholderTextColor='rgb(105,105,105)' 
                                secureTextEntry
                                value={this.state.password}
                                onChangeText={(password) => this.setState({ password })}
                        />
                        <TouchableOpacity style={styles.buttonContainer} onPress={this.doLogin}>
                            <Text style={styles.buttonText}>ENTRAR</Text>
                        </TouchableOpacity> 
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
       );
    }
}

// define your styles
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        padding: 20,
    },
    input:{
        height: 35,
        backgroundColor: 'white',
        marginBottom: 10,
        padding: 10,
        color: 'rgb(105,105,105)',
        width: 230,
    },
    buttonContainer:{
        backgroundColor: 'rgb(255,69,0)',
        paddingVertical: 10,
        height: 35,
        width: 280,
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    },
    loginContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        top: 90,
        width: 600,
        height: 200
    }
});
