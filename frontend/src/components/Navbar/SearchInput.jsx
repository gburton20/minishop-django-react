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
      <div className='rounded-[10px] bg-white text-[#333] lg:-mx-8 lg:w-[38vw] xl:-mx-8 xl:w-[48vw] 2xl:-mx-8 2xl:w-[58vw]'>
        <input 
          placeholder='Search clothes, electronics, furniture and more...' 
          className='w-full p-2 rounded-[10px] bg-white text-[#333] border-[#ddd] border'
          id='search_field'
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
    </>
  )
}
