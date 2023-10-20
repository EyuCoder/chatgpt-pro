import { useState, useEffect, useContext } from "react";
import {
  MdClose,
  MdMenu,
  MdOutlineCoffee,
  MdOutlineVpnKey,
  MdDelete,
} from "react-icons/md";
import { AiOutlineGithub } from "react-icons/ai";
import { ChatContext } from "../context/chatContext";
// import bot from "../assets/logo.png";
import ToggleTheme from "./ToggleTheme";
import Modal from "./Modal";
import Setting from "./Setting";

/**
 * MUI imports.
 */
import Drawer from "@mui/material/Drawer";
import { Delete } from "@mui/icons-material";
import { Box, Button, List, ListItem } from "@mui/material";

/**
 * A sidebar component that displays a list of nav items and a toggle
 * for switching between light and dark modes.
 *
 * @param {Object} props - The properties for the component.
 */
const SideBar = (theme) => {
  const [open, setOpen] = useState(true);
  const [, , clearChat] = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);

  // const [mobileOpen, setMobileOpen] = useState(false); // MUI example, we can use open/setOpen instead

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  function handleResize() {
    window.innerWidth <= 720 ? setOpen(false) : setOpen(true);
  }
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  function clear() {
    clearChat();
  }

  return (
    <>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
        sx={
          {
            // width: '320px',
          }
        }
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={handleDrawerToggle}>
            <MdClose size={25} />
          </Button>
        </div>

        <List>
          <ListItem>
            <Button onClick={clear}>
              <Delete />
              <p className={`${!open && "hidden"}`}>Clear chat</p>
            </Button>
          </ListItem>
        </List>

        <ul className="absolute bottom-0 w-full gap-1 menu rounded-box">
          {/* <li>
            <ToggleTheme open={open} />
          </li> */}
          {/* <li>
          <a
            href="https://www.buymeacoffee.com/eyuel"
            rel="noreferrer"
            target="_blank"
          >
            <MdOutlineCoffee size={15} />
            <p className={`${!open && "hidden"}`}>Support this project</p>
          </a>
        </li> */}
          {/* <li>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://github.com/EyuCoder/chatgpt-clone"
          >
            <AiOutlineGithub size={15} />
            <p className={`${!open && "hidden"}`}>Github</p>
          </a>
        </li>
        <li>
          <a onClick={() => setModalOpen(true)}>
            <MdOutlineVpnKey size={15} />
            <p className={`${!open && "hidden"}`}>OpenAI Key</p>
          </a>
        </li> */}
        </ul>
        <Modal
          title="Setting"
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        >
          <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </Modal>
      </Drawer>

      <Box>
        {open ? (
          <Button onClick={handleDrawerToggle}>
            <MdClose size={25} />
          </Button>
         ) : (
          <Button onClick={handleDrawerToggle}>
            <MdMenu size={25} />
          </Button>
        )}
      </Box>
    </>
  );
};

export default SideBar;
