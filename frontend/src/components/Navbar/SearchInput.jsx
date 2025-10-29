import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../../features/productsFiltersSlice';

export const SearchInput = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.productsFilters.searchQuery);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <>
      <div>
        <input 
          placeholder='Search clothes, electronics, furniture and more...' 
          className='search-input'
          id='search_field'
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
    </>
  )
}
