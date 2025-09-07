import React, { useState, useEffect } from 'react';
import { Phone, Mail, Menu, X, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft, ZoomIn } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Types
interface Item {
  id: number;
  title: string;
  category: string;
  price?: string;
  description: string;
  images: string[];
  featured?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CatalogData {
  categories: Category[];
  items: Item[];
  contactInfo: {
    phone: string;
    email: string;
    whatsapp: string;
  };
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'category' | 'item'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [catalogData, setCatalogData] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load catalog data from JSON file
  useEffect(() => {
    const loadCatalogData = async () => {
      try {
        const response = await fetch('/data/catalog.json');
        const data: CatalogData = await response.json();
        setCatalogData(data);
      } catch (error) {
        console.error('Error loading catalog data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCatalogData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  // Show error state if data failed to load
  if (!catalogData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-red-600 text-lg">حدث خطأ في تحميل البيانات</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const { categories, items, contactInfo } = catalogData;

  const featuredItems = items.filter(item => item.featured);

  const Footer = () => (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">م</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">متجر المنزل</h3>
              <p className="text-sm text-gray-500">كنوز من البيت</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-amber-50 p-8 rounded-2xl shadow-sm border border-blue-100 max-w-2xl mx-auto">
            <h4 className="text-xl font-bold text-gray-800 mb-6">تواصل معنا</h4>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-50 group"
              >
                <Phone className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-gray-700">{contactInfo.phone}</span>
              </a>
              <a 
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-amber-50 group"
              >
                <Mail className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-gray-700">{contactInfo.email}</span>
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">© 2025 متجر المنزل. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </div>
    </footer>
  );

  const FullScreenImageModal = () => {
    if (!fullScreenImage) return null;

    const currentImageIndex = selectedItem ? selectedItem.images.indexOf(fullScreenImage) : 0;
    const images = selectedItem ? selectedItem.images : [fullScreenImage];

    const goToNextImage = () => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      setFullScreenImage(images[nextIndex]);
    };

    const goToPrevImage = () => {
      const prevIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
      setFullScreenImage(images[prevIndex]);
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        onClick={() => setFullScreenImage(null)}
      >
        <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
          <img 
            src={fullScreenImage} 
            alt="Full screen view"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          
          {/* Navigation arrows for multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </>
          )}
          
          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
          
          <button
            onClick={() => setFullScreenImage(null)}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  };

  const ContactSection = () => (
    <div className="bg-gradient-to-r from-blue-50 to-amber-50 p-6 rounded-2xl shadow-sm border border-blue-100 mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">تواصل معنا</h3>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a 
          href={`tel:${contactInfo.phone}`}
          className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-blue-50 group"
        >
          <Phone className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-gray-700">{contactInfo.phone}</span>
        </a>
        <a 
          href={`mailto:${contactInfo.email}`}
          className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-amber-50 group"
        >
          <Mail className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-gray-700">{contactInfo.email}</span>
        </a>
      </div>
    </div>
  );

  const Header = () => (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="cursor-pointer flex items-center gap-2"
            onClick={() => {
              setCurrentPage('home');
              setMobileMenuOpen(false);
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">م</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">متجر المنزل</h1>
              <p className="text-xs text-gray-500">كنوز من البيت</p>
            </div>
          </div>
          
          <div className="hidden md:block">
            <a 
              href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              تواصل معنا
            </a>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <a 
              href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              تواصل معنا
            </a>
          </div>
        )}
      </div>
    </header>
  );

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">التصنيفات</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentPage('category');
                }}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer text-center group border border-gray-100 hover:border-blue-200"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Items Carousel */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">المنتجات المميزة</h2>
          
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{ 
              clickable: true,
              bulletClass: 'swiper-pagination-bullet-custom',
              bulletActiveClass: 'swiper-pagination-bullet-active-custom'
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
            }}
            className="featured-swiper"
          >
            {featuredItems.map((item) => (
              <SwiperSlide key={item.id}>
                <div 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group h-80"
                  onClick={() => {
                    setSelectedItem(item);
                    setCurrentPage('item');
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.images[0]} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button className="swiper-button-prev-custom bg-white hover:bg-blue-50 p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group">
              <ArrowRight className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            </button>
            <button className="swiper-button-next-custom bg-white hover:bg-blue-50 p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group">
              <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );

  const CategoryPage = () => {
    const categoryItems = items.filter(item => item.category === selectedCategory);
    const category = categories.find(cat => cat.id === selectedCategory);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <button 
              onClick={() => setCurrentPage('home')}
              className="hover:text-blue-600 transition-colors"
            >
              الرئيسية
            </button>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{category?.name}</span>
          </nav>

          <div className="flex items-center gap-4 mb-8">
            <div className="text-5xl">{category?.icon}</div>
            <h1 className="text-3xl font-bold text-gray-900">{category?.name}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setCurrentPage('item');
                }}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-blue-200 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={item.images[0]} 
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  {item.price && (
                    <p className="text-2xl font-bold text-blue-600">{item.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const ItemPage = () => {
    if (!selectedItem) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <button 
              onClick={() => setCurrentPage('home')}
              className="hover:text-blue-600 transition-colors"
            >
              الرئيسية
            </button>
            <ChevronLeft className="w-4 h-4" />
            <button 
              onClick={() => {
                setSelectedCategory(selectedItem.category);
                setCurrentPage('category');
              }}
              className="hover:text-blue-600 transition-colors"
            >
              {categories.find(cat => cat.id === selectedItem.category)?.name}
            </button>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{selectedItem.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              {/* Main Image */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
                <div className="relative h-96 group cursor-pointer">
                  <img 
                    src={selectedItem.images[0]} 
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                    onClick={() => setFullScreenImage(selectedItem.images[0])}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {selectedItem.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {selectedItem.images.map((image, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300"
                      onClick={() => setFullScreenImage(image)}
                    >
                      <div className="relative aspect-square">
                        <img 
                          src={image} 
                          alt={`${selectedItem.title} ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">
                  {categories.find(cat => cat.id === selectedItem.category)?.icon}
                </span>
                <span className="text-blue-600 font-medium">
                  {categories.find(cat => cat.id === selectedItem.category)?.name}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedItem.title}</h1>
              
              {selectedItem.price && (
                <div className="text-3xl font-bold text-blue-600 mb-6">{selectedItem.price}</div>
              )}

              <div className="prose prose-gray max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">{selectedItem.description}</p>
              </div>

              <div className="space-y-4">
                <a
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=مرحبا، أنا مهتم بـ ${selectedItem.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                >
                  تواصل عبر واتساب
                </a>
                <a
                  href={`mailto:${contactInfo.email}?subject=استفسار عن ${selectedItem.title}`}
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                >
                  راسلنا عبر الإيميل
                </a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />
      <FullScreenImageModal />
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'category' && <CategoryPage />}
      {currentPage === 'item' && <ItemPage />}
    </div>
  );
}

export default App;