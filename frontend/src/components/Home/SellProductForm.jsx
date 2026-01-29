import { useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import { IoCloseCircleOutline } from "react-icons/io5";

const SellProductForm = ({
  handleAddProduct,
  closeForm,
  isFormOpen,
  setCustomProducts
}) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // START of logic to handle the user closing the form:

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
    const form = e.target;
    const imageInput = form.querySelector('.sell-product-image-input-field');
    const imageFile = imageInput && imageInput.files && imageInput.files[0] ? imageInput.files[0] : null;
    
    const formData = new FormData();
    formData.append('name', form.querySelector('.sell-product-name-input-field').value);
    formData.append('category', form.querySelector('.sell-product-category-dropdown').value);
    formData.append('price', form.querySelector('.sell-product-price-input-field').value);
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
    closeForm();
  };

  // END of logic to handle the form submission

  return (
    <>
      <form 
        className={`sell-product-modal-form-overlay${isFormOpen ? ' active' : ''}`}
        onClose={closeForm}
        onSubmit={formSubmit}
      >
        <div 
          className='flex flex-col bg-white p-7.5 rounded-lg shadow-[0 5px 20px rgba(0, 0, 0, 0.3)] w-[90%] max-w-100 transition-[transform 0.3s ease] transform-[scale(0.9)]'
          ref={modalRef}
        >
          <div className='flex flex-row'>
            <div
              className='justify-end' 
              onClick={closeForm} 
              style={{cursor: 'pointer'}}>
                <IoCloseCircleOutline />
            </div> 
          </div>

          {/* Product name */}
          <div className='sell-product-name-field-title'>Product name:
            <input 
              className='sell-product-name-input-field'
              placeholder='Enter your product name here'
              required
            />
          </div> 
          {/* Product category: */}
          <div className='sell-product-category-field-title'>
            Product category:
            <select className='sell-product-category-dropdown' required>
              <option value="Clothes">Clothes</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Shoes">Shoes</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
          {/* Product price: */}
          <div className='sell-product-price-field-title'>Price ($):
            <input 
              className='sell-product-price-input-field'
              placeholder='Enter your price here'
              required
            />
          </div>
          {/* Product image */}
          <div className='sell-product-image-field-title'>
            Product image:
            <input
              className='sell-product-image-input-field'
              type="file"
              accept="image/*"
              name="productImage"
              required
            />
          </div>
          <button className='bg-[linear-gradient(135deg,#ead266_0%,#77a24b_100%)] hover:bg-[linear-gradient(135deg,#d4bb4f_0%,#5f8f3b_100%)] rounded-sm text-white'>
            Post your product for sale on Minishop
          </button>
        </div> {/* End of sell-product-modal-form-content */}
      </form>
    </>
  )
}

export default SellProductForm