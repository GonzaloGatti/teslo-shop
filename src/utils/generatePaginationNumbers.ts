

export const generatePagination = (currentPage: number, totalPages: number) => {

    // Si el total de páginas es menor o igual a 7
    // mostramos todas las páginas [1,2,3,4,5,6,7]
    if( totalPages <= 7){
        return Array.from({ length: totalPages }, (val, i) => i + 1)
    }

    // Si la página actual esta dentro de las primeras 3,
    // se muestra las primeras 3, puntos suspensivos y las últimas 2
    if( currentPage <= 3){
        return [1,2,3,'...', totalPages - 1, totalPages]
    }

    // Si la página actual esta dentro de las últimas 3,
    // se muestran las primeras 2, puntos suspensivos y las ultimas 3
    if( currentPage >= totalPages - 2){
        return [1,2,'...', totalPages - 2, totalPages - 1, totalPages]
    } 

    // Si la página actual se encuentra en medio de todas,
    // se muestra la primera página, puntos suspensivos, 
    // la áctual y 2 vecinas, puntos suspensivos y la última
    return [1,'...', currentPage - 1, currentPage, currentPage + 1,'...', totalPages]
}