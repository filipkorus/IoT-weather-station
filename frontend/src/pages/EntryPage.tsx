import React from "react";
import {Box, Typography} from "@mui/material";
import StationList from "@/components/StationList.tsx";
import LoginRegisterButton from "@/components/LoginRegisterButton.tsx";
import {useNavigate} from "react-router-dom";

const EntryPage: React.FC = () => {
  const navigate = useNavigate();
  return (
      <Box
          sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "97vh",
              borderRadius: "8px",
              overflowY: "hidden",
              // backgroundColor: "#9bcce5",
          }}
      >

          <Box
              sx={{
                  backgroundColor: "#0d598f",
                  padding: "1%",
                  textAlign: "center",
                  marginBottom: "1%",
                  borderRadius: "8px",
              }}
          >
              <Typography
                  variant="h4"
                  sx={{
                      color: "white",
                      fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  }}
              >
                  ❄️Witamy na Narciarskiej Stacji Pomiarowo Pogodowej!❄️
              </Typography>
          </Box>

          {/* Kontener z listą stacji */}
          <Box
              sx={{
                  flex: 1,
                  flexDirection: 'column',
                  alignItems: 'center', // Wyśrodkowanie poziome
                  justifyContent: 'flex-start',
                  display:'flex',
                  padding: "1%",
                  backgroundColor: "#9bcce5",
                  borderRadius: "8px",
                  marginBottom: "1%",
                  overflowY: "auto",
                  maxHeight:{lg:'70vh',xs:'80vh'},
              }}
          >
              <StationList/>
          </Box>
          <Box
              sx={{
                  // padding: "16px",
                  // backgroundColor: "#0d598f",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "1%",
              }}
          >
              <LoginRegisterButton title='Logowanie' onClick={() => navigate("/login")}  sx={{ width: { xs: "100px", md: "150px" } }}></LoginRegisterButton>
              <LoginRegisterButton title='Rejestracja' onClick={() => navigate("/register")}  sx={{ width: { xs: "100px", md: "150px" } }}></LoginRegisterButton>
          </Box>
      </Box>
  );
  //     <div>
  //         <Typography variant="h2">Witamy na narciarskiej stacji pogodowej!</Typography>
  //         <Typography>jesteś ciekawy warunków na swoim ulubionym stoku? wybierz stację z listy aby je poznać</Typography>
  //         <Typography>jesteś włascicielem stacji? kliknij tu aby zarejestrować się lub zalogować i parować stacje  </Typography>
  //     </div>
  // );
};

export default EntryPage;
