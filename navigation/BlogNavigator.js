import React from 'react';
import {View, SafeAreaView, Button} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import SplashScreen from '../screens/AuthScreen/SplashScreen';
import SignInScreen from '../screens/AuthScreen/SignInScreen';
import SignUpScreen from '../screens/AuthScreen/SignUpScreen';
import HomeScreen from '../screens/BlogScreens/HomeScreen';
import StartScreen from '../screens/StartScreen';
import UserBlogScreen from '../screens/UserScreens/UserBlogScreen';
import Colors from '../constants/Colors';
import {createDrawerNavigator,DrawerNavigatorItems} from 'react-navigation-drawer';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';
import { Ionicons } from '@expo/vector-icons';
import BlogDetailScreen from '../screens/BlogScreens/BlogDetailScreen';
import EditBlogScreen from '../screens/BlogScreens/EditBlogScreen';


const defaultNavOption = {
    headerStyle : {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : null 
    },
    headerTitleStyle : {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle : {
        fontFamily: 'open-sans'
    },
    headerTintColor : Platform.OS === 'android' ? 'white' : Colors.primary
}

const AuthNavigator = createStackNavigator({
    Splash : SplashScreen,
    SignIn : SignInScreen,
    SignUp : SignUpScreen,
});

const StartNavigator = createStackNavigator({
    Start : StartScreen,
  }, {
    defaultNavigationOptions : defaultNavOption
  });

const BlogNavigator = createStackNavigator({
    Home : HomeScreen,
    EditBlog : EditBlogScreen,
    BlogDetail : BlogDetailScreen
},{
    navigationOptions: {
        drawerIcon: drawerConfig => (
          <Ionicons
            name='home-outline'
            size={23}
            color={drawerConfig.tintColor}
          />
        )
      },
    defaultNavigationOptions : defaultNavOption
        
});

const UserNavigator = createStackNavigator({
  UserBlog : UserBlogScreen,
  BlogDetail : BlogDetailScreen,
  EditBlog : EditBlogScreen,
}, {
  navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name='person-circle-outline'
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
      title: 'My blogs'
    },

  defaultNavigationOptions : defaultNavOption
});

const DrawerNavigator = createDrawerNavigator({
    Blogs : BlogNavigator,
    UserBlog : UserNavigator
},{
    contentOptions: {
      activeTintColor: Colors.primary
    },
    contentComponent : props => {
      const dispatch = useDispatch();
      return <View style={{flex:1, paddingTop:20}}>
        <SafeAreaView forceInset={{top:'always', horizontal:'never'}}>
        <DrawerNavigatorItems {...props} />
        <Button title='Logout' color={Colors.primary} onPress = {() => {
          dispatch(authActions.logout());
        }} />
        </SafeAreaView>
      </View>

    }
  }
);

const MainNavigator = createSwitchNavigator({
    Start: StartNavigator,
    Auth : AuthNavigator,
    Home : DrawerNavigator
  });


export default createAppContainer(MainNavigator);