import * as React from 'react';
import Box from '@mui/system/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


export default function Profile() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
function editDetails(){

  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const userId = JSON.parse(localStorage.getItem("userDetails"))._id;
  const email = JSON.parse(localStorage.getItem("userDetails")).email;
  const companyName = JSON.parse(localStorage.getItem("userDetails")).companyName;
  const firstName = JSON.parse(localStorage.getItem("userDetails")).firstName;
  const align={
    textAlign:"left"
  }
  const navigate=useNavigate();
  const [redirect, setRedirect] = useState(false);

  if (redirect) {
    localStorage.clear();
    console.log("hello");
    return <Navigate to="/" />;
  }

  console.log("Hello",userId);

  return (
    <div>
      <Button onClick={handleClick}>
        <img style={{width:"70px", borderRadius:"40px"}} src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmwMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcBBQgEAwL/xABEEAABAwICBwQGBggFBQAAAAABAAIDBAUGEQcSITFBUWETcYGRFCIyQqGxIzNSYnLBFSRDkqKy0uEXU2SCkxYlVFXR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ALxREQEREBFjNajEOJLTh6AS3WsZCTnqR+09/wCFo2lBuFhxDRmdg5qlsQaYa6eTsrDRx00RzHa1A15D3AHIeOa0Udrx5i1wmkFzmifudUSmGLLo0kDyCC9KzENloc/TbtQwZf5lQxv5rXOx7hNpy/6gt56iYH5KsKDQzfJAHVlbbaY8o9aU/Jq2TdCs2XrX2PPpTH+pBYtLjHDVW7Vpr/bJHfZFUzPyzW3hninbrQyxyN5scHD4KnKnQtcAM6e8Ukh+zJC5o8wT8lpJ9HeM7J9LRxF2ocw621ZB7/dKDoNFQFv0jYtsM4prnnUhhyfDXxObJl0dsI7yCrKwvpKsd9eynme631jtgiqCNVx+67ce45FBNUWMxzWUBERAREQEREBYJyQ7lT+lPH73yTYfscpDNrKupjdtPAxsPDqfDmg2OPdKEdvklt2HSyaqaS2WrdtjhI3ho949dw67lDMNYHv2Mqg3K4TyxU0u11bU+s+Yfdbx+A5KT6OdGrezhu2I4M8wHQULxsaOBkHP7vDjyFttaAMgNg3II3hvA1hw81r6OjEtSBtqZ/Xee7PY3wyUkyWUQEXgut6tlnh7a6V1PSMO4zSBpd3DefBRubShhKJ+r+kXv6sgeR8kEzWMloLVjXDd1lbDRXemMz/ZikdqPd3B2Wfgt/mEHjulot93pjT3OjhqYiPZkbnl3HePBVXi7REWskqcMyF4A20Mz9/4Xn5O81cKIKDwpj+8YUrDbLzHPUUcTuzfBNslp/wk7SOh2ciFd1nutFeaCKtts7Z6eTc9vA8iOB6LTY0wZbsVUmU47CtjH0NUwes3o77TenlkqbtdyvmjbEksFTE4sJHpFPn6lQzg5hOzPbsPgegdFovDZrpR3m3Q3C3yiWnmGbTxHMEcCNxC9yAiIgIi+FZUxUdLNU1DwyGGN0j3Hg0DMlBB9LGLnWG1toKCTVuNYDk8b4Y+LuhO4eJ4KL6I8EsqzHiC6Qh0DHZ0cThmHuB+sPcd3Xao3QwVOkXHjnza4iqXl8pz+pgbuAy3bMh3nNdDU8EVNBHBBG2OKNoYxrRsaBuCD6BZREBV1pJ0hmxONqspY+5EZyyuGs2nHLLi4jdwHFS3Ft5Fgw9W3LYXwxns2u3F52NHmQuYp5pameSeoeZJpHl73u3ucdpKD9VlXU11S6qrqiSoqHb5ZXFzj4nh0XyzREGCMxkQD4KdYG0i19gqIqW6SyVlrJyOuS6SEHi0naQPs+WW5QZEHWVJUw1lLFU0sjZYJWB8cjTmHNO0EL7KpdB+IJJI6qw1EhcIh29NrHaGk5Pb4Eg+JVtICjGO8I02KrUYnBsddCC6lqMtrHfZP3TkMx3HgpOiCgdHOJanCOIpLVdQ+Kjnm7Gojf8AsJc8g/u4HpkeCv0HMAqotNmGBqx4ipI9uyGraN2Xuvy/hPhyUl0S4jde8NtpqmTWrLeRC8uO1zMvUd5bO9pQTlERAVe6aru6hwwyhieWy18oY7Lf2bfWd57B4qwSqJ03Vz6rFsNGw5tpKVoA++8kn4BiCWaELK2lsdRd5Gntq6TVYTwjYSNne7WPlyVlrXYft7LTZKC3RjJtNTsj28wNq2KAiIgrbTrO+PC9FC05CavaH9QGPOXmB5KkFfmme3OrsGumjaXOoqhlRs5ZFh+DyfBUGgIiICIiCVaLJ3U+P7Tq7pjLE4cwY3H5gLo5c/6HLc+sxrDU5Hs6GKSVx6uaWAfxHyXQCAiIg8d4t8N1tlVb6kZw1MTo3dMxvHUb1RejStnw5j8W+qeQ2V76KcHYC8H1T+83Z0cugFz9pbpHWfHclbSjVknbFVx8tcbPmweaDoFF8KKoZV0kFTH7E0bZG9xGYX3QCue8U/8ActLT4XHNpucERB4gFgI+a6EXPlX9Hpidrf8AuWHzcMvmg6DREQEREHwrKWGtpZ6WpYJIJ4zHIw+80jIj4rmnGGG6nC95koagOMDiXU0x3SR9/Mcf7rp1arENgt2Ibe6jucHaRna1w2PjPNp4FBy4isHEGia90D3PtLmXGm4DMMlHeDsPgfBRSXC+IYX6kliuIcOApnO+IGSDUrMbHSPYyNrnPeQ1rWgkuJ2ABSi1aO8U3J4AtrqVhP1lU4RgDu2n4K18E6ObdhuRtZVP9OuOWyV7QGRfgbz6nag+2jLCjsNWMmraBcKwiSo256gHss8AfMlTJYAy3LKAiIgKm9PkGVdZagb3RTRnwLCPmVciqTT24AWRvEumPwYgneAJzU4KssrjmTSMB8Bl+SkCi+jEZYCs3WDMeLipQgLnvSEDa9J01VuDamnqfAapP8q6EVLad7WY7pbro0epPAaeQ/eaS5vwc7yQXQ1wcAW7QdoKyo9gG6/pnCNrrHEGXsRHLlwe31XfEKQoCLB3KMY0xpQYVpWmcdvWyj6GlYfWP3ncm9UEme9rGlz3BrQMyXHIBRe56Q8K217o5rtFLK05FlM10pB66oIHiqNxLiy84lmLrlVO7DPNtNES2JvhxPU5rRjcgvo6W8Lg7HVp6in/ALp/i5hj/Xf8H91QqIL6/wAXMMf67/g/uvRS6U8JzvDHVs0Ge501O8N8wCAufUQdWW26UF0pxPbayCqiPvwyBw+C9ea5Poqyqt9U2qoKiWmqG7pInapVtYF0piplit2JiyOVx1Y64ANY48A8e6eu7uQWui/LTrDPZlwyX6QFSenmqa++WylDh9BSve4ctdw/oV1k5LnnF73Yt0lTUkRD4pKplHGR9hux5/nKC78HUposLWmnIyLKSPMdcgfzW4X5Y0Ma1rRk0DIAcAv0gKKaTrG6+4Sq4oW61RT/AKxCANpc3eB3t1h4qVrCCnNBt+bHU1djmeNWYekU3eBk9vlkfNXJvXPmPbPVYLxiyvtp7OGWQ1NE/LYxw9pnhn5FXbhe+0uIrLBcqQjKQZSMz2xvG9pQfLF+IIMM2Oe4zjXLcmxR/wCY87h+Z6Bc2XS4Vd2r5q+4TGapmdm95+AHIDcAp7pvus1TiKmtnrNp6SLXAI2Pe73vADLzVcICIiAiIgIiICIiC49DuMZKtv8A09c5S+aJmtSSuzzcwZZsJ4kcOncrUB2ZrlC31s1suFNX0ryyamkEjCOY4eO7xXVNJP6TRw1Gq5naxtfquGRbmM8ig0+Ob8zD2Gayv1gJ9Ts6cH3pXbG//fAqrtCdmdXX+ovM+bo6JpawnbrSvG/vDc/3l4tJuI5MVYjhtlrJmpaaTsYGs29tMTkXDp7o8TxVw4Mw/HhvD1LbmkOlaNed49+Q+0fy7gEG8REQEREGixhhumxPZZaCoyZJ7cE2W2KQbj3cD0KpXCt+uWAMRy0dyie2AvDKynzzHSRnM5buY+HQ6h+kDBNNimj7SIshucLT2M5HtD7DuhPl8EH6xPh2049skE0M7NfV16StiyJbnvB5g5bR+YVC3yy3Cw17qK6U5imbtDhtZIObXcQpDhzEt6wBd5bfW073QB/6xRSH+Nh3bee4/K345MN6QrLkWx1cI3tcNWWB/wA2nrx6hBzeisTE+ii629zprG79I02ZPZnJsrB8neG3oq+qYZaSpdTVUT4ahntRSN1XDwKD8IiICIsOc1oJc4ADiUGVloLnBrQSTsAG8qR4dwNf8QFj6WidDSu2+k1HqMy6cXeAVv4TwDZsKs9NqHiqrWDWdVzgBsXPVG5vfv6oIzo30cOhkivOIYcpG5OpqN49k7w9458m8OO3d99KuO20kUths836w8atXPG76pv2AR7x48h13ePHulJpjlt+GZcm7WzV+eWXMR5/zeXNebRxo6kr5YrxiKIilz14aWTfMftPHAccuPHZvDY6H8FupmsxDc4NWVzSKOJw2taf2hHAkbB0z5q1xuRrdUZBZQEREBERAREQaLFOFrZiej7C4wntGZ9lPHskj7jy6blTF7wbiXBNf+kbe+WSKMnUraRpza377duQ78wuhFgjNBT2G9MT2COHENGZhu9KpQAe9zCfkfBTinv+D8WRNp31Vuq3OGfo9TqiQf7XbfJfPEOjrDl8L5H0nolS7POejyjcTzIy1T4hQK76G7lHm61XGnqWj2WVDTG7zGY+CCa1ei3CVY7tY6KWnJG+nqHhv7pJHwWvdoew+Tsq7i0cu0b/AEqAnB2PrW4eixXFgb/4ddkPJr/yWctJUQ1C7EI/3Pd8cygsSDRFhhn1wrpxydUFv8uRW3jtODsKR+kOhtlBqH66d7Q7P8TjnmqiNm0j3D1ZBfXDlLWOa3yLgF66HRPieum7SvfS0rSdrpZu0f5DP5oJpf8AS3ZaIOjtUctxm3BwGpED+I7T4BV1XXfFekKt9DjjkmiDgRTU7dWGPkXu/Nx7lYlj0Q2ajeJbrU1FweP2ZPZxeQ2nxKn1BQUlupmU1vpYKWBnsxwxhjR4BBA8E6MKSzPjrr05lbXt9ZsYH0UJ6A+0ep8AFYmQ5LKICIiAiIgIiICIiAiIgJkiIGSIiAsZBEQZREQEREBERAREQf/Z" alt="" />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className={"p-10"}>

          <img style={{ margin: "15px auto", borderRadius: "50px", width: "80px" }}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAMFBMVEXk5ueutLff4uOnrrHn6eqrsbTZ3N25vsHHy82zuLvr7e7c3+DV2NnQ09W8wcPMz9FRQ01gAAADeUlEQVR4nO2b23LjIAxAuYibMfj//3ZxkqZJmtggWyKzw3no9PGMEAJLRIjBYDAYDAaDwWAwGAwGg4EQACBUjFFd/vsGANScXbiS/Sy6awFYH7SRd4zWLqmuXmCdfDC6eRmZ+2kVJf1q9BOvTlog/N8o/WrJ1MEKbPistKIzv1PaNLoGKzI7LR+y6RnLuYTgt5fuHixGK0hVcbrEis1prlUqseJyEnVrd5Xi2oOuQUoaz5FWsLQ4lXrFUturk/yGo1eqrQa/mEQuZRuVVqjXrz1Qa6iorVozaoU4q1q33i1UxCezQzhR16qIcSpMlFIJs3qlgFKuH2SclFkI12/COZVjmVAKMAVhhbIoWGSkZFBkTi23uxfoMh1XOlcIyyfm4LtJ0d3V/zep+RulCCP1lYmOPPokZUkQ8xcWT9y9c4XymJmwUpQH8hRwTqRXT+z2I6wIAn1N0LTfWLgPh0x6RwePChTdIXORipj9F0idcPuPvkWFKOqaWEkgUp2hlwe2NatIz70bU1PLsywe5YfoHdWU6yaQ1qgfGlr7K0wDmqmho6BntkFItRVPF/3GzqzvHidOJ6GqtiBrnFYqVpDdaf8bsMsUGebNxDIu9pi3b43bjVw6GF2YbNbvtIz0PR9xgPLhOVzGyLD0fu8Cwi7ZaK2NWf+GvNjveBlULOycUppjcfwKo6I0PdI3TtenXDYtPjt3uc6E4HL2yxzV+ryrg9Gk5iJTsnzlMc9Lahnpsk8RJkYxEDF5qZ9k/paF4paXqFgiBlP0Tm76PBaskBO1VomRN2/r5YaYzpawlAKkN6/dKrRM8ESVAkqQ0C3PEi6Ce/H2Y7caLZlPfrdUjrjGTHqHdmdqQaq8k+9QonVWboEN2P7rXy1zToXA9ck+a7nj9QHiOSv3YHX4lQmkY3vuvZY/5uRPy6YnK3ekO4R8hrBvJfGJ1diJagJbss5O8ScM7rOQMk4riFgBtZM0zdmOHxfX09rzx0+LGzCuaQFx0452q7ZeEXLY2GzVkOwTQ0JdCfVSzUMFNPULCJnLqVBZF2BmC1T90BQ7UkdaVYUK0M80cFJ1WUV1X/lA1eRNsSqVD6+a2zH+5Q8St5/qE+rlwREqUh24naTc7zJgfi5wjP39x3JneZHa/b0Px+Xulf2iwHnu/bAnpYLmZ3f2rTqw5zQYDAaDwaAD/wANKir9WY4qAQAAAABJRU5ErkJggg=="
              alt="this is an image" />
          <table>
            <tbody className={"text-nowrap"}>
            <tr>
              <td style={{ textAlign: "left" }}>Company Name:</td>
              <td style={{ textAlign: "right" }}>{companyName}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "left" }}>User Name:</td>
              <td style={{ textAlign: "right" }}>{firstName}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "left" }}>Email:</td>
              <td style={{ textAlign: "right" }}>{email}</td>
            </tr>
            </tbody>
          </table>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: "40px" }}>
            <Button variant="contained" onClick={() => {
              setRedirect(true);
            }}>LogOut</Button>

            <Button variant="contained" onClick={()=>{
              navigate("/editDetails");
            }}>Edit Details</Button>

          </div>
        </div>
      </Popover>
    </div>
  );
}