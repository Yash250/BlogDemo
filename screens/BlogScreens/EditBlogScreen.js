import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  TextInput, 
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import HeaderButton from '../../components/UI/HeaderButton';
import * as blogActions from '../../store/actions/blog';
import Color from '../../constants/Colors';
import * as Animatable from 'react-native-animatable';
import Loader from '../../components/UI/ActivityLoader';
import AsyncStorage from '@react-native-community/async-storage'

const EditBlogScreen = props => {
  const blogId = props.navigation.getParam('blogId');
  const blog = useSelector(state => state.blog.availableBlog.find(blog => blog.id === blogId));
  const dispatch = useDispatch();
  let dateP = new Date();
  dateP = dateP.toLocaleString('en-US');
    const [data, setData] = useState({
        title: blogId ? blog.title : '',
        description: blogId ? blog.description : '',
        check_textInputChange: false,
        isValidTitle: true,
        isValidDescription: true,
    });
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const textInputChange = (text) => {
        
        if( text.trim().length >= 3 ) {
            setData({
                ...data,
                title: text,
                check_textInputChange: true,
                isValidTitle: true
            });
        } else {
            setData({
                ...data,
                title: text,
                check_textInputChange: false,
                isValidTitle: false
            });
        }
    }
    const handleDesChange = (text) => {
        if( text.trim().length >= 6 ) {
            setData({
                ...data,
                description: text,
                isValidDescription: true
            });
        } else {
            setData({
                ...data,
                description: text,
                isValidDescription: false
            });
        }
    }

    const handleValidUser = (text) => {
      if( text.trim().length >= 3 ) {
          setData({
              ...data,
              isValidTitle: true
          });
      } else {
          setData({
              ...data,
              isValidTitle: false
          });
      }
  }
  const refreshButton = () => {
    if(data.isValidDescription && data.isValidTitle ){
        setEnabled(true);
    }
}
  useEffect(() => {
      refreshButton();
  }, [data,error, enabled]);

  const submitHandler = useCallback(async () => {
    if (!enabled && !blogId) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'Okay' }
      ]);
      return;
    }
    const data1 = await  AsyncStorage.getItem('UserData');
    const userData = JSON.parse(data1);
    setError(null);
    setLoading(true);
    try {
      let action;
      if(blog && blogId){
        action = blogActions.updateBlog(
          blogId,
          data.title,
          data.description)
      } else {
        action = blogActions.createBlog(
          data.title,
          data.description,
          userData.name,
          dateP
        );
      }
      await dispatch(action);
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
  setLoading(false);  
  }, [dispatch, data]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler});
  }, [submitHandler, enabled]);
    
  if(loading){
    return <Loader color={Color.primary} size='large' />
  }
     return (
        <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={10}
        style={{flex:1}}
      >
      <TouchableWithoutFeedback style={styles.container} onPress = {() => Keyboard.dismiss()}>
      <ScrollView style={{flex:1,backgroundColor: '#fff'}} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
          <StatusBar backgroundColor={Color.primary} barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Think unique and innovative and convert it into words...</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer]}
        >
           
            <Text style={[styles.text_footer]}>Title</Text>
            <View style={styles.action}>
                <TextInput 
                    placeholder="Enter title"
                    placeholderTextColor="#666666"
                    style={[styles.textInput]}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(text) => textInputChange(text)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                    value = {data.title}
                />
            </View>
            { data.isValidTitle ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Title must be more than 3 character.</Text>
            </Animatable.View>
            }
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Description</Text>
            <View style={styles.action} >
                <TextInput 
                    placeholder="Enter Description"
                    placeholderTextColor="#666666"
                    style={[styles.textInput]}
                    autoCapitalize="none"
                    onChangeText={(val) => handleDesChange(val)}
                    multiline
                    numOfLines={5}
                    value={data.description}
                />
              </View>
            { data.isValidDescription ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Description must be more than 6 character.</Text>
            </Animatable.View>
            }       
            
        </Animatable.View>
      </View>
      </ScrollView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
    );
};

EditBlogScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  const id = navData.navigation.getParam('blogId');

  return {
    headerTitle: navData.navigation.getParam('blogId')
      ? 'Edit Blog'
      : 'Create Blog',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

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
        flex: 4,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30,
        fontFamily: 'dancing',
        marginTop : 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: Color.primary,
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

export default EditBlogScreen;