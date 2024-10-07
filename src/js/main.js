// const API_URL = 'https://app.perflay.com/api/product-reviews/public-published?storeSlug=tienda-tes&productId=1';
// const TOKEN = 'mysecretkey.123';

// const combinedRatings = ({ countByRating, percentageByRating }) => {
//   return Object.keys(countByRating).reduce((acc, key) => {
//     acc[key] = {
//       count: countByRating[key],
//       percentage: percentageByRating[key]
//     };
//     return acc;
//   }, {});
// };

// const renderStars = (rating) => {
//   const fullStars = Math.floor(rating);
//   const halfStar = rating % 1 >= 0.5 ? 1 : 0;
//   const emptyStars = 5 - fullStars - halfStar;

//   return `
//     ${'<i class="fas fa-star tw-text-[#ffbf15]"></i>'.repeat(fullStars)}
//     ${halfStar ? '<i class="fas fa-star-half-alt tw-text-[#ffbf15]"></i>' : ''}
//     ${'<i class="fas fa-star tw-text-[#ddd]"></i>'.repeat(emptyStars)}
//   `;
// }

// const renderReviews = ({ reviews, configStyle }) => {
//   const reviewsList = document.getElementById('reviews-list');
  
//   reviewsList.innerHTML = reviews.map(({ displayName, contentTranslate, thumbnails, rating }) => `
//     <li class="tw-flex tw-flex-col tw-gap-y-1 tw-border-t tw-border-[#d1d5db] tw-py-7">
//       <div class="tw-flex tw-items-center tw-gap-x-2">
//         <span>${renderStars(rating)}</span>
//         <span class="tw-font-semibold">${displayName}</span>
//       </div>
      
//       <span class="tw-flex tw-items-center tw-gap-x-1 tw-font-semibold">
//         <i class="fas fa-check-circle tw-text-lg" style="color: ${configStyle.circleColor ?? '#4ea645'}"></i>
//         Compra verificada
//       </span>
      
//       <p>${contentTranslate}</p>
      
//       <div class="tw-mt-3 tw-flex tw-gap-2">
//         ${thumbnails.map(thumbnail => `
//           <picture>
//             <source srcset="${thumbnail}" type="image/jpg">
//             <img class="js-lazy rounded-full tw-w-20 tw-h-20 tw-border tw-border-[rgb(204,204,204,1)] tw-cursor-pointer" 
//               src="${thumbnail}" alt="" loading="lazy" 
//               width="80" height="80" />
//           </picture>
//         `).join('')}
//       </div>
//     </li>
//   `).join('');
// };

// const renderSummary = ({ totalReviews, statsReview }) => {
//   const reviewsSummary = document.getElementById('reviews-summary');
//   const ratings = combinedRatings(statsReview);

//   reviewsSummary.innerHTML = `
//     <div class="tw-text-center">
//       <div class="tw-font-semibold tw-leading-tight">
//         <span class="tw-text-[40px] tw-text-[#111]">${statsReview.average}</span>
//         <span class="tw-text-[22px] tw-text-[#797979]">/ 5</span>
//       </div>
//       <div class="tw-text-xl">${renderStars(statsReview.average)}</div>
//       <span class="tw-text-sm tw-text-[#818181] tw-leading-tight">${totalReviews} reseñas</span>          
//     </div>

//     <ul class="tw-flex tw-flex-col-reverse tw-gap-y-1 tw-text-sm tw-text-[#333] tw-leading-snug sm:tw-min-w-80">
//       ${Object.keys(ratings).map((key) => `
//         <li class="tw-grid tw-grid-cols-[80px_1fr_12px] tw-justify-between tw-items-center tw-gap-x-4">
//           <span>${key} estrellas</span>
//           <div class="tw-flex tw-w-full tw-h-3 tw-bg-[#ddd] tw-rounded">
//             <span class="tw-h-full tw-bg-[#ffbf15] tw-rounded" style="width: ${ratings[key].percentage}"></span>
//           </div>
//           <span>${ratings[key].count}</span>
//         </li>
//       `).join('')}
//     </ul>
//   `;
// };

