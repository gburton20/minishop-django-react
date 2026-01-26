const SellProductButton = ({onClick}) => {
  return (
    <button 
        className='w-full p-3 bg-[#ddff00c9] text-black border-none rounded-sm text-base transition-colors duration-200 ease-in-out'
        onClick={onClick}
    >Looking to sell something?</button>
  )
}

export default SellProductButton