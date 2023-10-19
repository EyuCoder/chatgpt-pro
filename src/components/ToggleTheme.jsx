import PropTypes from "prop-types";
import useDarkMode from "../hooks/useDarkMode";
import { NightlightOutlined, WbSunnyOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
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
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button onClick={handleToggle}>
      {theme ==="dark" ? <><NightlightOutlined /> <p className={`${!props.open && 'hidden'}`}>Light mode</p> </>: <> <WbSunnyOutlined /> <p className={`${!props.open && 'hidden'}`}>Night mode</p> </>}
    </Button>
  );
};

export default ToggleTheme;

ToggleTheme.propTypes = {
  open: PropTypes.bool,
};
