import PropTypes from 'prop-types';
import useDarkMode from '../hooks/useDarkMode';
import { MdOutlineNightlight, MdOutlineWbSunny } from 'react-icons/md';

/**
 * A toggle for switching between light and dark modes.
 *
 * @param {Object} props - The properties for the component.
 * @param {boolean} props.open - Whether the sidebar is open or not.
 */
const ToggleTheme = (props) => {
  const [theme, setTheme] = useDarkMode();

  /**
   * Toggles the dark mode.
   */
  const handleToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <a onClick={handleToggle}>
      {theme ? (
        <>
          <MdOutlineWbSunny size={15} />
          <p className={`${!props.open && 'hidden'}`}>Light mode</p>
        </>
      ) : (
        <>
          <MdOutlineNightlight size={15} />
          <p className={`${!props.open && 'hidden'}`}>Night mode</p>
        </>
      )}
    </a>
  );
};

export default ToggleTheme;

ToggleTheme.propTypes = {
  open: PropTypes.bool,
};
