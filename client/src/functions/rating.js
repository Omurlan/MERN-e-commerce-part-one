import React from 'react'
import StarRating from 'react-star-ratings'

export const showAverage = (product) => {
    if (product && product.ratings) {
        let ratingsArray = product && product.ratings
        let total = []
        let length = ratingsArray.length
        console.log('length', length)
        ratingsArray.map((r) => total.push(r.star))
        let totalReduced = total.reduce((prev, next) => prev + next, 0)
        console.log('Total reduced', totalReduced)
        let highest = length * 5
        console.log('highest', highest)
        let result = (totalReduced * 5) / highest
        console.log('result', result)

        return (
            <div className="text-center pt-1 pb-3">
                <span>
                    <StarRating
                        starDimension="20"
                        starSpacing="2px"
                        starRatedColor="red"
                        editing={false}
                        rating={result}
                    />
                    ({product.ratings.length})
                </span>
            </div>
        )
    }
}