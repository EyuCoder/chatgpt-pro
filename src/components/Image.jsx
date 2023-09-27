import PropTypes from 'prop-types';

/**
 * A component that displays an image.
 *
 * @param {string} text - The source of the image to display.
 * @returns {JSX.Element} - A JSX element representing the image.
 */
const Image = (props) => {
  return (
    <>
      <img
        className='bg-cover rounded-lg shadow-lg'
        src={props.url}
        alt='dalle generated picture'
        loading='lazy'
      />
    </>
  );
};

export default Image;
Image.propTypes = {
  url: PropTypes.string.isRequired,
};
