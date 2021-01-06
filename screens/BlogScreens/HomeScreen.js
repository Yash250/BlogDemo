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

const HomeScreen = (props) => {
    const [loading, setLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const blogs = useSelector(state => state.blog.availableBlog);
    const date = new Date;
    let hours = date.getHours();
    let status = (hours < 12)? "Good Morning!" :
                ((hours <= 18 && hours >= 12 ) ? "Good Afternoon!" : ((hours > 18 && hours <=21) ? 'Good Evening!' :  "Good Night!" ));
    const dispatch = useDispatch();
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
    //   if (!loading && blogs.length === 0) {
    //     return (
    //       <View style={styles.centered}>
    //         <Text>No blogs found. Maybe start adding some!</Text>
    //       </View>
    //     );
    //   }
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
    const onView = (item) => {
        console.log(item)
    }
    
    return (
    <View style={styles.container}>
     <StatusBar backgroundColor={Colors.primary} barStyle="light-content"/>
      <View style={styles.header}>
          <Text style={styles.text_header}>{status}</Text>
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
       renderItem = { item => <Card title={item.item.title} id={item.item.id} onDelete={() => deleteHandler(item.item.id)} onEdit = {() => editHandler(item.item.id)} ownerId={item.item.ownerId} post_by={item.item.post_by} description={item.item.description} post_date={item.item.post_date}
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


HomeScreen.navigationOptions = navData => {
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
        }
});


export default HomeScreen;