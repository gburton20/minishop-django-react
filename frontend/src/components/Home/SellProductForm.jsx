import { useEffect, useRef, useContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import { IoCloseCircle } from "react-icons/io5";
import CartContext from '../../context/CartContext';
import confetti from 'canvas-confetti';

const SellProductForm = ({
  handleAddProduct,
  closeForm,
  isFormOpen,
  setCustomProducts
}) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Use selectedImage state from context
  const { selectedImage, setSelectedImage } = useContext(CartContext);

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
    formData.append('category', form.elements['category'].value);
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
    setSelectedImage(null);
    closeForm();
  };

  // END of logic to handle the form submission

  return (
    <>
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
          <div className='mb-5 text-black'>
            Product category:
            <select 
              name='category'
              className='w-full p-2.5 mb-3.75 border border-[#ddd] rounded-sm bg-white text-[#333]' 
              required
            >

              {/* Beauty */}
              <option value="beauty">Beauty</option>
              <option value="fragrances">Fragrances</option>
              <option value="skin-care">Skin care</option>

              {/* Men's clothing: */}
              <option value="mens-accessories">Men's accessories</option>
              <option value="mens-shirts">Men's shirts</option>
              <option value="mens-shoes">Men's shoes</option>
              <option value="mens-watches">Men's watches</option>

              {/* Electronics: */}
              <option value="electronics">Electronics</option>
              <option value="laptops">Laptops</option>
              <option value="mobile-accessories">Mobile accessories</option>
              <option value="smartphones">Smartphones</option>
              <option value="tablets">Tablets</option>

              {/* Groceries: */}
              <option value="groceries">Groceries</option>

              {/* Home: */}
              <option value="furniture">Groceries</option>
              <option value="home-decoration">Home decoration</option>
              <option value="kitchen-accessories">Kitchen accessories</option>
              <option value="sports-accessories">Sports accessories</option>

              {/* Transport: */}
              <option value="motorcyle">Motorcycle</option>
              <option value="vehicle">Vehicle</option>

              {/* Women's clothing: */}
              <option value="womens-bags">Women's bags</option>
              <option value="womens-dresses">Women's dresses</option>
              <option value="womens-jewellery">Women's jewellery</option>
              <option value="womens-shoes">Women's shoes</option>
              <option value="womens-watches">Women's watches</option>

              {/* Unisex clothing */}
              <option value="sunglasses">Sunglasses</option>
              <option value="tops">Tops</option>
              
            </select>
          </div>

          {/* Product price: */}
          <div className='mb-5 text-black'>Price ($):
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
                  required
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