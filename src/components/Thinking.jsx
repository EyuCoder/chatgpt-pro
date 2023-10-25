import { Stack } from "@mui/material";

const Thinking = () => {
  return (
  <Stack flexDirection={'flex-row-reverse'} justifyContent={"flex-start"} alignItems={"flex-start"} gap={2} paddingY={2}>
    <Stack flexDirection={'column'} justifyContent={ 'flex-start'} alignItems={'flex-start'} gap={2} sx={{ backgroundColor: "#c9d5c0", borderRadius: "10px", padding: "10px", maxWidth: "80%", color:"#212121" }}>
      Thinking...
    </Stack>
  </Stack>
  );
};

export default Thinking;
