const SellProductButton = ({onClick}) => {
  return (
    <button 
        className='w-full p-3 bg-[linear-gradient(135deg,#ead266_0%,#77a24b_100%)] hover:bg-[linear-gradient(135deg,#d4bb4f_0%,#5f8f3b_100%)]
 text-white border-none rounded-[10px] text-base transition-colors duration-200 ease-in-out'
        onClick={onClick}
    >Looking to sell something? 🏷️</button>
  )
}

export default SellProductButton