// ** React Imports
import { useEffect, useState } from 'react';

// ** Next Import

// ** MUI Imports
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

// ** Icon Imports

// ** Custom Component Import
import FormLocationField from 'src/@core/components/form/FormLocationField';
import Loader from 'src/@core/components/loader';
import { handleError } from 'src/@core/coreHelper';
import { updateUser } from 'src/services/usersServices';
import { IUser } from 'src/types/users';

interface State {
  newPassword: string;
  showNewPassword: boolean;
  confirmNewPassword: string;
  showConfirmNewPassword: boolean;
}

interface DataType {
  icon: string;
  color: string;
  device: string;
  browser: string;
  location: string;
  recentActivity: string;
}

const data: DataType[] = [
  {
    color: 'info.main',
    location: 'Switzerland',
    device: 'HP Specter 360',
    icon: 'tabler:brand-windows',
    browser: 'Chrome on Windows',
    recentActivity: '10, July 2022 20:07',
  },
  {
    color: 'error.main',
    device: 'iPhone 12x',
    location: 'Australia',
    browser: 'Chrome on iPhone',
    icon: 'tabler:device-mobile',
    recentActivity: '13, July 2022 10:10',
  },
  {
    location: 'Dubai',
    color: 'success.main',
    device: 'OnePlus 9 Pro',
    icon: 'tabler:brand-android',
    browser: 'Chrome on Android',
    recentActivity: '4, July 2022 15:15',
  },
  {
    location: 'India',
    device: 'Apple IMac',
    color: 'secondary.main',
    icon: 'tabler:brand-apple',
    browser: 'Chrome on macOS',
    recentActivity: '20, July 2022 21:01',
  },
  {
    color: 'info.main',
    location: 'Switzerland',
    device: 'HP Specter 360',
    browser: 'Chrome on Windows',
    icon: 'tabler:brand-windows',
    recentActivity: '15, July 2022 11:15',
  },
  {
    location: 'Dubai',
    color: 'success.main',
    device: 'OnePlus 9 Pro',
    icon: 'tabler:brand-android',
    browser: 'Chrome on Android',
    recentActivity: '14, July 2022 20:20',
  },
];

interface Props {
  user: IUser;
}

const UserViewLocation = ({ user }: Props) => {
  const win: any = window;

  // ** States

  const [map, setMap] = useState<any>(null);
  const [addressPlace, setAddressPlace] = useState<any>(''); // todo michel valor iniciarl
  const [loading, setLoading] = useState<boolean>(false);

  const onPlaceSelected = (place: any) => {
    setAddressPlace(place);
  };

  const saveLocation = async () => {
    try {
      setLoading(true);

      const userResponse = await updateUser(user.id, { mainAddress: addressPlace });

      setLoading(false);
    } catch (e) {
      setLoading(false);
      handleError(e);
    }
  };

  useEffect(() => {
    if (!map || !addressPlace) return;

    const bounds = new win.google.maps.LatLngBounds();

    const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

    const marker = new win.google.maps.Marker({
      position: addressPlace.addressObject.geometry.location,
      draggable: false,
      id: user.id,
      map: map,
      icon: image,
    });

    // remove marker
    // marker.setMap(null);

    // win.google.maps.event.addListener(marker, 'map_changed', function () {
    // if (!theMap) {
    //   theMap.unbindAll();
    // }
    // });
    bounds.extend(addressPlace.addressObject.geometry.location);

    map.fitBounds(bounds);

    // searchBox.set('map', map);
    map.setZoom(Math.min(map.getZoom(), 12));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressPlace, map]);

  useEffect(() => {
    if (!win.google) return;

    const mapAux = new win.google.maps.Map(document.getElementById('map-canvas'), {
      center: {
        lat: 12.9715987,
        lng: 77.59456269999998,
      },
      zoom: 12,
    });

    setMap(mapAux);

    // map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('pac-input'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.google]);

  if (loading) return <Loader />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Location' />
          <CardContent>
            {/* <Alert icon={false} severity='warning' sx={{ mb: 4 }}>
              <AlertTitle
                sx={{ fontWeight: 500, fontSize: '1.125rem', mb: (theme) => `${theme.spacing(2.5)} !important` }}
              >
                Ensure that these requirements are met
              </AlertTitle>
              Minimum 8 characters long, uppercase & symbol
            </Alert> */}

            <form onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <FormLocationField
                    label={'Address'}
                    value={addressPlace ? addressPlace.addressString : ''}
                    placeholder={'Av libertador 123'}
                    onPlaceSelected={(place: any) => {
                      onPlaceSelected(place);
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type='button'
                    variant='contained'
                    onClick={() => {
                      saveLocation();
                    }}
                  >
                    Save Location
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Map' />

          <Divider sx={{ m: '0 !important' }} />

          <div id='map-canvas' style={{ height: 300 }} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserViewLocation;
