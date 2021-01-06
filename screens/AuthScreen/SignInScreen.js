import React, {useState, useEffect} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {LinearGradient} from 'expo-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Color from '../../constants/Colors';
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/actions/auth';
import Loader from '../../components/UI/ActivityLoader';
const SignInScreen = ({navigation}) => {
    const dispatch = useDispatch();

    const [data, setData] = useState({
        email: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidEmail: true,
        isValidPassword: true,
    });
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const textInputChange = (text) => {
        
        if( text.trim().length >= 4 && emailRegex.test(text.toLowerCase()) ) {
            setData({
                ...data,
                email: text,
                check_textInputChange: true,
                isValidEmail: true
            });
        } else {
            setData({
                ...data,
                email: text,
                check_textInputChange: false,
                isValidEmail: false
            });
        }
    }
    const handlePasswordChange = (text) => {
        if( text.trim().length >= 8 ) {
            setData({
                ...data,
                password: text,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: text,
                isValidPassword: false
            });
        }
    }
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }
    const handleValidUser = (text) => {
        if( text.trim().length >= 4 && emailRegex.test(text.toLowerCase())) {
            setData({
                ...data,
                isValidEmail: true
            });
        } else {
            setData({
                ...data,
                isValidEmail: false
            });
        }
    }
    const forgotPass = () => {
        Alert.alert('Coming Soon!', 'This feature will be coming soon...', [
            {text: 'Okay'}])
    }
    const loginHandler = async () => {
        try {
            setLoading(true);
            setError(null);
            await dispatch(authActions.login(data.email,data.password));
            navigation.navigate('Home');
        } catch(err){
            setError(err.message);
            setLoading(false);
            console.log(err);
        }
    };
    const refreshButton = () => {
        if(data.isValidEmail && data.isValidPassword && data.email.length > 0 && data.password.length > 0){
            setEnabled(true);
        }
    }
    useEffect(() => {
        refreshButton();
    }, [data,error]);
    
    return (
        <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={10}
        style={{flex:1}}
      >
      <View style={styles.container}>
          <StatusBar backgroundColor={Color.primary} barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Welcome!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer]}
        >
            <Text style={[styles.text_footer]}>Email</Text>
            <View style={styles.action}>
                <Feather 
                    name="mail"
                    color={Color.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Enter your email"
                    placeholderTextColor="#666666"
                    style={[styles.textInput]}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(text) => textInputChange(text)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
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
                    color={Color.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Enter your Password"
                    placeholderTextColor="#666666"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput]}
                    autoCapitalize="none"
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
            <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
            </Animatable.View>
            }

            <TouchableOpacity onPress = {forgotPass}>
                <Text style={{color: Color.primary, marginTop:15}}>Forgot password?</Text>
            
            { error ?
            <Animatable.View animation="fadeInLeft" duration={500} style={{alignItems:'center', justifyContent:'center'}}>
            <Text style={[styles.errorMsg, {
                fontSize:15,
                marginTop:10,
                alignItems:'center'
            }]}>{error}</Text>
            </Animatable.View> : null
            }
            </TouchableOpacity>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={loginHandler}
                >
                <LinearGradient
                    colors={['#FFA07A', '#FF6347']}
                    style={[styles.signIn, {
                        opacity : enabled ? 1 : 0.5
                    }]}
                >
                    {loading ? <Loader size='small' color='white' /> : <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Sign In</Text>}
                </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUp')}
                    style={[styles.signIn, {
                        borderColor: '#FF6347',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#FF6347'
                    }]}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
      </View>
      </KeyboardAvoidingView>
      
    );
};

SignInScreen.navigationOptions = {
    headerShown: false
  };

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: Color.primary
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
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
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 30
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
    }
  });
