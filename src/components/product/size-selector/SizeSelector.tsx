import { ValidSize } from "@/interfaces"
import clsx from "clsx"

interface Props{
    selectedSize?: ValidSize
    availableSizes: ValidSize[]
    onChangeSize: ( size: ValidSize ) => void
}

export const SizeSelector = ({ selectedSize = undefined, availableSizes,onChangeSize }: Props) => {
  return (
    <div className='my-5'>

        <h3 className='font-bold text-md mb-3'>Talles disponibles</h3>

        <div className='flex'>
            {
                availableSizes.map(size => (
                    <button
                        key={ size }
                        className={
                            clsx(
                                'mr-2 hover:underline',
                                {
                                    'underline': size === selectedSize
                                }
                            )
                        }
                        onClick={ () => onChangeSize(size) }
                    >
                        { size }
                    </button>
                ))
            }
        </div>

    </div>
  )
}
