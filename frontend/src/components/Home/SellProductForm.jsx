import { useEffect, useRef, useContext, useState, Fragment } from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import { IoCloseCircle, IoChevronDown, IoCheckmark } from "react-icons/io5";
import CartContext from '../../context/CartContext';
import confetti from 'canvas-confetti';
import { Listbox } from '@headlessui/react'
import Toast from '../Toast';

const SellProductForm = ({
  handleAddProduct,
  closeForm,
  isFormOpen,
  setCustomProducts
}) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  
  // Use selectedImage state from context
  const { selectedImage, setSelectedImage } = useContext(CartContext);

  // Confirmation toast:
  const [toastVisible, setToastVisible] = useState(false);

  // Warning toast:
  const [toastWarningVisible, setToastWarningVisible] = useState(false);
  
  // START of logic to handle the product categories:
  
  // Define the categories as an array of objects:
  const categories = [
    { value: 'beauty', label: 'Beauty', emoji: '💄' },
    { value: 'fragrances', label: 'Fragrances', emoji: '🌸' },
    { value: 'skin-care', label: 'Skin care', emoji: '🧴' },

    { value: 'mens-accessories', label: "Men's accessories", emoji: '🧢' },
    { value: 'mens-shirts', label: "Men's shirts", emoji: '👔' },
    { value: 'mens-shoes', label: "Men's shoes", emoji: '👞' },
    { value: 'mens-watches', label: "Men's watches", emoji: '⌚' },

    { value: 'electronics', label: 'Electronics', emoji: '🔌' },
    { value: 'laptops', label: 'Laptops', emoji: '💻' },
    { value: 'mobile-accessories', label: 'Mobile accessories', emoji: '📱' },
    { value: 'smartphones', label: 'Smartphones', emoji: '📱' },
    { value: 'tablets', label: 'Tablets', emoji: '📱' },

    { value: 'groceries', label: 'Groceries', emoji: '🛒' },

    { value: 'furniture', label: 'Furniture', emoji: '🪑' },
    { value: 'home-decoration', label: 'Home decoration', emoji: '🏠' },
    { value: 'kitchen-accessories', label: 'Kitchen accessories', emoji: '🍳' },
    { value: 'sports-accessories', label: 'Sports accessories', emoji: '⚽' },

    { value: 'motorcycle', label: 'Motorcycle', emoji: '🏍️' },
    { value: 'vehicle', label: 'Vehicle', emoji: '🚗' },

    { value: 'womens-bags', label: "Women's bags", emoji: '👜' },
    { value: 'womens-dresses', label: "Women's dresses", emoji: '👗' },
    { value: 'womens-jewellery', label: "Women's jewellery", emoji: '💍' },
    { value: 'womens-shoes', label: "Women's shoes", emoji: '👠' },
    { value: 'womens-watches', label: "Women's watches", emoji: '⌚' },

    { value: 'sunglasses', label: 'Sunglasses', emoji: '🕶️' },
    { value: 'tops', label: 'Tops', emoji: '👕' },
  ]
  
  // Alphabetise the product categories:
  const alphabetisedCategories = [...categories].sort((a,b) =>
    a.label.localeCompare(b.label)
  )
  
  // END of logic to handle the product categories:

  // State for the product category dropdown on mobile:
  const [selectedCategory, setSelectedCategory] = useState(alphabetisedCategories[0]) 

  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeForm();
      }
    }
    if (isFormOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isFormOpen, closeForm]);

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === 'Escape') {
        closeForm();
      }
    }
    if (isFormOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isFormOpen, closeForm]);

  // END of logic to handle the user closing the form


  // START of logic to handle the form submission:
  const formSubmit = async (e) => {
    e.preventDefault();

    // Custom validation for image:
    if (!selectedImage) {
      setToastWarningVisible(true);
      return;
    }

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    const form = e.target;
    const imageFile = selectedImage;
    const formData = new FormData();
    formData.append('name', form.elements['name'].value);
    formData.append('category', selectedCategory.value);
    formData.append('price', form.elements['price'].value);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    setCustomProducts(prev => [...prev, formData]);
    if (isAuthenticated) {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://dev-ngpva7twomewnfum.us.auth0.com/api/v2/",
            scope: "openid profile email",
          },
        });
        await fetch(`${import.meta.env.VITE_API_URL}/products/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          body: formData,
        });
      } catch (err) {
        console.error("Error posting product:", err);
      }
    }
    handleAddProduct(formData);
    setToastVisible(true);
    setSelectedImage(null);
    setTimeout(() => {
      closeForm();
    }, 3000);
  };


  // END of logic to handle the form submission

  return (
    <>
      {/* Successful upload toast: */}
      <Toast
        message="Product uploaded to Minishop! 🎉"
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* Reminder that image upload is required toast: */}
      <Toast
        message="Please select a product image before submitting."
        isVisible={toastWarningVisible}
        onClose={() => setToastWarningVisible(false)}
        variant="warning"
        duration={3000}
      />

      <form
        className={`
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/70
          transition-opacity duration-300
          ${isFormOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClose={closeForm}
        onSubmit={formSubmit}
      >
        <div
          className="bg-white p-7.5 rounded-lg shadow-[0 5px 20px rgba(0, 0, 0, 0.3)] sm:fit-content transform-[scale(0.9)] transition-[transform 0.3s ease]"
          ref={modalRef}
        >
          <div className='flex flex-row justify-end'>
            <div
              className=''
              onClick={closeForm}
              style={{ cursor: 'pointer' }}>
              <IoCloseCircle
                className='text-[#333] hover:text-red-400'
              />
            </div>
          </div>

          {/* Product name */}
          <div className='mb-5 text-black'>Product name:
            <input
              name='name'
              className='w-full p-2.5 mb-3.75 border border-[#ddd] rounded-sm bg-white text-[#333]'
              placeholder='Enter your product name here'
              required
            />
          </div>

          {/* Product category: */}
          <div className="mb-5 text-black w-full">
            Product category:
            
            <Listbox value={selectedCategory} onChange={setSelectedCategory} name="category">
              <div className="relative w-full">
                <Listbox.Button className="w-full p-2.5 border border-[#ddd] rounded-sm bg-white text-[#333] flex justify-between items-center">
                  <span>{selectedCategory.emoji} {selectedCategory.label}</span>
                  <IoChevronDown className="ml-2" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg z-10">
                  {alphabetisedCategories.map((category) => (
                    <Listbox.Option
                      key={category.value}
                      value={category}
                      as={Fragment}
                    >
                      {({ active, selected }) => (
                        <li
                          className={`cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                            active ? 'bg-green-100 text-green-900' : 'text-gray-900'
                          }`}
                        >
                          <span>{category.emoji} {category.label}</span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                              <IoCheckmark />
                            </span>
                          ) : null}
                        </li>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>

          </div>

          {/* Product price: */}
          <div className='mb-5 text-black'>
            Price ($):
            <input
              name='price'
              className='w-full p-2.5 mb-3.75 border border-[#ddd] rounded-sm bg-white text-[#333]'
              placeholder='Enter your price here'
              type='number'
              step={"0.01"}
              required
            />
          </div>


          {/* Product image */}
          <div className="mb-5 text-black">
            Product image:

            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <span className="inline-block rounded-sm bg-linear-to-br from-[#ead266] to-[#77a24b] px-4 py-2 text-white hover:from-[#d4bb4f] hover:to-[#5f8f3b]">
                  Choose file
                </span>

                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  className="hidden"
                  onChange={(e) =>
                    setSelectedImage(e.target.files?.[0] ?? null)
                  }
                />
              </label>

              {selectedImage && (
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="text-xl text-red-400 hover:text-red-600"
                  title="Remove selected image"
                >
                  <IoCloseCircle />
                </button>
              )}
            </div>

            <div className="text-xs text-gray-600 mt-1">
              {selectedImage ? `Selected: ${selectedImage.name}` : "No file selected"}
            </div>

          </div>


          {/* Post your product for sale button */}
          <div className='flex flex-col items-start sm:fit-content'>
            <button 
              className='flex justify-center bg-[linear-gradient(135deg,#ead266_0%,#77a24b_100%)] hover:bg-[linear-gradient(135deg,#d4bb4f_0%,#5f8f3b_100%)] rounded-sm text-white px-4 py-2
              
              sm:fit-content 
              
              '
              // onClick={className}
            >
              Post your product for sale on Minishop
            </button>
          </div>
        </div> 
      </form>
    </>
  )
}

export default SellProductForm