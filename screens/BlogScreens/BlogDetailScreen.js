import React,{useEffect, useState} from 'react';
import {Text, StyleSheet, Share, ScrollView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useSelector, useDispatch} from 'react-redux'
import Colors from '../../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';

const BlogDetailScreen = (props) => {
    const blogId = props.navigation.getParam('blogId');
    const [isOwner, setIsOwner] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const blog = useSelector(state => state.blog.availableBlog.find(blog => blog.id === blogId))
    const userId = useSelector(state => state.auth.userId);
    const dispatch = useDispatch();
    const checkButton = async () => {
        if (userId){
            if(blog.ownerId === userId) {
            setIsOwner(true);
            }
        }
    }
    
    useEffect(() => {
        checkButton();
    },[isOwner,checkButton, blogId, deleted])
    
    useEffect(() => {
        const onShare = async () => {
            try {
              const result = await Share.share({
                message: `Title : ${blog.title} , Description : ${blog.description}`,
              });
              if (result.action === Share.sharedAction) {
                if (result.activityType) {
                  // shared with activity type of result.activityType
                } else {
                  // shared
                }
              } else if (result.action === Share.dismissedAction) {
                // dismissed
              }
            } catch (error) {
              alert(error.message);
            }
          };
        props.navigation.setParams({ share: onShare});
      }, []);
    

    return (
   <Animatable.View 
    animation="fadeInUpBig"
    style={[styles.footer]}>
        <ScrollView showsHorizontalScrollIndicator={false}>
        <Text style={styles.title}>Title : {blog.title}</Text>
        <Text style={styles.date}>Post Date: {blog.post_date}</Text>
        <Text style={styles.des}><Text style={{fontWeight:'bold'}}>Description :</Text> {blog.description}</Text>
        <Text style={styles.title2}>Blog by: : {blog.post_by}</Text>
        </ScrollView>
    </Animatable.View>
    );
}

BlogDetailScreen.navigationOptions = navData => {
    const onShare = navData.navigation.getParam('share');
    return {
        headerTitle : navData.navigation.getParam('blogTitle'),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
              <Item
                title="Share"
                iconName='share-social-outline'
                onPress={onShare}
              />
            </HeaderButtons>
          )
    }
};

const styles = StyleSheet.create({
    footer: {
        flex: 1,
        backgroundColor: Colors.primary,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    title : {
        color: 'white',
        fontSize: 20,
        fontFamily : 'open-sans-bold',
        marginBottom: 20
    },
    des : {
        color:'white',
        fontFamily:'open-sans',
        fontSize:15
    },
    date: {
        color: 'white',
        fontFamily: 'open-sans',
        marginBottom: 10
    },
    buttons : {
        flexDirection : 'row',
        justifyContent: 'space-between',
        height:'25%',
        marginHorizontal: 20,
        marginTop : 20,
        marginBottom:1
    },
    b1: {
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white'

    },
    title2 : {
        color: 'white',
        fontSize: 15,
        fontFamily : 'open-sans-bold',
        marginTop: 20
    },
});

export default BlogDetailScreen;