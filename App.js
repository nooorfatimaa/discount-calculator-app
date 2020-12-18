import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Pressable, Button, TextInput, Alert, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataTable } from 'react-native-paper';

const StartScreen = ({navigation, route}) => {
  const[ogPrice, setPrice] = useState(0);
  const[discount, setDiscount] = useState(0);
  const[saving, setSaving] = useState(0);
  const[finalPrice, setFinal] = useState(0);
  const[history, setHistory] = useState([]);

  useEffect(()=>{calculate()});

  const calculate = () => {
    let temp = 0;
    if (ogPrice >= 0 && discount <100 && discount >0){
      temp = ((100-discount)/100)*ogPrice;
      setFinal(temp.toFixed(2));
      setSaving((ogPrice-temp).toFixed(2));
      Keyboard.dismiss;
    }
    else if (discount > 100) {
      Alert.alert("Warning","Enter a number less than 100 for discount.");
      setPrice(0);
      setDiscount(0);
      setFinal(0);
      setSaving(0);
    }
    else if (discount < 0 || ogPrice < 0) {
      Alert.alert("Invalid input. Make sure you enter positive numbers only.");
      setPrice(0);
      setDiscount(0);
      setFinal(0);
      setSaving(0);
    }
  }

  const save = () => {
    setHistory([...history,{ogData: ogPrice, discData: discount, fpData: finalPrice}]);
    setPrice(0);
    setDiscount(0);
    setFinal(0);
    setSaving(0);
  }

  navigation.setOptions({headerRight: () => <Button title="History" color="coral" onPress={()=> navigation.navigate("History",{HistoryList: history, HistoryFunction: setHistory})} />})

  return (
    <View style={styles.container}>
      <Text style={styles.hdr}>DISCOUNT APP</Text>
      <View style={styles.box}>
        
        <Text style={styles.txt}>Original Price</Text>
        <TextInput style={styles.txtInput}
          keyboardType = {"number-pad"}
          onChangeText ={(text) => setPrice(text)}
          value = {ogPrice}
          placeholder = "enter original price"
          onEndEditing={Keyboard.dismiss}
        />
        <Text style={styles.txt}>Discount Percentage</Text>
        <TextInput style={styles.txtInput}
          keyboardType = {"number-pad"}
          onChangeText={(text) => setDiscount(text)}
          value = {discount}
          placeholder = "enter discount % (< 100)"
          onEndEditing={Keyboard.dismiss}
        />
        <Pressable onPress={() => save()} disabled={ogPrice===0 && discount===0} style={styles.btn}><Text>SAVE</Text></Pressable>
      </View>
      <View style={styles.box2}>
        <Text style={styles.txt2}>You save: {saving}</Text>
        <Text style={styles.txt2}>Final Price: {finalPrice}</Text>
      </View>
    </View>
  );
    
}

const HistoryScreen = ({navigation, route}) => {
  const HistoryList = route.params.HistoryList;
  const HistoryFunction = route.params.HistoryFunction;
  const [historyScreenList, setHisScreenList] = useState(HistoryList);

  const clear = () => {
    Alert.alert("Warning","This will clear all saved history. Do you want to continue?",
    [{text:'Yes',onPress:()=>{
      setHisScreenList([]); 
      navigation.setParams(HistoryFunction([]))}},
    {text:'No',onPress:()=>{}}]
    );
  }

  navigation.setOptions({headerRight: () => <Button title="Clear" color="coral" onPress={()=> clear()}/>})

  const del = (itemIndex) => {
    let tempList = HistoryList.filter((data,index)=>index!==itemIndex);
    navigation.setParams(HistoryFunction(tempList));
    setHisScreenList(tempList);
  }

  return(
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Index</DataTable.Title>
        <DataTable.Title>Original</DataTable.Title>
        <DataTable.Title>Discount %</DataTable.Title>
        <DataTable.Title numeric>Final Price</DataTable.Title>
        <DataTable.Title></DataTable.Title>
      </DataTable.Header>
      {historyScreenList.map((item, index)=>{
        return(
      <DataTable.Row>
        <DataTable.Cell>{index+1}</DataTable.Cell>
        <DataTable.Cell>{item.ogData}</DataTable.Cell>
        <DataTable.Cell>{item.discData}</DataTable.Cell>
        <DataTable.Cell>{item.fpData}</DataTable.Cell>
        <DataTable.Cell numeric><Pressable onPress={() => del(index)} style={{backgroundColor:"grey", borderRadius: 5, width:20, alignItems:"center"}}><Text style={{color: "red"}}>X</Text></Pressable></DataTable.Cell>
      </DataTable.Row>
        )
      })}
    </DataTable>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={"Start"} 
        screenOptions={{
          headerTintColor: "black",
          headerStyle: {
            backgroundColor: "coral"
          }
        }}>
        <Stack.Screen name="Start" component={StartScreen}/>
        <Stack.Screen name="History" component={HistoryScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ecf0f1',
  },
  box: {
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    marginTop: 15,
  },
  hdr : {
    fontSize: 40,
    marginLeft: 50,
    marginBottom: 25,
    fontWeight: 'bold',
    color: 'coral', 
    fontFamily: 'monospace',
  },
  txt : {
    fontSize: 15,
    fontWeight: "bold",
    color: 'black', 
    fontFamily: "monospace",
  },
  txt2 : {
    fontSize: 20,
    color: 'black', 
    fontFamily: "monospace",
  },
  txtInput: {
    width: "90%",
    height: 70,
    borderColor: "coral",
    borderWidth: 1,
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  box2: {
    justifyContent: "flex-start",
    width: 300,
    height: 80,
    marginTop: 40,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'coral',
    height: 40,
    width: 180,
    marginBottom: 4,
  }
});


export default App;
