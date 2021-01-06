import React, { useEffect,useState, useCallback } from 'react';
import {View, Text, StyleSheet, Button, StatusBar, FlatList, Alert} from 'react-native';
import {Item, HeaderButtons} from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import { DrawerActions } from "react-navigation-drawer";
import { useDispatch, useSelector } from 'react-redux';
import * as blogActions from '../../store/actions/blog';
import Colors from '../../constants/Colors';
import * as Animatable from 'react-native-animatable';
import Card from '../../components/blog/Card';
import Blog from '../../models/blog';
import Loader from '../../components/UI/ActivityLoader';

const UserBlogScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const blogs = useSelector(state => state.blog.userBlog);
    const userName = useSelector(state => state.auth.name);
    const dispatch = useDispatch();
    const loadedBlog = [];
    for (const key in blogs){
        loadedBlog.push(new Blog(
            key,
            blogs[key].ownerId,
            blogs[key].title,
            blogs[key].description,
            blogs[key].post_by,
            blogs[key].post_date
        ));
    };
    const oneBlog = loadedBlog.pop();
    const loadBlogs = useCallback(async () => {
      setError(null);
      setIsRefreshing(true);
      setLoading(true);
      try {
        await dispatch(blogActions.fetchBlog());
      } catch (err) {
        setError(err.message);
      }
      setIsRefreshing(false);
      setLoading(false);
    }, [dispatch, setLoading, setError]);
    useEffect(
      () => {
        const willFocus = props.navigation.addListener('willFocus', loadBlogs)

        return () => {
          willFocus.remove();
        }
      }, [loadBlogs]
    );
    useEffect(() => {
      setLoading(true);
      loadBlogs().then (
        setLoading(false)
      );
    }, [dispatch, loadBlogs]);

    const selectHandler = (id,title) => {
        props.navigation.navigate('BlogDetail', 
        { blogId : id,
          blogTitle : title});
    };
    if (error) {
        return (
          <View style={styles.centered}>
            <Text>An error occurred!</Text>
            <Text>{error}</Text>
            <Button
              title="Try again"
              onPress={loadBlogs}
              color={Colors.primary}
  
            />
          </View>
        );
      }   
      if (loading && blogs.length === 0) {
        return  <Loader /> 
      }
      if (!loading && blogs.length === 0) {
        return (
          <View style={styles.centered}>
            <Text>No blogs found. Maybe start adding some!</Text>
            <View style={styles.addButton}>
            <Button title='Add Blog' color={Colors.primary} onPress={() => props.navigation.navigate('EditBlog')} />
            </View>
          </View>
        );
      }
    const editHandler = (id) => {
      props.navigation.navigate('EditBlog', {
          blogId : id
      });
  }
    const deleteHandler =  (id) => {
      Alert.alert('Are you sure', 'Do you want to delete this Blog?',[
          { text: 'No', style:'default'},
          {text: 'Yes', style:'destructive', onPress: () => {
              const handleError = async (id) => {
                  await dispatch(blogActions.deleteBlog(id));
              }
              handleError(id);
          } }
      ]);
    }
    return (
    <View style={styles.container}>
     <StatusBar backgroundColor={Colors.primary} barStyle="light-content"/>
      <View style={styles.header}>
          <Text style={styles.text_header}>Hello ! {blogs.length > 0 ? oneBlog.post_by : null}</Text>
      </View>
      <Animatable.View 
          animation="fadeInUpBig"
          style={[styles.footer]}
      >
      <FlatList
      onRefresh = {loadBlogs}
      showsVerticalScrollIndicator={false}
      refreshing = {isRefreshing}
       data={blogs} 
       keyExtractor={(item, index) => {
        return index.toString();
        }}
       renderItem = { item => <Card owner={true} onDelete={() => deleteHandler(item.item.id)} onEdit = {() => editHandler(item.item.id)} id={item.item.id} title={item.item.title} post_by={item.item.post_by} description={item.item.description} post_date={item.item.post_date}
       onViewDetail={() => {props.navigation.navigate('BlogDetail', {blogId : item.item.id, blogTitle : item.item.title})}}
        onSelect = {() => {
            selectHandler(item.item.id,item.item.title)
        }}
        >
        </Card>}
        />
    </Animatable.View>
    </View>
    )
}


UserBlogScreen.navigationOptions = navData => {
    return ( {
    headerLeft : () => <HeaderButtons HeaderButtonComponent = {HeaderButton}>
    <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
    onPress = {() => {navData.navigation.dispatch(DrawerActions.toggleDrawer()) }}  />
    </HeaderButtons>,
    headerRight: () =>  <HeaderButtons HeaderButtonComponent = {HeaderButton}>
    <Item title='Add' iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
    onPress = {() => {navData.navigation.navigate('EditBlog')}}  />
    </HeaderButtons>
});
}

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
          flex: 10,
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
      centered : {
          justifyContent:'center',
          alignItems:'center',
          flex:1
        },
        addButton:{
          justifyContent:'center',
          alignItems:'center'
        }
});


export default UserBlogScreen;