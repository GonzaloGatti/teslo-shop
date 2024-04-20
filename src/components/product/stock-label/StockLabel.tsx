"use client";

import { getStockBySlug } from "@/actions";
import { titleFont } from "@/config/fonts";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {

    const [stock, setStock] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getStock = async () => {
            const inStock = await getStockBySlug(slug);
    
            setStock(inStock)
            setIsLoading(false)
        };

        getStock();
    }, [slug]);


    return (
        <>
            {
                isLoading ? (
                    <p className={`${titleFont.className} antialiased font-bold bg-gray-200 animate-pulse`}>
                        &nbsp;
                    </p>
                ) : (
                    <p className={`${titleFont.className} antialiased font-bold`}>
                        Stock: { stock }
                    </p>
                )
            }
        </>
    );
    };
