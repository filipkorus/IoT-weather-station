import React, {useState} from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // For Grid 2.0
import Paper from '@mui/material/Paper';
import {Typography, Box, Button, TableFooter} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Buttons from "@/components/Buttons.tsx";
import { useNavigate } from 'react-router-dom';
// import LoginRegisterButton from "@/components/LoginRegisterButton.tsx";


const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const handleClick = () => {
        setIsButtonClicked(true); // Toggle the state
    };

    const navigate = useNavigate();

    return (
        <Box padding={3} sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#9bcce5',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '90vh',
        }}>

            <Grid container spacing={3} rowSpacing={{ xs: 3, sm: 2, md: 5 }}>
                <Grid xs={12} sm={6} md={12} sx={{height: '30%'}}>
                    {/*<Paper elevation={3} sx={{backgroundColor: '#9bcce5', boxShadow: 5, padding: '20px', height: '30%' }}>*/}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {/* Nazwa stoku po lewej stronie */}
                            <Typography variant="h5" sx={{color: 'white'}}>Nazwa stoku</Typography>

                            {/* Przyciski po prawej stronie */}
                            {/*<Box sx={{ display: 'flex', gap: 2 }}>*/}
                            {/*    <LoginRegisterButton  title="Logowanie" onClick={() => navigate('/login')}/>*/}
                            {/*    <LoginRegisterButton title="Rejestracja" onClick={() => navigate('/register')}/>*/}
                            {/*</Box>*/}
                        </Box>
                    {/*</Paper>*/}
                </Grid>

                <Grid xs={6} sm={6} md={3}>
                    <Buttons
                        title="Wilgotność"
                        value={70}
                        unit="%"
                        onClick={() => navigate('/humidity')}
                    />
                </Grid>

                {/* Square Tile - Pressure */}
                <Grid xs={6} sm={6} md={3}>
                    <Buttons
                        title="Ciśnienie"
                        value={1000}
                        unit="hPa"
                        onClick={() => navigate('/pressure')}
                    />
                </Grid>

                {/* Long Tile - PM Levels */}
                <Grid xs={12} md={6}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: '#0d598f',
                            boxShadow: 5,
                            padding: '20px',
                            height: '80%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            '&:hover': {
                                backgroundColor: '#1f4152',
                            },

                        }}
                        onClick={() => navigate('/airquality')}
                    >
                        {/* Box dla pm 1.0 */}
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                            <Typography variant="body2">pm 1.0</Typography>
                            <Typography variant="h4">20</Typography>
                            <Typography variant="h4" sx={{fontSize: { xs: '1.5rem', sm: '2rem' }, textTransform: 'none' }}>µg/m³</Typography>
                        </Box>

                        {/* Box dla pm 2.5 */}
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                            <Typography variant="body2">pm 2.5</Typography>
                            <Typography variant="h4">25</Typography>
                            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' },textTransform: 'none' }}>µg/m³</Typography>
                        </Box>

                        {/* Box dla pm 10 */}
                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                            <Typography variant="body2">pm 10</Typography>
                            <Typography variant="h4">50</Typography>
                            <Typography variant="h4" sx={{fontSize: { xs: '1.5rem', sm: '2rem' }, textTransform: 'none' }}>µg/m³</Typography>
                        </Box>

                    </Button>
                </Grid>

                {/* Square Tile - Temperature */}
                <Grid xs={6} sm={6} md={3}>
                    <Buttons
                        title="Temperatura"
                        value={0}
                        unit="°C"

                        onClick={() => navigate('/pressure')}
                    />
                </Grid>

                {/* Square Tile - Snow Level */}
                <Grid xs={6} sm={6} md={3}>
                    <Buttons
                        title="Poziom śniegu"
                        value={2}
                        unit="m"
                        onClick={() =>  navigate('/snow')}
                    />
                </Grid>

                {/* Heart Tile */}
                <Grid xs={12} sm={6} md={6}>
                    <Paper elevation={3} sx={{ boxShadow: 5, padding: '20px', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Typography variant="body2">ikonka jaka pogoda bd</Typography>
                        {/* Box dla pm 1.0 */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">temperatura</Typography>
                            <Typography variant="h6">minimalna zapowiadan</Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">Czy będą opady</Typography>
                            <Typography variant="h6">Tak/Nie</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid xs={12} sm={12} md={12}>
                    <Paper elevation={3} sx={{
                        boxShadow: 5,
                        padding: '20px',
                        textAlign: 'center',
                        height: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>

                        <Box sx={{ width: '100%', mb: 2 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    boxShadow: 5,
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: isButtonClicked ? '#bd0d0d' : '#60020e', // Kolor zmienia się w zależności od stanu
                                    '&:hover': {
                                        backgroundColor: isButtonClicked ? '#bd0d0d' : '#60020e' // Kolor po najechaniu
                                    },
                                }}
                                onClick={handleClick} // Użyj funkcji handleClick
                            >
                                <FavoriteIcon sx={{ marginRight: '8px' }} /> {/* Ikona serca */}
                                <Typography variant="h6">Podoba mi się ten stok!</Typography>
                            </Button>
                        </Box>

                        {/* Sekcja licznika polubień */}
                        <Box sx={{ border: '1px solid', padding: '10px', borderRadius: '5px', width: '50%', textAlign: 'center' }}>
                            <Typography variant="body2">Licznik polubień</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <TableFooter sx={{color:'white'}}>Pomiar pobrano: XXXXXXXXX</TableFooter>
            </Grid>
        </Box>
    );
};

export default HomePage;