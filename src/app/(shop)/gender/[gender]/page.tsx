export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { notFound } from "next/navigation";

interface Props{
  params: {
    gender: string
  },
  searchParams: {
    page?: string
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {

  const page = searchParams.page ? parseInt( searchParams.page ) : 1;

  const { gender } = params;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page, gender: gender as Gender})


  const label: Record<string, string> = {
    'men': 'hombres',
    'women': 'mujeres',
    'kid': 'niños',
    'unisex': 'todos'
  }

  // if(id === 'kid'){
  //   notFound()
  // }

  return (
    <>
      <Title title={`Artículos para ${ label[gender] }`} subtitle={`Todos los productos`} className='mb-3'/>

      <ProductGrid products={ products }/>

      <Pagination totalPages={ totalPages }/>
    </>
  );
}