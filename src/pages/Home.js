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
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [sortOption, setSortOption] = useState('등록순');
  const navigation = useNavigation();

  // API 데이터 가져오기
  const fetchData = async () => {
    try {
      /// AsyncStorage에서 토큰 가져오기
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('No JWT token found, redirecting to login.');
        navigation.replace('LoginPage');
        return;
      }

      // API request with authentication
      const response = await fetch(
        `http://10.0.2.2:8080/home?type=${typeFilter}&sort=${sortOption}&search=${searchText}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // 응답 상태 확인
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const responseBody = await response.text(); // 원시 응답 보기
      if (response.status === 200) {
        try {
          const result = JSON.parse(responseBody); // JSON 파싱
          console.log('Received data:', result); // 응답 데이터 로그

          setData(result);
          setFilteredData(result);
        } catch (jsonError) {
          console.error('JSON 파싱 에러:', jsonError);
        }
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('API 요청 에러:', error);
    }
  };

  useEffect(() => {
    fetchData(); // 컴포넌트가 마운트될 때 데이터 가져오기
  }, [typeFilter, sortOption, searchText]); // 필터와 검색 조건이 변경될 때마다 데이터 다시 가져오기

  // 검색 버튼 클릭 시 동작
  const handleSearch = () => {
    console.log('검색 실행:', searchText);
    const filtered = data.filter(item =>
      item.medicineName.includes(searchText),
    );
    console.log('Filtered data:', filtered);
    setFilteredData(filtered);
  };

  const handleShowAll = () => {
    console.log('전체 보기');
    setFilteredData(data);
    setSearchText('');
  };

  // 정렬 버튼 클릭 시 동작
  const handleSort = () => {
    console.log('정렬 실행:', sortOption);
    const sortedData = [...filteredData].sort((a, b) => {
      if (sortOption === '등록순') {
        return a.medicineName.localeCompare(b.medicineName);
      } else {
        return a.expirationDaysInNumber - b.expirationDaysInNumber;
      }
    });
    console.log('Sorted data:', sortedData);
    setFilteredData(sortedData);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('MedicineDetail', {item})}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.textContainer}>
        <Text style={styles.medicineName}>{item.medicineName}</Text>
        <View style={styles.typeBadge(item.type)}>
          <Text style={styles.typeText}>{item.medicineType}</Text>
        </View>
        <Text style={styles.dDay}>{item.expirationDays}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
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
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortOption('유통기한 임박순')}>
            <Text>유통기한 임박순</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
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
    marginRight: 5,
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
    marginHorizontal: 3,
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
