import { Stack } from "@mui/material";
import Logo from "../assets/logo2.png";

const Thinking = () => {
  return (
    <Stack flexDirection={'flex-row-reverse'} justifyContent={"flex-start"} alignItems={"flex-start"} gap={2} paddingY={2}>
    <Stack flexDirection={'column'} justifyContent={ 'flex-start'} alignItems={'flex-start'} gap={2} sx={{ backgroundColor: "secondary.dark", borderRadius: "10px", padding: "10px", maxWidth: "80%" }}>
      Thinking...

    </Stack>
  </Stack>
  );
};

export default Thinking;
