import './rating.scss';

export default function Rating({ rating, size, thickness, fontSize, primaryColor, secondaryColor }) {
    const percentage = rating * 10;
    const degree = percentage/100*360;
    const contentSize = size - thickness*2;
    const endEdgeTranslation = contentSize/2 + thickness/2;

    const mainStyles = {
        width: `${size}rem`,
        height: `${size}rem`,
        background: `conic-gradient(var(--${primaryColor}) ${percentage}%, var(--${secondaryColor}) 0)`,
        fontSize: fontSize,
    }

    const contentStyles = {
        top: `${(size-contentSize)/2}rem`,
        left: `${(size-contentSize)/2}rem`,
        width: `${contentSize}rem`,
        height: `${contentSize}rem`,
    }

    const startEdgeStyles = {
        width: `${thickness}rem`,
        height: `${thickness}rem`,
        backgroundColor: `var(--${primaryColor})`,
    }

    const endEdgeStyles = {
        ...startEdgeStyles,
        transform: `translate(-50%, -50%) rotate(${degree}deg) translateY(-${endEdgeTranslation}rem)`,
    }

    return (
        <div 
            className='rating'
            style={mainStyles}
        >
            <div
                className='rating__content'
                style={contentStyles}
            >
                {rating}
            </div>
            <div
                className='rating__bar-edge rating__bar-edge--start'
                style={startEdgeStyles}
            ></div>
            <div
                className='rating__bar-edge rating__bar-edge--end'
                style={endEdgeStyles}
            ></div>
        </div>
    )
}

Rating.defaultProps = {
    rating: 0,
    size: 2.75,
    thickness: 0.25,
    fontSize: '0.875rem',
    primaryColor: 'button-background-color',
    secondaryColor: 'main-background-color',
}