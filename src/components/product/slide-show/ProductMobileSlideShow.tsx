'use client';

import { Swiper, SwiperSlide } from "swiper/react"

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './slideshow.css';
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { ProductImage } from "../product-image/ProductImage";


interface Props{
  images: string[]
  title: string
  className?: string
}

export const ProductMobileSlideShow = ({ images, title, className }: Props) => {

  return (
    <div className={ className }>
      <Swiper
        style={{
          width: '100vw',
          height: '500px'
        }}  
        navigation={ true }
        pagination
        autoplay = {
          {
            delay: 2500
          }
        }
        modules={[FreeMode, Pagination, Autoplay]}
        className="mySwiper2"
      >
        {
          images.map(image => (
            <SwiperSlide key={ image }>
              <ProductImage 
                src={ image }
                width={ 600 }
                height={ 500 }
                alt={ title }
                className='object-fill'
              />
            </SwiperSlide>
          ))
        }
      </Swiper>

    </div>
  )
}
