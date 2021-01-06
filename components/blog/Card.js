import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Alert, Modal, Platform, Share} from 'react-native';
import Colors from '../../constants/Colors';
import { Entypo } from '@expo/vector-icons'; 
import { MaterialIcons, Feather } from '@expo/vector-icons'; 
import { useSelector } from 'react-redux';

const Card = (props) => {
  const [modalVisible, setModalVisible] = useState(false);   
  const [isOwner, setIsOwner] = useState(false);
  const userId = useSelector(state => state.auth.userId)

  const ownerHandler = (ownerId, userId) => {
    if(ownerId === userId){
      setIsOwner(true);
    } else{
      setIsOwner(false);
    }   
  }
  const {ownerId} = props;
  useEffect(() => {
    ownerHandler(ownerId, userId);
  }, [isOwner, userId, ownerId]);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Title : ${props.title} , Description : ${props.description}`,
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
  
  return (
    <TouchableOpacity onPress={props.onViewDetail} key={props.id}>
      <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={isOwner ? styles.modalView : [styles.modalView, {
            width:150,
            height:150
          }]}>
            {isOwner ? <View><TouchableOpacity style={styles.border} onPress={() => {
              props.onEdit();
              setModalVisible(false);
            }}
              >
            <Feather 
                    style={{marginRight:5, marginTop:5}}
                    name="edit"
                    color={Colors.primary}
                    size={20}
                />
            <Text style={styles.modalText}>Edit </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.border} onPress={() => {
              props.onDelete();
            }}>
            <MaterialIcons 
                    style={{marginRight:5}}
                    name="delete"
                    color={Colors.primary}
                    size={20}
                />
            <Text style={styles.modalText}>Delete </Text>
            </TouchableOpacity>
            </View> : null }
            <TouchableOpacity style={styles.border} onPress={() => {
              onShare();
            }}>
            <Feather 
                    style={{marginRight:5}}
                    name= 'share-2'
                    color={Colors.primary}
                    size={20}
                />
            <Text style={styles.modalText}>Share </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalText}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.modalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>

      <View  style={styles.card}>
        <View style={styles.cardInfo}>
          <View style={styles.myModal}>
          <Text style={styles.post_by}>{props.post_by}</Text>
         <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Entypo name="dots-three-vertical" size={20} color={Colors.primary} />
          </TouchableOpacity>
          </View>
          <Text style={styles.date}>{props.post_date}</Text>
          <Text style={styles.cardTitle}>Title: {props.title}</Text>
          <Text numberOfLines={2} style={styles.cardDetails}>Description : {props.description}</Text>
          <View style={styles.button}>
          <TouchableOpacity onPress={props.onSelect}>
              <Text style={styles.button}>See more</Text>
              </TouchableOpacity>
            {props.owner ? <View style={styles.twoButton}>
            <TouchableOpacity onPress={props.onEdit}>
              <Text style={styles.button}>Edit </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={props.onDelete}>
              <Text style={styles.button}>Delete </Text>
              </TouchableOpacity>
            </View> : null }
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;
const styles = StyleSheet.create({
  card: {
    height: 150,
    marginVertical: 10,
    flexDirection: 'row',
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardImgWrapper: {
    flex: 1,
  },
  cardInfo: {
    flex: 2,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#fff',
    justifyContent:'space-between'
  },
  cardTitle: {
    fontFamily:'open-sans'
  },
  cardDetails: {
    fontSize: 12,
    color: '#444',
    fontFamily:'open-sans'
  },
  post_by:{
      fontFamily: 'open-sans-bold',
      fontSize:15
  },
  button:{
      color: Colors.primary,
      fontSize:15
  },
  date:{
    fontSize: 10,
    color: '#888',
    fontFamily:'open-sans'
  },
  twoButton : {
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:10
  },
  centeredView: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent:'center',
    height:200,
    width:170
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    color:Colors.primary,
    fontSize:20
  },
  myModal : {
    flexDirection:'row',
    justifyContent:'space-between'
  },
  border : {
    flexDirection:'row',
    marginBottom:10
  },
});


