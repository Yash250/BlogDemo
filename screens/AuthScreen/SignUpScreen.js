import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {LinearGradient} from 'expo-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../constants/Colors';
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/actions/auth';
import Loader from '../../components/UI/ActivityLoader';

const SignUpScreen = ({navigation}) => {
    const [enabled, setenabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const [data, setData] = useState({
        name : '',
        email: '',
        password: '',
        confirm_password: '',
        isValidName : true,
        isValidEmail: true,
        isValidPassword: true,
        isValidConfirmPassword: true,
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const refreshButton = () => {
        if (data.isValidEmail && data.isValidPassword && data.isValidName && data.isValidConfirmPassword && data.email.length > 0 && data.password.length > 0
            && data.confirm_password.length > 0 && data.name.length > 0){
            setenabled(true);
        } else{
            setenabled(false);
        }
    }
    useEffect(() => {
        refreshButton();
    }, [data,refreshButton]);
    const textInputChange = (val) => {
        if( val.length !== 0 && emailRegex.test(val.toLowerCase())) {
            setData({
                ...data,
                email: val,
                check_textInputChange: true,
                isValidEmail: true
            });
        } else {
            setData({
                ...data,
                email: val,
                check_textInputChange: false,
                isValidEmail: false
            });
        }
    }
    const handlePasswordChange = (val) => {
        if(val.trim().length >= 8){
            setData({
                ...data,
                password: val,
                isValidPassword : true
            });
        }else {
            setData({
                ...data,
                password: val,
                isValidPassword : false
            });
        }
        
    }
    const handleNameChange = (val) => {
        if(val.trim().length >= 3){
            setData({
                ...data,
                name: val,
                isValidName : true
            });
        }else {
            setData({
                ...data,
                name: val,
                isValidName : false
            });
        }
        
    }
    const handleConfirmPasswordChange = (val) => {
        if (data.password === val){
            setData({
                ...data,
                confirm_password: val,
                isValidConfirmPassword : true
            });
        } else{
            setData({
                ...data,
                confirm_password: val,
                isValidConfirmPassword : false
            });
        }
        
    }
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }
    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }
    const signupHandler = async () => {
        try {
            setLoading(true);
            setError(null);
            await dispatch(authActions.signUpUser(data.email,data.password, data.name));
            navigation.navigate('Home');
        } catch(err){
            setError(err.message);
            setLoading(false);
            if(error){
                Alert.alert('An error occurs!!', error, [
                    {text: 'Okay'}
                ]);
            }
        }
    };
              
    return (
        <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={0}
        style={{flex:1}}
         > 
      <View style={styles.container}>
          <StatusBar backgroundColor={Colors.primary} barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Register Now!</Text>
        </View>       
            <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <ScrollView>
            <Text style={styles.text_footer}>Full Name</Text>
            <View style={styles.action}>
                <Feather 
                    name="user"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Enter your full name"
                    style={styles.textInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType='next'
                    onChangeText={(val) => handleNameChange(val)}
                />
            
            </View>
            { data.isValidName ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Name must be at least 3 characters.</Text>
            </Animatable.View>
            }
             
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Email</Text>
            <View style={styles.action}>
                <Feather 
                    name="mail"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Enter your email"
                    style={styles.textInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType='next'
                    onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            { data.isValidEmail ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Enter valid email</Text>
            </Animatable.View>
            }

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Enter your your Password"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    returnKeyType='next'
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            { data.isValidPassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password should be minimum 8 character.</Text>
            </Animatable.View>
            }

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Confirm Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Enter your confirm Password"
                    secureTextEntry={data.confirm_secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    returnKeyType='go'
                    onChangeText={(val) => handleConfirmPasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateConfirmSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            { data.isValidConfirmPassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password and Confirm password must be same.</Text>
            </Animatable.View>
            }
            <View style={styles.textPrivate}>
                <Text style={styles.color_textPrivate}>
                    By signing up you agree to our
                </Text>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Terms of service</Text>
                <Text style={styles.color_textPrivate}>{" "}and</Text>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Privacy policy</Text>
            </View>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={enabled ? signupHandler : null}
                >
                <LinearGradient
                    colors={['#FFA07A', '#FF6347']}
                    style={[styles.signIn, {
                        opacity: enabled ? 1 : 0.5
                    }]}
                >
                    {loading ? <Loader size='small' color='white' /> :<Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Sign Up</Text>}
                </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.signIn, {
                        borderColor: Colors.primary,
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: Colors.primary
                    }]}>Sign In</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
           
        </Animatable.View>
      </View>
      </KeyboardAvoidingView>
    );
};

SignUpScreen.navigationOptions = {
    headerShown: false
  };

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: Colors.primary
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 20,
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
  });
