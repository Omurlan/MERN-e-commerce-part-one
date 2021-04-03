import React from 'react'
import StartRating from 'react-star-ratings'

const Star = ({ starClick, numberOfStars }) => {
    return (
        <>
            <StartRating
                changeRating={() => starClick(numberOfStars)}
                numberOfStars={numberOfStars}
                starDimension="20px"
                starSpacing="2px"
                starHoverColor="red"
                starEmptyColor="red"
            />
            <br />
        </>
    )
}

export default Star
