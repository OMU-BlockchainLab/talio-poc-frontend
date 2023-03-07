import { yupResolver } from '@hookform/resolvers/yup';
import ArticleIcon from '@mui/icons-material/Article';
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import LayoutAdmin from 'layout/LayoutAdmin';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { CREAT_CERTIFICATES } from 'service/certificate';
import { useMutation, useQuery } from 'urql';
import * as yup from 'yup';
import { storage } from '../../firebase.config';
import { default as dayjs } from 'dayjs';
import { ApiContext } from 'contexts/apiProviderContext';
import apiBlockchain from 'api/configBlockchain';
import { useSnackbar } from 'notistack';
import { GET_LIST_USER } from 'service/auth';

let schema = yup.object().shape({
  name: yup.string().required('Required'),
  origirinalDate: yup.date().required('Required'),
  expirationDate: yup.date().required('Required'),
});

interface EventReturn {
  result?: string;
  message?: string;
  value?: string | null;
}
export interface ICreateCertificateProps {}

interface DataForm {
  name: string;
  issuer: string;
  origirinalDate: Date;
  expirationDate: Date;
}

interface Skill {
  name: string;
  value: string;
}

interface Certificate {
  name: string;
  issuer: string;
  yearIssued: number;
  urlPDF: string;
}

type TypeFileCV = 'CV' | 'CERTIFICATE';

