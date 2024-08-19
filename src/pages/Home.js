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
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({route}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dropdown, setDropdown] = useState(false);
  const [value, setValue] = useState('전체');
  const [items, setItems] = useState([
    {label: '전체', value: '전체'},
    {label: '처방약', value: '처방약'},
    {label: '상비약', value: '상비약'},
  ]);
  const [sortOption, setSortOption] = useState('등록순');
  const navigation = useNavigation();
  const {deletedId} = route.params || {}; // 삭제된 약품의 ID를 받음

  // API 데이터 가져오기
  const fetchData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('No JWT token found, redirecting to login.');
        navigation.replace('LoginPage');
        return;
      }

      const response = await fetch(
        `http://10.0.2.2:8080/home?type=${value}&sort=${sortOption}&search=${searchText}`,
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
  // 데이터를 최신 상태로 유지하기 위해 화면에 다시 포커스될 때마다 데이터를 새로 가져옵니다.
  useFocusEffect(
    React.useCallback(() => {
      const updateData = async () => {
        const result = await fetchData();
        // 삭제된 아이템이 있는 경우, 데이터를 필터링하여 제외
        const filteredByDeletion = deletedId
          ? result.filter(item => item.id !== deletedId)
          : result;

        // 상태에 데이터 설정
        setData(filteredByDeletion);
      };

      updateData();
    }, [deletedId]),
  );

  // 기존 코드에서 updateData를 다음과 같이 수정
  useEffect(() => {
    const filterAndSortData = () => {
      // 선택된 약품 종류 필터링
      const filteredResult =
        value === '전체'
          ? data
          : data.filter(item => item.medicineType === value);

      // 정렬 적용
      const sortedResult = sortData(filteredResult, sortOption);

      // 필터링 및 정렬된 데이터를 상태로 설정
      setFilteredData(sortedResult);
    };

    filterAndSortData();
  }, [data, value, sortOption, searchText]);

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

  const renderItem = ({item}) => {
    // 이미지 경로 설정
    let imageSource;
    if (item.medicineName.includes('타이')) {
      imageSource = require('../../assets/image/tylenol.png');
    } else if (item.medicineName.includes('후시')) {
      imageSource = require('../../assets/image/fushidin.png');
    } else if (item.medicineName.includes('시크릿')) {
      imageSource = require('../../assets/image/secretone.png');
    } else if (item.medicineName.includes('마데')) {
      imageSource = require('../../assets/image/madecasol.png');
    } else if (item.medicineName.includes('파모')) {
      imageSource = require('../../assets/image/famotidine.png');
    } else if (item.medicineType === '처방약') {
      imageSource = require('../../assets/image/prescription.jpg'); // 기본 플레이스홀더 이미지
    } else {
      imageSource = require('../../assets/icon/placeholder.png');
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          navigation.navigate('MedicineDetail', {
            item,
          })
        }>
        <Image
          style={styles.imagePlaceholder} // 스타일을 업데이트 하여 placeholder에서 실제 이미지로 변경
          source={imageSource} // 설정된 이미지 경로를 사용
        />
        <View style={styles.textContainer}>
          <Text style={styles.medicineName}>
            {item.medicineName || '이름 없음'}
          </Text>
          <View style={styles.typeBadge(item.medicineType)}>
            <Text style={styles.typeText}>
              {item.medicineType || '유형 없음'}
            </Text>
          </View>
          <Text style={styles.dDay}>
            {item.expirationDays || '만료일 없음'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        <DropDownPicker
          style={styles.dropdownpicker}
          containerStyle={styles.dropdownContainer}
          open={dropdown}
          value={value}
          items={items}
          placeholder="전체"
          setOpen={setDropdown}
          setValue={setValue}
          setItems={setItems}
          onChangeValue={() => console.log('Selected:', value)}
        />
        <View style={styles.filterButtons}>
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
  dropdownpicker: {
    backgroundColor: '#fff',
    borderColor: '#1F2178',
    borderWidth: 1.5,
    borderRadius: 20,
    fontSize: 10,
    minHeight: 33,
    maxHeight: 33,
    justifyContent: 'center', // 텍스트가 가운데에 오도록 정렬
  },
  dropdownContainer: {
    flex: 1, // 가로 공간을 최대한 활용
    marginLeft: 15,
    marginRight: 5, // 옆에 있는 버튼들과 간격을 조정
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
    height: 80,
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
