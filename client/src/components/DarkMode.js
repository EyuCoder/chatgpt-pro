import useDarkMode from '../hooks/useDarkMode';
import { MdOutlineNightlight, MdOutlineWbSunny } from 'react-icons/md';

/**
 * A toggle for switching between light and dark modes.
 *
 * @param {Object} props - The properties for the component.
 * @param {boolean} props.open - Whether the sidebar is open or not.
 */
const DarkMode = (props) => {
  const [darkTheme, setDarkTheme] = useDarkMode();

  /**
   * Toggles the dark mode.
   */
  const handleMode = () => setDarkTheme(!darkTheme);
  return (
    <div className="nav">
      <span className="nav__item" onClick={handleMode}>
        {darkTheme ? (
          <>
            <div className="nav__icons">
              <MdOutlineWbSunny />
            </div>
            <h1 className={`${!props.open && "hidden"}`}>Light mode</h1>
          </>
        ) : (
          <>
            <div className="nav__icons">
              <MdOutlineNightlight />
            </div>
            <h1 className={`${!props.open && "hidden"}`}>Night mode</h1>
          </>
        )}

      </span>
    </div>
  )
}

export default DarkMode;