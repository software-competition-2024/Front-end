import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  //API 연동 시 코드
  /*
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await fetch(''); //API URL 입력하기
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };*/
  const initialData = [
    {id: '1', name: '약품명1', type: '처방약', dDay: 'D-00'},
    {id: '2', name: '약품명2', type: '상비약', dDay: 'D-00'},
    {id: '3', name: '약품명3', type: '처방약', dDay: 'D-00'},
    {id: '4', name: '약품명4', type: '상비약', dDay: 'D-00'},
  ];
  const [data, setData] = useState(initialData);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(initialData);
  const [isSorted, setIsSorted] = useState(false);
  const navigation = useNavigation();

  const handleSearch = () => {
    const filtered = data.filter(item => item.name.includes(searchText));
    setFilteredData(filtered);
  };

  const handleShowAll = () => {
    setFilteredData(data);
    setSearchText('');
  };

  const handleSort = () => {
    const sortedData = [...filteredData].sort((a, b) => a.id - b.id);
    setFilteredData(sortedData);
    setIsSorted(true);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('MedicineDetail', {item})}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.textContainer}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <View style={styles.typeBadge(item.type)}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <Text style={styles.dDay}>{item.dDay}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MediMate</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="약품명을 입력하세요"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Image
            source={require('../../assets/icon/search.png')}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>약품 목록</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity style={styles.filterButton} onPress={handleShowAll}>
            <Text>전체</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
            <Text>등록순</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1F2178',
    paddingVertical: 18,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 20,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderColor: '#1F2178',
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  searchButton: {
    marginLeft: 10,
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    marginRight: 10,
    borderColor: '#1F2178',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#1F2178',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  listContainer: {
    paddingTop: 10,
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  flatList: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1F2178',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  imagePlaceholder: {
    width: 100,
    height: 50,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  typeBadge: type => ({
    backgroundColor: type === '상비약' ? '#4095FE' : '#1F2178',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 5,
  }),
  typeText: {
    color: '#fff',
    fontSize: 12,
  },
  dDay: {
    fontSize: 16,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default Home;