// const fetchReviews = async () => {
//   try {
//     const response = await fetch(API_URL, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${TOKEN}`, // Agregar el token en el header
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.status}`);
//     }
    
//     const { data } = await response.json();
//     renderReviews(data);
//     renderSummary(data);
//   } catch (error) {
//     console.error('Error fetching reviews:', error);
//   }
// };

// document.addEventListener('DOMContentLoaded', () => {
//   fetchReviews();
// });

// Constantes
const API_URL = 'https://app.perflay.com/api/product-reviews/public-published';
const TOKEN = 'mysecretkey.123';
const CACHE_KEY = 'product_reviews_cache';
const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hora en milisegundos
const REVIEWS_PER_PAGE = 10;

// Funciones auxiliares
const combinedRatings = ({ countByRating, percentageByRating }) => {
  return Object.keys(countByRating).reduce((acc, key) => {
    acc[key] = { 
      count: countByRating[key], 
      percentage: percentageByRating[key] 
    };
    return acc;
  }, {});
};

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  return `
    ${'<i class="fas fa-star tw-text-[#ffbf15]"></i>'.repeat(fullStars)}
    ${halfStar ? '<i class="fas fa-star-half-alt tw-text-[#ffbf15]"></i>' : ''}
    ${'<i class="fas fa-star tw-text-[#ddd]"></i>'.repeat(emptyStars)}
  `;
};

const openModal = (event) => {
  const modal = document.getElementById('static-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const expandedImage = document.getElementById('expanded-image');
  const imageSrc = event.target.dataset.expanded;

  // Mostrar el modal y la imagen
  expandedImage.src = imageSrc;
  modal.classList.remove('tw-hidden');
  modal.classList.add('tw-flex');
  modalBackdrop.classList.remove('tw-hidden');
}

const closeModal = () => {
  const modal = document.getElementById('static-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  modal.classList.add('tw-hidden');
  modal.classList.remove('tw-flex');
  modalBackdrop.classList.add('tw-hidden');
}

// Event listener para cerrar el modal al hacer clic en la "x"
const closeModalButton = document.querySelector('[data-modal-hide="static-modal"]');
closeModalButton.addEventListener('click', closeModal);

// Cerrar el modal al hacer clic fuera de la imagen
const modal = document.getElementById('static-modal');
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

const openReviewModal = (event) => {
  const modal = document.getElementById('add-review-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const formAddReview = document.getElementById('add-review-form');
  const message = document.getElementById('add-review-thank-you-message');
  
  const stars = document.querySelectorAll('#star-rating i');
  const photoCountLabel = document.getElementById('add-photo-label');
  const photoCountSpan = document.querySelector('#photo-count span');
  const imagesContainer = document.getElementById('image-preview-container');

  stars.forEach(star => {
    if (star.classList.contains('tw-text-yellow-400')) {
      star.classList.remove('tw-text-yellow-400');
      star.classList.add('tw-text-[#ddd]');
    }
  });

  // document.getElementById('add-photo-input').value = '';
  photoCountLabel.classList.remove('tw-opacity-50', 'tw-cursor-not-allowed');
  photoCountSpan.innerHTML = '0';
  imagesContainer.innerHTML = '';

  // // Resetear formulario
  formAddReview.reset();

  // Remover mensaje de agradecimiento 
  message.classList.remove('tw-flex');
  message.classList.add('tw-hidden');

  // // Mostrar formulario
  formAddReview.classList.remove('tw-hidden');
  // formAddReview.classList.add('tw-flex');

  // Mostrar el modal
  modal.classList.remove('tw-hidden');
  modal.classList.add('tw-flex');
  modalBackdrop.classList.remove('tw-hidden');
}

const closeReviewModal = () => {
  const modal = document.getElementById('add-review-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  modal.classList.add('tw-hidden');
  modal.classList.remove('tw-flex');
  modalBackdrop.classList.add('tw-hidden');
}

// Event listener para cerrar el modal al hacer clic en la "x"
const closeReviewModalButton = document.querySelectorAll('[data-modal-hide="add-review-modal"]');
closeReviewModalButton.forEach(closeButton => {
  closeButton.addEventListener('click', closeReviewModal);
});

// Cerrar el modal al hacer clic fuera de la imagen
const ReviewModal = document.getElementById('add-review-modal');
ReviewModal.addEventListener('click', (event) => {
  if (event.target === ReviewModal) {
    closeReviewModal();
  }
});

const addReviewButton = document.getElementById('add-review');
addReviewButton.addEventListener('click', openReviewModal);

class ProductReviews {
  constructor() {
    this.currentPage = 1;
    this.reviewsPerPage = REVIEWS_PER_PAGE;
    this.loading = false;
    this.reviewsData = null;
    this.observer = null;
  }

  init() {
    this.setupIntersectionObserver();
    // this.setupEventListeners();
    this.loadReviewsSection();
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadReviewsSection();
      }
    }, { threshold: 0.1 });

    const reviewsSection = document.querySelector('.reviews-section');
    if (reviewsSection) {
      this.observer.observe(reviewsSection);
    }
  }

  setupEventListeners() {
    // const addReviewButton = document.getElementById('add-review');
    // if (addReviewButton) {
    //   addReviewButton.addEventListener('click', () => this.openReviewForm());
    // }

    // const loadMoreButton = document.getElementById('load-more-reviews');
    // if (loadMoreButton) {
    //   loadMoreButton.addEventListener('click', () => this.loadMoreReviews());
    // }
  }

  async loadReviewsSection() {
    if (this.loading) return;
    this.loading = true;

    this.showSkeleton();

    try {
      await this.fetchReviews();
      this.hideSkeleton();
      this.renderReviewsSection();
    } catch (error) {
      console.error('Error loading reviews section:', error);
      this.showErrorMessage();
    } finally {
      this.loading = false;
    }
  }

  async fetchReviews() {
    const cachedData = this.getCachedData();
    if (cachedData) {
      this.reviewsData = cachedData;
      return;
    }

    const response = await fetch(`${API_URL}?storeSlug=tienda-tes&productId=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    
    const { data } = await response.json();
    this.reviewsData = data;
    this.cacheData(data);
  }

  getCachedData() {
    const cachedItem = localStorage.getItem(CACHE_KEY);
    if (cachedItem) {
      const { data, timestamp } = JSON.parse(cachedItem);
      if (Date.now() - timestamp < CACHE_EXPIRATION) {
        return data;
      }
    }
    return null;
  }

  cacheData(data) {
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheItem));
  }

  renderReviewsSection() {
    if (!this.reviewsData) return;

    console.log('reviewsData', this.reviewsData);
    const { totalReviews, statsReview, reviews, configStyle } = this.reviewsData;

    if (totalReviews === 0) {
      this.renderNoReviews();
      return;
    }

    this.renderSummary({ totalReviews, statsReview });
    // this.renderReviews(reviews.slice(0, this.reviewsPerPage));
    this.renderReviews(reviews, configStyle);
    // this.renderPagination(reviews.length);
  }

  renderSummary({ totalReviews, statsReview }) {
    const reviewsSummary = document.getElementById('reviews-summary');
    if (!reviewsSummary) return;

    const ratings = combinedRatings(statsReview);
    
    reviewsSummary.innerHTML = `
      <div class="tw-flex tw-flex-col tw-items-center">
        <div class="tw-font-semibold tw-mb-2">
          <span class="tw-text-[40px] tw-text-[#111]">${statsReview.average}</span>
          <span class="tw-text-[22px] tw-text-[#797979]">/ 5</span>
        </div>
        <div class="tw-text-[#ffbf15] tw-text-xl tw-mb-1">${renderStars(statsReview.average)}</div>
        <div class="tw-text-sm tw-text-gray-600">${totalReviews} reseñas</div>
      </div>
      <div class="tw-flex tw-flex-col tw-gap-y-1">
        ${Object.keys(ratings).reverse().map((key) => `
          <div class="tw-flex tw-items-center tw-gap-x-2">
            <span class="tw-w-20 tw-text-sm">${key} estrellas</span>
            
            <div class="tw-w-32 tw-bg-[#ddd] tw-rounded tw-h-2">
              <div class="tw-bg-[#ffbf15] tw-rounded tw-h-2" style="width: ${ratings[key].percentage}"></div>
            </div>
            <span class="tw-text-sm tw-text-gray-600">${ratings[key].count}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderReviews(reviews, configStyle) {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;

    const fragment = document.createDocumentFragment();

    reviews.forEach(({ displayName, contentTranslate, thumbnails, photos, rating, country }) => {
      const li = document.createElement('li');
      li.className = 'tw-flex tw-flex-col tw-gap-y-1 tw-border-t tw-border-[#d1d5db] tw-py-7';
      li.innerHTML = `
        <div class="tw-flex tw-items-center tw-gap-x-2">
          <div class="tw-text-yellow-400">${renderStars(rating)}</div>
          <span class="tw-font-semibold">${displayName}</span>
          <img src="http://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg"
            alt="${country}" width="20" height="20" loading="lazy" />
        </div>
        
        <span class="tw-flex tw-items-center tw-gap-x-1 tw-font-semibold">
          <i class="fas fa-check-circle tw-text-lg" style="color: ${configStyle.circleColor ?? '#4ea645'}"></i>
          Compra verificada
        </span>
        
        <p>${contentTranslate}</p>
        
        ${thumbnails.length ? `
          <div class="tw-mt-3 tw-flex tw-flex-wrap tw-gap-2">
            ${thumbnails.map((thumbnail, index) => `
              <img class="js-review-thumbnail tw-w-20 tw-h-20 tw-object-cover tw-rounded tw-cursor-pointer"
                src="${thumbnail}" alt="Review image" loading="lazy" 
                data-expanded="${photos[index]}"/>
            `).join('')}
          </div>
        ` : ''}
      `;
      fragment.appendChild(li);
    });

    reviewsList.innerHTML = '';
    reviewsList.appendChild(fragment);

    const reviewThumbnails = document.querySelectorAll('.js-review-thumbnail');
    reviewThumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', openModal);
    });
  }

  renderPagination(totalReviews) {
    const paginationContainer = document.getElementById('reviews-pagination');
    if (!paginationContainer) return;

    if (totalReviews <= this.reviewsPerPage) {
      paginationContainer.innerHTML = '';
      return;
    }

    paginationContainer.innerHTML = `
      <button id="load-more-reviews" class="tw-mt-4 tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded hover:tw-bg-blue-600">
        Cargar más reseñas
      </button>
    `;

    this.setupEventListeners(); // Re-attach event listener for the new button
  }

  loadMoreReviews() {
    if (!this.reviewsData) return;

    const { reviews } = this.reviewsData;
    const start = this.currentPage * this.reviewsPerPage;
    const end = start + this.reviewsPerPage;
    const nextReviews = reviews.slice(start, end);

    if (nextReviews.length > 0) {
      this.renderReviews([...document.getElementById('reviews-list').children, ...nextReviews]);
      this.currentPage++;

      if (end >= reviews.length) {
        document.getElementById('load-more-reviews').style.display = 'none';
      }
    }
  }

  renderNoReviews() {
    const reviewsSection = document.querySelector('.reviews-section');
    if (reviewsSection) {
      reviewsSection.innerHTML = `
        <div class="tw-text-center tw-py-8">
          <p class="tw-text-sm">Aún no hay reseñas para este producto</p>
        </div>
      `;
    }
  }

  showSkeleton() {
    const reviewsSection = document.querySelector('.reviews-section');
    if (reviewsSection) {
      reviewsSection.innerHTML = `
        <div class="tw-animate-pulse tw-mt-5">
          ${Array(3).fill().map(() => `
            <div class="tw-mb-8">
              <div class="tw-bg-gray-200 tw-h-4 tw-w-1/4 tw-mb-2"></div>
              <div class="tw-bg-gray-200 tw-h-4 tw-w-full tw-mb-2"></div>
              <div class="tw-bg-gray-200 tw-h-4 tw-w-3/4"></div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  hideSkeleton() {
    const reviewsSection = document.querySelector('.reviews-section');
    if (reviewsSection) {
      reviewsSection.innerHTML = `
        <div class="tw-mt-5 tw-flex tw-flex-col tw-gap-y-5 sm:tw-flex-row sm:tw-items-center sm:tw-justify-center sm:tw-gap-x-8 md:tw-justify-start" id="reviews-summary">
        </div>

        <div class="tw-mt-10">
          <ul class="tw-grid tw-text-sm tw-text-[#333] tw-leading-snug" id="reviews-list">
          </ul>
        </div>
      `;
    }
  }

  showErrorMessage() {
    const reviewsSection = document.querySelector('.reviews-section');
    if (reviewsSection) {
      reviewsSection.innerHTML = `
        <div class="tw-text-center tw-py-8">
          <p class="tw-text-lg tw-font-semibold tw-text-red-500 tw-mb-4">Hubo un error al cargar las reseñas</p>
          <button class="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded hover:tw-bg-blue-600" onclick="productReviews.loadReviewsSection()">
            Intentar de nuevo
          </button>
        </div>
      `;
    }
  }

  // openReviewForm() {
  //   // Implementar lógica para abrir el formulario de reseña
  //   console.log('Abrir formulario de reseña');
  // }
}

// Inicialización
let productReviews;
document.addEventListener('DOMContentLoaded', () => {
  productReviews = new ProductReviews();
  productReviews.init();
});

// Calificación por estrellas
const stars = document.querySelectorAll('#star-rating i');
let rating = 0;

stars.forEach(star => {
  star.addEventListener('click', (e) => {
    rating = parseInt(e.target.getAttribute('data-value'));
    updateStarRating(rating);
  });
});

function updateStarRating(rating) {
  stars.forEach(star => {
    const value = parseInt(star.getAttribute('data-value'));
    star.classList.toggle('tw-text-yellow-400', value <= rating); // Estrella seleccionada
    star.classList.toggle('tw-text-[#ddd]', value > rating); // Estrella no seleccionada
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const MAX_IMAGES = 5;
  const addPhotoInput = document.getElementById('add-photo-input');
  const addPhotoLabel = document.getElementById('add-photo-label');
  const imagesContainer = document.getElementById('image-preview-container');
  const submitButton = document.querySelector('button[type="submit"]');
  const form = document.querySelector('form');
  let images = [];

  const updateImagesPreview = () => {
    imagesContainer.innerHTML = images.map((image, index) => `
      <div class="tw-relative tw-inline-block">
        <img src="${URL.createObjectURL(image)}" class="tw-w-20 tw-h-20 tw-object-cover tw-rounded tw-m-2" />
        <button class="remove-image-btn tw-absolute tw-flex tw-items-center tw-justify-center tw-top-0 tw-right-0 tw-w-6 tw-h-6 tw-text-white tw-rounded-full tw-bg-[#181818]" 
          type="button" data-index="${index}">
          <svg class="tw-w-2 tw-h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
          </svg>
          <span class="tw-sr-only">Delete image</span>
        </button>
      </div>
    `).join('');

    // Desactivar el input si ya hay 5 imágenes
    if (images.length >= MAX_IMAGES) {
      addPhotoInput.disabled = true;
      addPhotoLabel.classList.add('tw-opacity-50', 'tw-cursor-not-allowed');
    } else {
      addPhotoInput.disabled = false;
      addPhotoLabel.classList.remove('tw-opacity-50', 'tw-cursor-not-allowed');
    }

    const imageCount = document.querySelector('#photo-count span');
    imageCount.textContent = images.length;
  };

  // Función para reiniciar el input file
  const resetFileInput = () => {
    addPhotoInput.value = '';
  };

  // Añadir imagen
  addPhotoInput.addEventListener('change', (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (images.length + selectedFiles.length <= MAX_IMAGES) {
      images.push(...selectedFiles);
      updateImagesPreview();
    }

    resetFileInput(); // Reiniciar el input file después de cada uso
  });

  // Remover imagen
  imagesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-image-btn')) {
      const index = e.target.getAttribute('data-index');
      images.splice(index, 1);
      updateImagesPreview();
    }
  });

  // Enviar el formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const rating = document.querySelectorAll('#star-rating .fa-star.tw-text-yellow-400').length; // Calcular las estrellas seleccionadas

    if (rating === 0) {
      alert('Por favor, selecciona una calificación.');
      return;
    }

    submitButton.setAttribute('disabled', '');
    submitButton.classList.add('tw-opacity-50', 'tw-cursor-not-allowed');
    
    const formData = new FormData();
    formData.append("productId", "1");
    formData.append("storeSlug", "tienda-tes");
    formData.append("rating", rating);
    formData.append("authorName", name);
    formData.append("comment", description);

    // Añadir imágenes al formData
    images.forEach((image) => {
      formData.append("photos", image);
    });

    try {
      const response = await fetch("https://app.perflay.com/api/product-reviews/public/add-customer-review", {
        method: "POST",
        headers: {
          "Authorization": "Bearer mysecretkey.123",
        },
        body: formData,
      });

      if (response.ok) {
        console.log('send review', response);
        resetForm();
        submitButton.removeAttribute('disabled');
        submitButton.classList.remove('tw-opacity-50', 'tw-cursor-not-allowed');
        showThankYouMessage(); // Mostrar modal de agradecimiento
      } else {
        console.error('Error enviando la reseña:', response.status);
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
    }
  });

  // Nueva función para resetear completamente el formulario
  const resetForm = () => {
    form.reset();
    images = [];
    updateImagesPreview();
    resetFileInput();
    // updateStarRating(0); // Asumiendo que tienes una función para actualizar visualmente las estrellas
  };

  // Mensaje de agradecimiento
  const showThankYouMessage = () => {
    const message = document.getElementById('add-review-thank-you-message');
    const form = document.getElementById('add-review-form');

    message.classList.remove('tw-hidden');
    message.classList.add('tw-flex');

    form.classList.add('tw-hidden');
  };
});
