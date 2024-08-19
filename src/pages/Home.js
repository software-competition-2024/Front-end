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
import {useNavigation, useFocusEffect} from '@react-navigation/native';
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
      const jwtToken = 
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIxMjIyMkBleGFtcGxlLmNvbSIsImlhdCI6MTcyMzk3NTgzMSwiZXhwIjoxNzIzOTc3NjMxfQ.-LWx1XMl4_IWp5YBVWc8q4Ut_xcXDrEn-zvFbhxQdLM"
      ;
      if (!token) {
        console.error('No JWT token found, redirecting to login.');
        navigation.replace('LoginPage');
        return;
      }

      const response = await fetch(
        `http://192.168.45.81:8080/home?type=${typeFilter}&sort=${sortOption}&search=${searchText}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (response.status === 200) {
        const result = await response.json();
        console.log('Received data:', result);
        return result;
      } else {
        console.error('Unexpected response status:', response.status);
        return [];
      }
    } catch (error) {
      console.error('API 요청 에러:', error);
      return [];
    }
  };
  // 데이터를 최신 상태로 유지하기 위해 화면에 다시 포커스될 때마다 데이터를 새로 가져옵니다.
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [typeFilter, sortOption]),
  );

  const filterData = (data, query) => {
    const searchQuery = query.trim().toLowerCase();
    return data.filter(
      item =>
        (item.medicineName &&
          item.medicineName.toLowerCase().includes(searchQuery)) ||
        (item.productName &&
          item.productName.toLowerCase().includes(searchQuery)),
    );
  };

  const handleSearch = () => {
    console.log('검색 실행:', searchText);
    const filtered = filterData(data, searchText);
    console.log('Filtered data:', filtered);
    setFilteredData(filtered);
  };

  // 기존 코드에서 updateData를 다음과 같이 수정
  useEffect(() => {
    const updateData = async () => {
      const result = await fetchData();
      setData(result);
      setFilteredData(result);
    };

    updateData();
  }, [typeFilter, sortOption, searchText]); // 데이터 변경이 있을 때만 호출

  // 전체 보기 버튼 클릭 시 동작
  const handleShowAll = () => {
    console.log('전체 보기');
    setFilteredData(data);
    setSearchText('');
  };

  const sortData = (data, sortOption) => {
    return [...data].sort((a, b) => {
      if (sortOption === '등록순') {
        const nameA = a.medicineName || a.productName;
        const nameB = b.medicineName || b.productName;
        return nameA.localeCompare(nameB);
      } else {
        return a.expirationDaysInNumber - b.expirationDaysInNumber;
      }
    });
  };

  const handleSort = () => {
    console.log('정렬 실행:', sortOption);
    const sortedData = sortData(filteredData, sortOption);
    console.log('Sorted data:', sortedData);
    setFilteredData(sortedData);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate('MedicineDetail', {
          item,
        })
      }>
      <View style={styles.imagePlaceholder} />
      <View style={styles.textContainer}>
        <Text style={styles.medicineName}>
          {item.medicineName || item.productName}
        </Text>
        <View style={styles.typeBadge(item.medicineType)}>
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
          value={searchText}
          onChangeText={text => setSearchText(text)}
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
        keyExtractor={(item, index) => `${item.id}-${index}`}
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
  typeBadge: medicineType => ({
    backgroundColor: medicineType === '상비약' ? '#4095FE' : '#1F2178',
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
