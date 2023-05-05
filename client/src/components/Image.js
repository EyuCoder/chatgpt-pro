import React from 'react';

/**
 * A component that displays an image.
 *
 * @param {string} text - The source of the image to display.
 * @returns {JSX.Element} - A JSX element representing the image.
 */
const Image = (props) => {
  return (
    <div className='message__wrapper'>
      <img
        className='message__img'
        src={props.url}
        alt='dalle generated'
        loading='lazy'
      />
    </div>
  );
};

export default Image;
