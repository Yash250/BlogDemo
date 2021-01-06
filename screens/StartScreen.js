import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import Loader from '../components/UI/ActivityLoader';
import * as authActions from '../store/actions/auth';
import { useDispatch } from 'react-redux';

const StartScreen = props => {
    const dispatch = useDispatch();
    useEffect(() => {
        const loadData = async () => {
            const userData = await AsyncStorage.getItem('UserData')
            if (!userData){
                props.navigation.navigate('Auth');
                return;
            }
            const transformData = JSON.parse(userData);
            const {token, userId, expireDate} = transformData;
            const oldDate = new Date(expireDate);
            if (oldDate <= new Date() || !token || !userId){
                props.navigation.navigate('Auth');
                return;
            }
            const expirationTime = oldDate.getTime() - new Date().getTime();
            props.navigation.navigate('Home');
            dispatch(authActions.authenticate(token, userId, expirationTime));
        }
        loadData();
    }, [dispatch]);
    return <Loader />
}


export default StartScreen;