export default function CreateCertificate(props: ICreateCertificateProps) {
  const [fileCV, setFileCV] = React.useState<File>();
  const [itemCV, setItemCV] = React.useState<string>();
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [progresspercent, setProgresspercent] = React.useState(0);
  const [certificaties, setCertificaties] = React.useState<File>();
  const { userDetail } = React.useContext(ApiContext);
  const [filesCerti, setFilesCerti] = React.useState<string>();
  const [{}, createCert] = useMutation(CREAT_CERTIFICATES);
  const navigate = useNavigate();
  const [orgnazition, setOrgnazition] = React.useState<string>('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataForm>({
    resolver: yupResolver(schema),
  });
  const [{ data, error, fetching }, getListUser] = useQuery({
    query: GET_LIST_USER,
    variables: { page: 0, outputRoleCode: 'Organization' },
    requestPolicy: 'network-only',
  });

  React.useEffect(() => {
    getListUser();
  }, []);

  let filesUpdated: string[] = [];
  const handleUploadFirebase = async (file, type: TypeFileCV) => {
    setIsUploading(true);
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (type === 'CV') {
            setItemCV(downloadURL);
            setIsUploading(false);
          } else {
            // filesUpdated = filesUpdated.concat(downloadURL);
            // let newFiles = filesUpdated;
            setFilesCerti(downloadURL);
            setIsUploading(false);
          }
        });
      }
    );
  };

  const handleUploadCertificate = (e: any) => {
    setCertificaties(e.target.files[0]);
    setIsUploading(true);
    e.preventDefault();
    handleUploadFirebase(e.target.files[0], 'CERTIFICATE');
    setIsUploading(false);
    // e.preventDefault();
    // setIsUploading(true);
    // const files = e.target.files;
    // for (const key of Object.keys(files)) {
    //   handleUploadFirebase(files[key], 'CERTIFICATE');
    // }
    // setIsUploading(false);
  };

  console.log(isUploading);

  const onSubmit: SubmitHandler<DataForm> = async (data) => {
    const { account, allAccounts, allInjected, api, injector, provider } = await apiBlockchain();
    const events = new Promise(async (resolve, reject) => {
      await api.tx.certificate
        .createCertificate(userDetail?.id, orgnazition, dayjs(data.expirationDate).unix())
        .signAndSend(
          account.address,
          { signer: injector.signer },
          ({ status, events, dispatchError }) => {
            if (dispatchError) {
              if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = api.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                const err = 'Error'.concat(':', section, '.', name);
                let res: EventReturn = {
                  result: 'Error',
                  message: err,
                  value: null,
                };
                //console.log(`${section}.${name}: ${docs.join(' ')}`);
                resolve(res);
              } else {
                // Other, CannotLookup, BadOrigin, no extra info
                let err: EventReturn = {
                  result: 'Error',
                  message: dispatchError.toString(),
                  value: null,
                };
                resolve(err);
              }
            } else {
              events.forEach(({ event, phase }) => {
                const { data, method, section }: any = event;
                if (section == 'certificate') {
                  let res: EventReturn = {
                    result: 'Success',
                    message: ''.concat(section, '.', method),
                    value: data?.toHuman()[0],
                  };
                  resolve(res);
                }
              });
            }
          }
        );
    });
    const resBlockchain: EventReturn = (await events) as EventReturn;
    console.log(
      '🚀 ~ file: CreateCertificate.tsx ~ line 187 ~ constonSubmit:SubmitHandler<DataForm>= ~ resBlockchain',
      resBlockchain
    );
    enqueueSnackbar(resBlockchain.message);

    if (resBlockchain?.result?.toString().includes('Success')) {
      const params = {
        ...data,
        issuer: orgnazition,
        origirinalDate: dayjs(data.origirinalDate).format('DD/MM/YYYY'),
        expirationDate: dayjs(data.expirationDate).format('DD/MM/YYYY'),
        certUrl: filesCerti,
        userId: userDetail?.id,
        blockchainId: resBlockchain?.value,
      };
      console.log(params);
      const createdCer = await createCert(params);
      if (createdCer.data?.createCert) {
        navigate('/organizations');
      } else {
        alert('Create certificate fail, please enter again!');
      }
    }
  };
  const onChangeSelectOrg = (e) => {
    const value = e.target.value;
    setOrgnazition(value);
  };

  return (
    <LayoutAdmin>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '950px',
          padding: '32px',
          background: '#FFFFFF',
          boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.05)',
          borderRadius: '20px',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 800,
            fontSize: '40px',
            lineHeight: '48px',
            color: '#4A4950',
            textAlign: 'left',
          }}
        >
          CREATE A NEW CERTIFICATES
        </Typography>
        <Divider sx={{ margin: '31px 0', width: '30%' }} />
        <form
          style={{ display: 'flex', flexDirection: 'column' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TextField
              {...register('name')}
              name="name"
              error={!!errors.name}
              label="Certificate name"
              variant="outlined"
              id="outlined-basic"
            />
          </Box>
          <Divider sx={{ margin: '31px 0' }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* <FormControl> */}
            <InputLabel id="demo-simple-select-label" sx={{ textAlign: 'left' }}>
              Issuer
            </InputLabel>
            <Select
              value={orgnazition}
              sx={{
                textAlign: 'left',
              }}
              onChange={onChangeSelectOrg}
            >
              {data?.users?.rows?.map(
                (org: any) =>
                  org.isVerified && (
                    <MenuItem key={Math.random()} value={org.id}>
                      {org.profile.nickname}
                    </MenuItem>
                  )
              )}
            </Select>
            {/* </FormControl> */}
          </Box>
          <Divider sx={{ margin: '31px 0' }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <InputLabel sx={{ textAlign: 'left' }}>Origirinal date</InputLabel>
            <TextField
              {...register('origirinalDate')}
              name="origirinalDate"
              error={!!errors.origirinalDate}
              type="date"
              variant="outlined"
              id="outlined-basic"
            />
          </Box>
          <Divider sx={{ margin: '31px 0' }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <InputLabel sx={{ textAlign: 'left' }}>Expirations date</InputLabel>
            <TextField
              {...register('expirationDate')}
              name="expirationDate"
              error={!!errors.expirationDate}
              type="date"
              variant="outlined"
              id="outlined-basic"
            />
          </Box>
          <Divider sx={{ margin: '31px 0' }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
              }}
            >
              <Box sx={{ display: 'flex' }}>
                <ArticleIcon />
                <Typography marginLeft={'5px'}>Certificate</Typography>
              </Box>
              <Button variant="contained" component="label" disabled={isUploading}>
                Upload
                <input
                  accept="application/pdf"
                  id="contained-button-file"
                  multiple={false}
                  type="file"
                  onChange={handleUploadCertificate}
                  style={{ display: 'none' }}
                />
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              {/* {certificaties.length > 0 &&
                Object.keys(certificaties)?.map((key: any) => (
                  <Chip
                    label={certificaties[key].name}
                    sx={{ width: 'fit-content', marginLeft: '5px' }}
                  />
                ))} */}
              {!!certificaties && (
                <Chip
                  label={certificaties?.name}
                  sx={{ width: 'fit-content', marginLeft: '5px' }}
                />
              )}
            </Box>
          </Box>
          <Divider sx={{ margin: '31px 0' }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Button
              type="submit"
              sx={{ width: 'fit-content' }}
              variant="contained"
              disabled={isUploading}
            >
              Create certificates
            </Button>
          </Box>
        </form>
      </Box>
    </LayoutAdmin>
  );
}
