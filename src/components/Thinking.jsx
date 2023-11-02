import { Stack } from "@mui/material";

const Thinking = () => {
  return (
    <Stack
      flexDirection={"flex-row-reverse"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      gap={2}
      paddingY={2}
    >
      <Stack
        flexDirection={"column"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        gap={2}
        sx={{
          background: "linear-gradient(to right, #31246e, #3920c7)", // Use linear-gradient with "to right" direction
          color: "#ffffff",
          borderRadius: "10px",
          padding: "10px",
          maxWidth: "80%",
        }}
      >
        Thinking...
      </Stack>
    </Stack>
  );
};

export default Thinking;
